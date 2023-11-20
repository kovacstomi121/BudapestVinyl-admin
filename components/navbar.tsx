"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import StoreSwitcher from "@/components/store-switcher";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { prismadb } from "@/lib/prismadb";
import { useState, useEffect } from "react";
import { getServerSession } from "next-auth";
import UserAccountNav from "./UserAccountNav";
import { PrismaClient, Store } from "@prisma/client";

const prisma = new PrismaClient();

const Navbar = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      const session = await getServerSession();

      if (!session) {
        router.push("/sign-in");
        return null;
      }

      const userId = session.user.id;

      const storesData = await prismadb.store.findMany({
        where: {
          userId,
        },
      });

      setStores(storesData);
    };

    fetchStores();
  }, [router]);

  const handleMobileToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const renderRoutes = (stores: Store[]) => {
    return stores.map((store) => (
      <Link
        key={store.id}
        href={`/${store.id}`}
        className={cn(
          "text-sm font-medium transition-colors",
          router.pathname === `/${store.id}`
            ? "text-black dark:text-white"
            : "text-muted-foreground"
        )}
        onClick={handleLinkClick}
      >
        {store.name}
      </Link>
    ));
  };

  const renderMobileMenu = (stores: Store[]) => {
    return (
      <div className="lg:hidden flex flex-col items-center space-y-2 mt-4">
        {renderRoutes(stores)}
        <UserAccountNav />
      </div>
    );
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <button
            className="lg:hidden text-white p-2"
            onClick={handleMobileToggle}
          >
            ☰
          </button>
          {mobileMenuOpen && renderMobileMenu(stores)}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
