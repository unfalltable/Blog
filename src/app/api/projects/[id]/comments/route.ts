import { NextRequest, NextResponse } from 'next/server';
import { projectsRepository, projectCommentsRepository } from '@/services/repositories';
import { extractTokenFromHeader, verifyToken } from '@/services/auth';
import { ErrorCode, ProjectComment } from '@/types';

// GET - 获取项目评论列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    const comments = await projectCommentsRepository.find(c => c.projectId === projectId);
    
    // 按时间倒序排列
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: '获取评论失败' } },
      { status: 500 }
    );
  }
}

// POST - 添加评论
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

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

    // 检查项目是否存在
    const project = await projectsRepository.getById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.NOT_FOUND, message: '项目不存在' } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.MISSING_REQUIRED_FIELD, message: '评论内容不能为空' } },
        { status: 400 }
      );
    }

    const comment: ProjectComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      projectId,
      userId,
      username,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    await projectCommentsRepository.create(comment);

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
