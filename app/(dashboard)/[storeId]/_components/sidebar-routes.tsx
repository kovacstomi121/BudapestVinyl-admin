"use client";
import { BarChart, Check, List, Settings } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

import { SidebarItem } from "../_components/sidebar-item";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";

// SidebarRoutes komponens definíciója
export const SidebarRoutes = () => {
  // Használjuk a Next.js useRouter és usePathname hookjait
  const pathname = usePathname();
  const params = useParams();

  // Definiáljuk a navigációs útvonalakat és azokhoz tartozó ikonokat
  const routes = [
    {
      icon: BarChart,
      href: `/${params.storeId}`,
      label: "Áttekintés",
      active: pathname === `/${params.storeId}`,
    },
    {
      icon: List,
      href: `/${params.storeId}/billboards`,
      label: "Hírdetőtáblák",
      active: pathname === `/${params.storeId}/billboards`,
    },

    {
      icon: List,
      href: `/${params.storeId}/products`,
      label: "Termékek",
      active: pathname === `/${params.storeId}/products`,
    },
    {
      icon: List,
      href: `/${params.storeId}/orders`,
      label: "Rendelések",
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      icon: List,
      href: `/${params.storeId}/genres`,
      label: "Műfajok",
      active: pathname === `/${params.storeId}/genres`,
    },
    {
      icon: Settings,
      href: `/${params.storeId}/settings`,
      label: "Beállítások",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  // Visszaadjuk a JSX-t, ami a SidebarRoutes kinézetét definiálja
  return (
    <div className="flex flex-col w-full">
      {/* A navigációs útvonalak térképezése SidebarItem komponensre */}
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
