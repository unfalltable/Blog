import { NextRequest, NextResponse } from 'next/server';
import { projectsRepository, projectInterestsRepository } from '@/services/repositories';
import { extractTokenFromHeader, verifyToken } from '@/services/auth';
import { ErrorCode, ProjectInterest } from '@/types';

// GET - 获取项目感兴趣状态
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    // 获取当前用户
    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);
    let userId: string | null = null;
    
    if (token) {
      const result = verifyToken(token);
      if (result.success && result.payload) {
        userId = result.payload.userId;
      }
    }

    // 获取感兴趣数量
    const interests = await projectInterestsRepository.find(i => i.projectId === projectId);
    const count = interests.length;
    
    // 检查当前用户是否已感兴趣
    const isInterested = userId ? interests.some(i => i.userId === userId) : false;

    return NextResponse.json({
      success: true,
      data: { count, isInterested },
    });
  } catch (error) {
    console.error('Get interest error:', error);
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: '获取失败' } },
      { status: 500 }
    );
  }
}

// POST - 添加/取消感兴趣
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

    // 检查是否已感兴趣
    const existingInterests = await projectInterestsRepository.find(
      i => i.projectId === projectId && i.userId === userId
    );

    if (existingInterests.length > 0) {
      // 取消感兴趣
      await projectInterestsRepository.delete(existingInterests[0].id);
      
      // 更新项目感兴趣数
      const newCount = Math.max(0, (project.interestCount || 0) - 1);
      await projectsRepository.update(projectId, { interestCount: newCount });

      return NextResponse.json({
        success: true,
        data: { isInterested: false, count: newCount },
      });
    } else {
      // 添加感兴趣
      const interest: ProjectInterest = {
        id: `interest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        projectId,
        userId,
        username,
        createdAt: new Date().toISOString(),
      };
      await projectInterestsRepository.create(interest);

      // 更新项目感兴趣数
      const newCount = (project.interestCount || 0) + 1;
      await projectsRepository.update(projectId, { interestCount: newCount });

      return NextResponse.json({
        success: true,
        data: { isInterested: true, count: newCount },
      });
    }
  } catch (error) {
    console.error('Toggle interest error:', error);
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: '操作失败' } },
      { status: 500 }
    );
  }
}
