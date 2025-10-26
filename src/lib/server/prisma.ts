import { PrismaClient } from "@prisma/client";
import { NODE_ENV } from "$env/static/private";

let prisma: PrismaClient;

if (NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(globalThis as any).prisma) {
    (globalThis as any).prisma = new PrismaClient();
  }
  prisma = (globalThis as any).prisma;
}

export default prisma;
