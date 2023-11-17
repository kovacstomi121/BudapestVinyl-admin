import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().min(1, "Email megadása kötelező").email("Helytelen email"),
  password: z
    .string()
    .min(1, "Add meg a jelszót")
    .min(8, "Legalább 8 karakternek kell lennie"),
});

export async function POST(req: Request, values: z.infer<typeof FormSchema>) {
  try {
    // Felhasználóhoz tartozó bolt keresése a megadott adatok alapján
    const store = await prismadb.store.findFirst({
      where: {
        user: {
          email: values.email,
        },
      },
      include: {
        user: true, // Ez azért kell, hogy a kapcsolódó felhasználó objektum is elkészüljön
      },
    });

    if (store) {
      return NextResponse.json(store);
    } else {
      // Ha nincs bolt, irányítás a root oldalra
      return NextResponse.redirect("/root");
    }
  } catch (error) {
    console.error("[STORES_POST]", error);
    return new NextResponse("Belső hiba", { status: 500 });
  }
}
