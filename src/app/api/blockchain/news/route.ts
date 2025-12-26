import { NextRequest, NextResponse } from 'next/server';
import { fetchBlockchainNews, getNewsById } from '@/services/blockchain';
import { ErrorCode } from '@/types';

/**
 * GET /api/blockchain/news
 * Fetch blockchain news articles sorted by publication date
 * Requirements: 6.3
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const limit = searchParams.get('limit');

    if (id) {
      // Get single news article
      const article = await getNewsById(id);
      
      if (!article) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCode.NOT_FOUND,
              message: `News article with id "${id}" not found`,
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: article,
      });
    }

    // Get all news articles (sorted by publishedAt descending)
    let news = await fetchBlockchainNews();

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        news = news.slice(0, limitNum);
      }
    }

    return NextResponse.json({
      success: true,
      data: news,
      total: news.length,
    });
  } catch (error) {
    console.error('Error fetching blockchain news:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.EXTERNAL_API_ERROR,
          message: 'Failed to fetch blockchain news',
        },
      },
      { status: 500 }
    );
  }
}
