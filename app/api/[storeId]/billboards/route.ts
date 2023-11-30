import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prismadb } from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(); // Session a NextAuth-ból

    const body = await req.json();

    const { label, imageUrl } = body;

    if (!session?.user) {
      return new NextResponse("Nincs bejelentkezve", { status: 403 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Kép URL szükséges", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Bolt id szükséges", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: session.user.id, // userId a NextAuth-ból
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Nincs bejelentkezve", { status: 405 });
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Bolt id szükséges", { status: 400 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}
