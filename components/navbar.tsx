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

const prisma = new PrismaClient();

const Navbar = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {session?.user ? <UserAccountNav /> : null}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
