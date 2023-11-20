"use client";
import { useSession, signOut, getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import StoreSwitcher from "@/components/store-switcher";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { prismadb } from "@/lib/prismadb";
import { useState, useEffect } from "react";
import { getServerSession } from "next-auth";
import UserAccountNav from "./UserAccountNav";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Navbar = () => {
  const [session, loading] = useSession();
  const [stores, setStores] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      if (!session) {
        redirect("/sign-in");
      }

      const serverSession = await getServerSession();
      const userId = serverSession.user.id;

      const storesData = await prismadb.store.findMany({
        where: {
          userId,
        },
      });

      setStores(storesData);
    };

    if (!loading) {
      initializeData();
    }
  }, [session, loading]);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <ThemeToggle />
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
        {mobileMenuOpen && (
          <div className="lg:hidden flex flex-col items-center space-y-2 mt-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {session?.user ? <UserAccountNav /> : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

  );
};

export default Navbar;
