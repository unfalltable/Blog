import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/services/auth';
import { ErrorCode } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.MISSING_REQUIRED_FIELD, message: '用户名和密码是必填项' } },
        { status: 400 }
      );
    }

    const result = await login(username, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.INVALID_CREDENTIALS, message: '用户名或密码错误' } },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: '登录失败，请稍后重试' } },
      { status: 500 }
    );
  }
}
