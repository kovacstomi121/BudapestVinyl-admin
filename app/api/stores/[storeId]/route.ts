import { NextResponse } from "next/server";
import nextAuth, { getServerSession } from "next-auth";
import { prismadb } from "@/lib/prismadb";
import { authOptions } from "../../auth/[...nextauth]/options";
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { name } = body;

    if (!session?.user) {
      return new NextResponse("Nem hitelesített", { status: 403 });
    }

    if (!name) {
      return new NextResponse("A név kötelező", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Az üzlet azonosítója kötelező", { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Nincs bejelentkezve", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Üzlet azonosító szükséges", { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}
