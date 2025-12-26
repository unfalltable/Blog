import { NextRequest, NextResponse } from 'next/server';
import { createUser, generateToken } from '@/services/auth';
import { usersRepository } from '@/services/repositories';
import { ErrorCode } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, email } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.MISSING_REQUIRED_FIELD, message: '用户名和密码是必填项' } },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.VALIDATION_ERROR, message: '用户名长度需要在3-20个字符之间' } },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.VALIDATION_ERROR, message: '密码长度至少6个字符' } },
        { status: 400 }
      );
    }

    // Create user (all new users are visitors by default)
    const result = await createUser(username, password, 'visitor');

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Generate token for auto-login after registration
    const users = await usersRepository.find((u) => u.username === username);
    const user = users[0];
    const token = generateToken(user);

    return NextResponse.json({
      success: true,
      data: {
        user: result.user,
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: '注册失败，请稍后重试' } },
      { status: 500 }
    );
  }
}
