import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prismadb } from "@/lib/prismadb";

const corsHeaders = {
  // Engedélyezi bármely eredeti domainről érkező kéréseket
  "Access-Control-Allow-Origin": "*",
  // Engedélyezi a GET, POST, PUT, DELETE, OPTIONS HTTP műveleteket
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  // Engedélyezi a Content-Type és Authorization fejléceket
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      name,
      artist,
      price,
      releaseYear,
      images,
      isFeatured,
      isArchived,
      genreId,
    } = body;

    if (!session?.user) {
      return new NextResponse("Hitelesítetlen", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Név szükséges", { status: 400 });
    }
    if (!artist) {
      return new NextResponse("Előadó megadása kötelező", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Képek szükségesek", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Ár szükséges", { status: 400 });
    }
    if (!releaseYear) {
      return new NextResponse("Megjelenési év megadása kötelező", {
        status: 400,
      });
    }

    if (!genreId) {
      return new NextResponse("Műfaj azonosító szükséges", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Bolt azonosító szükséges", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Engedély nélküli", { status: 405 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        artist,
        price,
        releaseYear,
        isFeatured,
        isArchived,
        genreId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const genreId = searchParams.get("genreId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const query = searchParams.get("query") || undefined; // Vegyük fel, hogy a frontend egy "query" paraméterrel küldi a keresést

    if (!params.storeId) {
      return new NextResponse("Bolt azonosító szükséges", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        genreId,
        //Searchbarral való kereséshez
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
