import { NextResponse } from "next/server";
import nextAuth, { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/options";
import { prismadb } from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { name } = body;

    if (!session) {
      return new NextResponse("Nincs bejelentkezve", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Név megadása szükséges", { status: 400 });
    }

    if (session.user.email) {
      // Itt már biztosan van érvényes email cím
      const store = await prismadb.store.create({
        data: {
          name,
          user: {
            connect: { id: session.user.id, email: session.user.email },
          },
        },
      });

      return NextResponse.json(store);
    } else {
      return new NextResponse("Hiányzó email cím a felhasználótól", {
        status: 400,
      });
    }
  } catch (error) {
    console.log("[STORES_POST]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}
