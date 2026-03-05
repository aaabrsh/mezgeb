import {
  CurrencyType,
  Prisma,
  PrismaClient,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const globalCurrencies: Prisma.CurrencyCreateInput[] = [
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    type: CurrencyType.FIAT,
    precision: 2,
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    type: CurrencyType.FIAT,
    precision: 2,
  },
  {
    code: "ETB",
    name: "Ethiopian Birr",
    symbol: "Br",
    type: CurrencyType.FIAT,
    precision: 2,
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    type: CurrencyType.FIAT,
    precision: 2,
  },
];

const main = async () => {
  for (const currency of globalCurrencies) {
    const existing = await prisma.currency.findFirst({
      where: {
        code: currency.code,
        userId: null,
      },
    });

    if (existing) {
      await prisma.currency.update({
        where: { id: existing.id },
        data: currency,
      });
    } else {
      await prisma.currency.create({
        data: { ...currency, userId: undefined },
      });
    }
  }
};

main()
  .then(() => {
    console.log("Seeding completed");
  })
  .catch((e) => {
    console.error("seedig failed: ", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
