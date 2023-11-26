import { redirect, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prismadb } from "@/lib/prismadb";
import { Sidebar } from "./_components/sidebar";

// DashboardLayout komponens definiálása
export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  // Felhasználói munkamenet lekérése a szerveroldali autentikáció segítségével
  const session = await getServerSession(authOptions);

  // Ha nincs bejelentkezve felhasználó, átirányítás a bejelentkezési oldalra
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Felhasználó azonosítójának lekérése a munkamenetből
  const userId = session.user.id;

  // Bolt adatainak lekérése az adatbázisból
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  // Ha a bolt nem létezik, átirányítás a főoldalra
  if (!store) {
    redirect("/");
  }

  // Router objektum lekérése a useRouter hook segítségével
  const router = useRouter();

  // A komponens visszatérési értéke: az elrendezés megjelenítése
  return (
    <div className="h-full">
      {/* Felső sáv megjelenítése */}
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      {/* Oldalsáv megjelenítése (csak nagy képernyőn) */}
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      {/* Fő tartalom megjelenítése */}
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
}
