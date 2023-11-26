import { redirect } from "next/navigation";

import { SettingsForm } from "./components/settings-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prismadb } from "@/lib/prismadb";

// Beállítások oldal komponense
const SettingsPage = async ({ params }: { params: { storeId: string } }) => {
  // Felhasználói munkamenet lekérése a szerveroldali autentikáció segítségével
  const session = await getServerSession(authOptions);

  // Ha nincs munkamenet, azaz a felhasználó nincs bejelentkezve, átirányítás a bejelentkezési oldalra
  if (!session) {
    redirect("/sign-in");
  }

  // Felhasználó azonosítójának lekérése a munkamenetből
  const userId = session.user?.id;

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

  // A beállítások űrlap komponensének megjelenítése
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};
export default SettingsPage;
