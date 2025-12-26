import { CryptoPrice, BlockchainNews, ErrorCode, AppError } from '@/types';

// ============================================
// Blockchain Service
// CoinGecko API integration and news fetching
// Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
// ============================================

// CoinGecko API base URL
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Major cryptocurrencies to track
const MAJOR_COINS = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano', 'ripple', 'polkadot', 'dogecoin'];

// Cache for price data (to avoid rate limiting)
let priceCache: {
  data: CryptoPrice[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 30000; // 30 seconds cache

// ============================================
// Price Data Functions
// Requirements: 6.1, 6.2, 6.5
// ============================================

/**
 * Fetch cryptocurrency prices from CoinGecko API
 * Requirements: 6.1, 6.2
 */
export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  // Check cache first
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_TTL) {
    return priceCache.data;
  }

  try {
    const ids = MAJOR_COINS.join(',');
    const url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 30 }, // Next.js cache revalidation
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    const prices: CryptoPrice[] = data.map((coin: CoinGeckoMarketData) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      marketCap: coin.market_cap,
      lastUpdated: coin.last_updated || new Date().toISOString(),
    }));

    // Update cache
    priceCache = {
      data: prices,
      timestamp: Date.now(),
    };

    return prices;
  } catch (error) {
    // If we have cached data, return it even if stale
    if (priceCache) {
      return priceCache.data;
    }
    
    // Return mock data as fallback
    return getMockPrices();
  }
}


/**
 * Get a single cryptocurrency price by ID
 * Requirements: 6.1
 */
export async function getCryptoPriceById(id: string): Promise<CryptoPrice | null> {
  const prices = await fetchCryptoPrices();
  return prices.find((price) => price.id === id) || null;
}

/**
 * Get mock prices for fallback/testing
 */
function getMockPrices(): CryptoPrice[] {
  const now = new Date().toISOString();
  return [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 43250.00, change24h: 2.5, marketCap: 847000000000, lastUpdated: now },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2280.00, change24h: -1.2, marketCap: 274000000000, lastUpdated: now },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 312.50, change24h: 0.8, marketCap: 48000000000, lastUpdated: now },
    { id: 'solana', symbol: 'SOL', name: 'Solana', price: 98.75, change24h: 5.3, marketCap: 42000000000, lastUpdated: now },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.52, change24h: -0.5, marketCap: 18000000000, lastUpdated: now },
    { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 0.62, change24h: 1.1, marketCap: 33000000000, lastUpdated: now },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 7.85, change24h: -2.1, marketCap: 10000000000, lastUpdated: now },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.082, change24h: 3.2, marketCap: 11500000000, lastUpdated: now },
  ];
}

// CoinGecko API response type
interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
  last_updated: string | null;
}

// ============================================
// News Functions
// Requirements: 6.3
// ============================================

// Mock news data (in production, this would fetch from RSS or news API)
const mockNews: BlockchainNews[] = [
  {
    id: 'news_1',
    title: 'Bitcoin Reaches New Monthly High Amid Institutional Interest',
    summary: 'Bitcoin has surged to its highest level this month as institutional investors continue to show strong interest in cryptocurrency markets.',
    source: 'CryptoNews',
    url: 'https://example.com/news/1',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'news_2',
    title: 'Ethereum Layer 2 Solutions See Record Transaction Volume',
    summary: 'Layer 2 scaling solutions on Ethereum have processed a record number of transactions, signaling growing adoption of the technology.',
    source: 'BlockchainDaily',
    url: 'https://example.com/news/2',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: 'news_3',
    title: 'Major Bank Announces Cryptocurrency Custody Services',
    summary: 'A leading global bank has announced plans to offer cryptocurrency custody services to institutional clients starting next quarter.',
    source: 'FinanceToday',
    url: 'https://example.com/news/3',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
  },
  {
    id: 'news_4',
    title: 'DeFi Protocol Launches New Yield Farming Opportunities',
    summary: 'A popular decentralized finance protocol has introduced new yield farming pools with competitive APY rates.',
    source: 'DeFiWatch',
    url: 'https://example.com/news/4',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    id: 'news_5',
    title: 'Regulatory Framework for Cryptocurrencies Takes Shape',
    summary: 'Government officials have outlined a new regulatory framework aimed at providing clarity for cryptocurrency businesses.',
    source: 'CryptoRegulator',
    url: 'https://example.com/news/5',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
  },
];


/**
 * Fetch blockchain news articles
 * Returns news sorted by publication date (newest first)
 * Requirements: 6.3
 */
export async function fetchBlockchainNews(): Promise<BlockchainNews[]> {
  // In production, this would fetch from an RSS feed or news API
  // For now, return mock data sorted by publishedAt
  return sortNewsByDate(mockNews);
}

/**
 * Sort news articles by publication date (newest first)
 * Requirements: 6.3
 */
export function sortNewsByDate(news: BlockchainNews[]): BlockchainNews[] {
  return [...news].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get news by ID
 */
export async function getNewsById(id: string): Promise<BlockchainNews | null> {
  const news = await fetchBlockchainNews();
  return news.find((item) => item.id === id) || null;
}

// ============================================
// Price Formatting Utilities
// Requirements: 6.4, 6.6
// ============================================

/**
 * Format price for display
 * Requirements: 6.6
 */
export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else if (price >= 1) {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  } else {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }
}

/**
 * Format percentage change for display
 * Requirements: 6.4
 */
export function formatPercentageChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

/**
 * Get color class for price change
 * Green for positive, red for negative
 * Requirements: 6.4
 */
export function getPriceChangeColorClass(change: number): string {
  if (change > 0) {
    return 'text-green-500';
  } else if (change < 0) {
    return 'text-red-500';
  }
  return 'text-gray-500';
}

/**
 * Format market cap for display
 */
export function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  }
  return `$${marketCap.toLocaleString()}`;
}

/**
 * Format relative time for news articles
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

// ============================================
// Validation Functions
// Requirements: 6.5
// ============================================

/**
 * Validate CryptoPrice data against expected schema
 * Requirements: 6.5
 */
export function validateCryptoPrice(data: unknown): data is CryptoPrice {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const price = data as Record<string, unknown>;

  return (
    typeof price.id === 'string' &&
    typeof price.symbol === 'string' &&
    typeof price.name === 'string' &&
    typeof price.price === 'number' &&
    typeof price.change24h === 'number' &&
    typeof price.marketCap === 'number' &&
    typeof price.lastUpdated === 'string'
  );
}

/**
 * Validate BlockchainNews data against expected schema
 */
export function validateBlockchainNews(data: unknown): data is BlockchainNews {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const news = data as Record<string, unknown>;

  return (
    typeof news.id === 'string' &&
    typeof news.title === 'string' &&
    typeof news.summary === 'string' &&
    typeof news.source === 'string' &&
    typeof news.url === 'string' &&
    typeof news.publishedAt === 'string'
  );
}

/**
 * Clear price cache (useful for testing)
 */
export function clearPriceCache(): void {
  priceCache = null;
}
