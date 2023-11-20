"use client";
import React, { useState } from "react";
import { Navbar } from "@material-tailwind/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import StoreSwitcher from "@/components/store-switcher";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import UserAccountNav from "./UserAccountNav";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

export async function NavbarDefault() {
  const [toggleMenu, setToggleMenu] = useState(false);
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
    <Navbar className="border-b mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {session?.user ? <UserAccountNav /> : null}
          {/* Mobile navigation toggle */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setToggleMenu(!toggleMenu)}>
              <Bars3Icon className="h-6" />
            </button>
          </div>
        </div>
      </div>
      {/* mobile navigation */}
      <div
        className={`fixed z-40 w-full bg-gray-100 overflow-hidden flex flex-col lg:hidden gap-12 origin-top duration-700 ${
          !toggleMenu ? "h-0" : "h-full"
        }`}
      >
        <div className="px-8">
          <div className="flex flex-col gap-8 font-bold tracking-wider">
            <MainNav className="mx-6" />
            {session?.user ? <UserAccountNav /> : null}
          </div>
        </div>
      </div>
    </Navbar>
  );
}
