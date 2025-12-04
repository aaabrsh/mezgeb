import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const main = async () => {
  const globalCurrencies = [
    { abbrev: "USD", name: "US Dollar", symbol: "$" },
    { abbrev: "EUR", name: "Euro", symbol: "€" },
    { abbrev: "ETB", name: "Ethiopian Birr", symbol: "Br" },
    { abbrev: "GBP", name: "British Pound", symbol: "£" },
  ];

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
        data: { ...currency, userId: null },
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
