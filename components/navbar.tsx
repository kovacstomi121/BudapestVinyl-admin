import { useSession, signOut, getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import StoreSwitcher from "@/components/store-switcher";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { prismadb } from "@/lib/prismadb";
import { useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserAccountNav from "./UserAccountNav";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { MobileSidebar } from "@/app/(dashboard)/[storeId]/_components/mobile-sidebar";

const prisma = new PrismaClient();

// Az aszinkron függvény helyett a getServerSession auth hook használata
const Navbar = async () => {
  // Az auth hook segítségével lekérjük a jelenlegi felhasználói munkamenetet
  const session = await getServerSession();

  // Ha nincs munkamenet, átirányítjuk a felhasználót a bejelentkezési oldalra
  if (!session) {
    redirect("/sign-in");
  }

  // Felhasználó azonosítójának lekérése a munkamenetből
  const userId = session.user.id;

  // Felhasználóhoz tartozó üzletek lekérése a Prisma adatbázisból
  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        {/* Mobil oldalsáv komponens */}
        <MobileSidebar />
        {/* Üzletek váltója */}
        <StoreSwitcher items={stores} />

        <div className="ml-auto flex items-center space-x-4">
          {/* Téma kapcsoló */}
          <ThemeToggle />
          {/* Felhasználói fiók navigáció */}
          {session?.user ? <UserAccountNav /> : null}
        </div>
      </div>
    </div>
  );
};
export default Navbar;
