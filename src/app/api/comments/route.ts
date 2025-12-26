import { NextRequest, NextResponse } from 'next/server';
import { commentsRepository } from '@/services/repositories';
import { extractTokenFromHeader, verifyToken } from '@/services/auth';
import { ErrorCode, Comment, CommentTargetType } from '@/types';

// GET - 获取评论列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('targetType') as CommentTargetType;
    const targetId = searchParams.get('targetId');

    if (!targetType || !targetId) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.MISSING_REQUIRED_FIELD, message: '缺少参数' } },
        { status: 400 }
      );
    }

    const allComments = await commentsRepository.find(
      (c) => c.targetType === targetType && c.targetId === targetId
    );

    // 分离顶级评论和回复
    const topLevelComments = allComments.filter((c) => !c.parentId);
    const replies = allComments.filter((c) => c.parentId);

    // 按时间倒序排列顶级评论
    topLevelComments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 构建评论树
    const commentsWithReplies = topLevelComments.map((comment) => ({
      ...comment,
      replies: replies
        .filter((r) => r.parentId === comment.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    }));

    return NextResponse.json({
      success: true,
      data: commentsWithReplies,
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: '获取评论失败' } },
      { status: 500 }
    );
  }
}

// POST - 添加评论或回复
export async function POST(request: NextRequest) {
  try {
    // 验证登录
    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.UNAUTHORIZED, message: '请先登录' } },
        { status: 401 }
      );
    }

    const result = verifyToken(token);
    if (!result.success || !result.payload) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.UNAUTHORIZED, message: '登录已过期' } },
        { status: 401 }
      );
    }

    const { userId, username } = result.payload;
    const body = await request.json();
    const { targetType, targetId, content, parentId } = body;

    if (!targetType || !targetId || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.MISSING_REQUIRED_FIELD, message: '缺少必填字段' } },
        { status: 400 }
      );
    }

    // 如果是回复，更新父评论的回复数
    if (parentId) {
      const parentComment = await commentsRepository.getById(parentId);
      if (parentComment) {
        await commentsRepository.update(parentId, {
          replyCount: (parentComment.replyCount || 0) + 1,
        });
      }
    }

    const comment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      targetType,
      targetId,
      userId,
      username,
      content: content.trim(),
      parentId: parentId || null,
      replyCount: 0,
      createdAt: new Date().toISOString(),
    };

    await commentsRepository.create(comment);

    return NextResponse.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: '评论失败' } },
      { status: 500 }
    );
  }
}
