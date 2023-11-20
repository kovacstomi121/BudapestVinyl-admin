"use client";
import React from "react";
import {
  Navbar,
  MobileNav,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { useSession } from "next-auth/react";
import StoreSwitcher from "@/components/store-switcher";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import UserAccountNav from "./UserAccountNav";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

export async function NavbarDefault() {
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

  const navList = <MainNav />;

  return (
    <Navbar className="border-b mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <StoreSwitcher items={stores} />
        {navList}
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {session?.user ? <UserAccountNav /> : null}
        </div>
      </div>
    </Navbar>
  );
}
