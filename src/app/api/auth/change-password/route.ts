import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, hashPassword, extractTokenFromHeader, verifyToken } from '@/services/auth';
import { usersRepository } from '@/services/repositories';
import { ErrorCode } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Verify token
    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.UNAUTHORIZED, message: '请先登录' } },
        { status: 401 }
      );
    }

    const tokenResult = verifyToken(token);
    if (!tokenResult.success || !tokenResult.payload) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.UNAUTHORIZED, message: '登录已过期，请重新登录' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.MISSING_REQUIRED_FIELD, message: '请填写当前密码和新密码' } },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.VALIDATION_ERROR, message: '新密码长度至少6个字符' } },
        { status: 400 }
      );
    }

    // Get user
    const user = await usersRepository.getById(tokenResult.payload.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.NOT_FOUND, message: '用户不存在' } },
        { status: 404 }
      );
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.INVALID_CREDENTIALS, message: '当前密码错误' } },
        { status: 400 }
      );
    }

    // Hash new password and update
    const newPasswordHash = await hashPassword(newPassword);
    await usersRepository.update(user.id, { passwordHash: newPasswordHash });

    return NextResponse.json({
      success: true,
      message: '密码修改成功',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: '修改密码失败，请稍后重试' } },
      { status: 500 }
    );
  }
}
