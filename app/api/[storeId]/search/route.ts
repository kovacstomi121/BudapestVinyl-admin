import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";

const corsHeaders = {
  // Engedélyezi bármely eredeti domainről érkező kéréseket
  "Access-Control-Allow-Origin": "*",
  // Engedélyezi a GET, POST, PUT, DELETE, OPTIONS HTTP műveleteket
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  // Engedélyezi a Content-Type és Authorization fejléceket
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const genreId = searchParams.get("genreId") || undefined;
    const query = searchParams.get("query") || undefined; // Vegyük fel, hogy a frontend egy "query" paraméterrel küldi a keresést
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Bolt azonosító szükséges", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        genreId,
        OR: [
          { name: query ? { contains: query } : undefined },
          { artist: query ? { contains: query } : undefined },
        ],
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        genre: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products, { headers: corsHeaders });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}
