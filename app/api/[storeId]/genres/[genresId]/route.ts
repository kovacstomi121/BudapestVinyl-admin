import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { genreId: string } }
) {
  try {
    if (!params.genreId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const size = await prismadb.genre.findUnique({
      where: {
        id: params.genreId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[GENRE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { genreId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.genreId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const genre = await prismadb.genre.delete({
      where: {
        id: params.genreId,
      },
    });

    return NextResponse.json(genre);
  } catch (error) {
    console.log("[GENRE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const genre = await prismadb.genre.update({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(genre);
  } catch (error) {
    console.log("[GENRE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
