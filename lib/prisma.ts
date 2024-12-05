import { PrismaClient } from "@prisma/client";
import { pagination } from "prisma-extension-pagination";

/**
 * Creates a singleton instance of PrismaClient with pagination extension.
 *
 * @returns A PrismaClient instance with pagination configured.
 */
const prismaClientSingleton = () => {
  return new PrismaClient().$extends(
    pagination({
      pages: { includePageCount: true, limit: 20 },
    })
  );
};

// Declare globalThis to include the prismaGlobal property
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Use the existing prismaGlobal instance if available, otherwise create a new one
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// Ensure the prismaGlobal instance is not recreated in development mode
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
