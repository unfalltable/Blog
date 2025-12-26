'use client';

import { CryptoPrice } from '@/types';
import {
  formatPrice,
  formatPercentageChange,
  formatMarketCap,
  getPriceChangeColorClass,
} from '@/services/blockchain';

interface PriceTableProps {
  prices: CryptoPrice[];
  lastUpdated?: string;
}

/**
 * PriceTable component displays cryptocurrency prices in a table format
 * with color coding for price changes
 * Requirements: 6.1, 6.4
 */
export function PriceTable({ prices, lastUpdated }: PriceTableProps) {
  if (prices.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          暂无行情数据
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          无法获取加密货币价格数据
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {lastUpdated && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            最后更新: {new Date(lastUpdated).toLocaleString('zh-CN')}
          </span>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                币种
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                价格
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                24h 涨跌
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell"
              >
                市值
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {prices.map((price) => {
              const changeColorClass = getPriceChangeColorClass(price.change24h);
              return (
                <tr
                  key={price.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs mr-3">
                        {price.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {price.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {price.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatPrice(price.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${changeColorClass}`}>
                      {formatPercentageChange(price.change24h)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right hidden sm:table-cell">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {formatMarketCap(price.marketCap)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
