import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prismadb } from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession();

    const body = await req.json();

    const { name } = body;

    if (!session?.user) {
      return new NextResponse("Hitelesítetlen", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Név szükséges", { status: 400 });
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
      return new NextResponse("Engedély nélkül", { status: 405 });
    }

    const genre = await prismadb.genre.create({
      data: {
        name,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(genre);
  } catch (error) {
    console.log("[GENRES_POST]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Bolt azonosító szükséges", { status: 400 });
    }

    const genres = await prismadb.genre.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(genres);
  } catch (error) {
    console.log("[GENRES_GET]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}
