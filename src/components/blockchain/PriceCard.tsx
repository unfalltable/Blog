'use client';

import { CryptoPrice } from '@/types';
import {
  formatPrice,
  formatPercentageChange,
  formatMarketCap,
  getPriceChangeColorClass,
} from '@/services/blockchain';

interface PriceCardProps {
  price: CryptoPrice;
}

/**
 * PriceCard component displays a single cryptocurrency price
 * with color coding for price changes
 * Requirements: 6.1, 6.4
 */
export function PriceCard({ price }: PriceCardProps) {
  const changeColorClass = getPriceChangeColorClass(price.change24h);

  return (
    <article className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {price.symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {price.name}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {price.symbol}
            </span>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${changeColorClass} ${
            price.change24h >= 0
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
          }`}
        >
          {formatPercentageChange(price.change24h)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPrice(price.price)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">市值</span>
          <span className="text-gray-700 dark:text-gray-300">
            {formatMarketCap(price.marketCap)}
          </span>
        </div>
      </div>
    </article>
  );
}
