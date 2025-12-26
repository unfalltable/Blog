import { NextRequest, NextResponse } from 'next/server';
import { fetchCryptoPrices, getCryptoPriceById } from '@/services/blockchain';
import { ErrorCode } from '@/types';

/**
 * GET /api/blockchain/prices
 * Fetch cryptocurrency prices
 * Requirements: 6.1, 6.2
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get single cryptocurrency price
      const price = await getCryptoPriceById(id);
      
      if (!price) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCode.NOT_FOUND,
              message: `Cryptocurrency with id "${id}" not found`,
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: price,
      });
    }

    // Get all cryptocurrency prices
    const prices = await fetchCryptoPrices();

    return NextResponse.json({
      success: true,
      data: prices,
      lastUpdated: prices.length > 0 ? prices[0].lastUpdated : new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.EXTERNAL_API_ERROR,
          message: 'Failed to fetch cryptocurrency prices',
        },
      },
      { status: 500 }
    );
  }
}
