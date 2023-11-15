import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { prismadb } from "@/lib/prismadb";

const UserSchema = z.object({
  username: z.string().min(1, "Felhasználó név megadása kötelező").max(100),
  email: z.string().min(1, "Email megadása kötelező").email("Helytelen email"),
  password: z
    .string()
    .min(1, "Add meg a jelszót")
    .min(8, "Legalább 8 karakternek kell lennie"),
});
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = UserSchema.parse(body);

    const existingEmail = await prismadb.user.findUnique({
      where: { email: email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { user: null, message: "Van már felhasználó ezzel az email címmel" },
        { status: 409 }
      );
    }

    const existingUserName = await prismadb.user.findUnique({
      where: { username: username },
    });
    if (existingUserName) {
      return NextResponse.json(
        { user: null, message: "Van már felhasználó ezzel az névvel" },
        { status: 409 }
      );
    }

    // Létrehozom az új felhasználót
    const hashedPassword = await hash(password, 10);
    const newUser = await prismadb.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        store: {
          create: {
            name: "",

            // További bolt létrehozási adatok
          },
        },
      },
    });
    const { password: newUserPassword, ...rest } = newUser;

    // Sikeres létrehozás esetén visszaküldöm az új felhasználót
    return NextResponse.json(
      { user: rest, message: "Felhasználó létrehozva" },
      { status: 201 }
    );
  } catch (error) {
    console.log("[REGISTER_POST]", error);
    return new NextResponse("Valami hiba történt", { status: 500 });
  }
}
