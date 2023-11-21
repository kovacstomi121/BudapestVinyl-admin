"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
interface SidebarItemProps {
  icon: LucideIcon; // Ikon komponens, amit a propból kapunk
  label: string; // Szöveges címke
  href: string; // Navigációs útvonal
}
// SidebarItem komponens definíciója
export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  // Használjuk a Next.js useRouter és usePathname hookjait
  const pathname = usePathname();
  const router = useRouter();

  // Ellenőrizzük, hogy az adott oldal aktív-e a navigációs útvonal alapján
  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  // Az onClick függvény, amely átirányítja a felhasználót a megadott útvonalra
  const onClick = () => {
    router.push(href);
  };

  // Visszaadjuk a JSX-t, ami a SidebarItem kinézetét definiálja
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        // Alapértelmezett stílusok, amik a komponens általános megjelenését határozzák meg
        "flex items-center gap-x-2 text-black text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        // Aktív állapot stílusai, amik akkor jelennek meg, ha az oldal aktív
        isActive &&
          "text-black bg-sky-200/20 hover:bg-sky-200/20 hover:text-black"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        {/* Ikon megjelenítése a komponensben */}
        <Icon
          size={22}
          className={cn("text-black", isActive && "text-black")}
        />
        {/* Címke megjelenítése */}
        {label}
      </div>
      {/* Aktív állapot jelzése egy vonallal a gomb mellett */}
      <div
        className={cn(
          "ml-auto opacity-0 border-2 text-black h-full transition-all",
          // Aktív állapotban láthatóvá válik az elem
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};
