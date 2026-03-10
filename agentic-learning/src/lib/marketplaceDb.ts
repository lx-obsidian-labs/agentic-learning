import { prisma } from '@/lib/prisma';

type Model = {
  [method: string]: (...args: unknown[]) => Promise<unknown>;
};

type MarketplaceModels = {
  teacherProfile: Model;
  teacherService: Model;
  teacherAvailability: Model;
  booking: Model;
  paymentTransaction: Model;
  payout: Model;
  review: Model;
};

export type MarketplaceDb = typeof prisma & MarketplaceModels;

export const marketplaceDb = prisma as MarketplaceDb;

export function ensureMarketplaceDb(): MarketplaceDb {
  const raw = prisma as unknown as Record<string, unknown>;
  const required: Array<keyof MarketplaceModels> = [
    'teacherProfile',
    'teacherService',
    'teacherAvailability',
    'booking',
    'paymentTransaction',
    'payout',
    'review',
  ];

  const missing = required.filter((key) => !(key in raw));
  if (missing.length > 0) {
    throw new Error(
      `Marketplace Prisma models are not generated yet: ${missing.join(
        ', '
      )}. Run prisma migrate/db push and prisma generate.`
    );
  }

  return marketplaceDb;
}

export function asMarketplaceDb<T>(db: T): T & MarketplaceModels {
  return db as T & MarketplaceModels;
}
