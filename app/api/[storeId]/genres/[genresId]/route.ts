import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prismadb } from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { genreId: string } }
) {
  try {
    if (!params.genreId) {
      return new NextResponse("Genre id szükséges", { status: 400 });
    }

    const size = await prismadb.genre.findUnique({
      where: {
        id: params.genreId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[GENRE_GET]", error);
    return new NextResponse("Hiba", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { genreId: string; storeId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return new NextResponse("Nincs bejelentkezve", { status: 403 });
    }

    if (!params.genreId) {
      return new NextResponse("Genre id szükséges", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Nincs bejelentkezve", { status: 405 });
    }

    const genre = await prismadb.genre.delete({
      where: {
        id: params.genreId,
      },
    });

    return NextResponse.json(genre);
  } catch (error) {
    console.log("[GENRE_DELETE]", error);
    return new NextResponse("Hiba", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { genreId: string; storeId: string } }
) {
  try {
    const session = await getServerSession();

    const body = await req.json();

    const { name } = body;

    if (!session?.user) {
      return new NextResponse("Nincs bejelentkezve", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Név szükséges", { status: 400 });
    }

    if (!params.genreId) {
      return new NextResponse("Genre id szükséges", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Nincs bejelentkezve", { status: 405 });
    }

    const genre = await prismadb.genre.update({
      where: {
        id: params.genreId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(genre);
  } catch (error) {
    console.log("[GENRE_PATCH]", error);
    return new NextResponse("Hiba", { status: 500 });
  }
}
