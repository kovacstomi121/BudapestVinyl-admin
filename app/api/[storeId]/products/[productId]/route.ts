import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";
import { getServerSession } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Termék azonosító szükséges", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        genre: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return new NextResponse("Hitelesítetlen", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Termék azonosító szükséges", { status: 400 });
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

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const session = await getServerSession();

    const body = await req.json();

    const {
      name,
      artist,
      price,
      releaseYear,
      images,
      genreId,
      isFeatured,
      isArchived,
    } = body;

    if (!session?.user) {
      return new NextResponse("Hitelesítetlen", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Termék azonosító szükséges", { status: 400 });
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
      return new NextResponse("Megjelenési év szükséges", {
        status: 400,
      });
    }

    if (!genreId) {
      return new NextResponse("Műfaj azonosító szükséges", { status: 400 });
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

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        genreId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}
