import { Prisma, PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const globalCurrencies: Prisma.CurrencyCreateInput[] = [
  { abbrev: "USD", name: "US Dollar", symbol: "$" },
  { abbrev: "EUR", name: "Euro", symbol: "€" },
  { abbrev: "ETB", name: "Ethiopian Birr", symbol: "Br" },
  { abbrev: "GBP", name: "British Pound", symbol: "£" },
];

const main = async () => {
  for (const currency of globalCurrencies) {
    const existing = await prisma.currency.findFirst({
      where: {
        abbrev: currency.abbrev,
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
