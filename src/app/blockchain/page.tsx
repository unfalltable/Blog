import { fetchCryptoPrices, fetchBlockchainNews } from '@/services/blockchain';
import { PriceTable, NewsList, PriceCard } from '@/components/blockchain';

/**
 * Blockchain page - displays cryptocurrency prices and news
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
export default async function BlockchainPage() {
  const [prices, news] = await Promise.all([
    fetchCryptoPrices(),
    fetchBlockchainNews(),
  ]);

  const lastUpdated = prices.length > 0 ? prices[0].lastUpdated : undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            区块链信息
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            实时加密货币行情和最新区块链新闻
          </p>
        </header>

        {/* Price Cards for Mobile */}
        <section className="mb-8 lg:hidden">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            实时行情
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {prices.slice(0, 4).map((price) => (
              <PriceCard key={price.id} price={price} />
            ))}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Price Table */}
          <section className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 hidden lg:block">
              实时行情
            </h2>
            <PriceTable prices={prices} lastUpdated={lastUpdated} />
          </section>

          {/* News Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              最新新闻
            </h2>
            <NewsList news={news} />
          </section>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: '区块链信息 - 个人博客',
  description: '实时加密货币行情和最新区块链新闻',
};

// Revalidate every 30 seconds for fresh price data
export const revalidate = 30;
