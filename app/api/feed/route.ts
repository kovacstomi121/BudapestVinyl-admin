import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PAGE_SIZE = 8;
export const fetchFeed = async ({ take = PAGE_SIZE, skip = 0 }) => {
  try {
    const results = await prisma.product.findMany({
      take,
      skip,
    });

    const total = await prisma.product.count();

    return {
      data: results,
      metadata: {
        hasNextPage: skip + take < total,
        totalPages: Math.ceil(total / take),
      },
    };
  } catch (error) {
    console.error("Error fetching feed:", error);
    throw new Error("Internal Server Error");
  } finally {
    await prisma.$disconnect();
  }
};
