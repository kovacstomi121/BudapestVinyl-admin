import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prismadb } from "@/lib/prismadb";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    await redirect("/sign-in");
    return null; // Fontos: Üres válasz küldése a további végrehajtás megakadályozása érdekében
  }

  // Megvárjuk a redirect befejezését, ha van store
  const store = await prismadb.store.findFirst({
    where: {
      userId: session?.user.id,
    },
  });

  if (store) {
    await redirect(`/${store.id}`);
    return null; // Fontos: Üres válasz küldése a további végrehajtás megakadályozása érdekében
  }

  // Ha eljut ide, akkor a felhasználónak nincs boltja, és megengedjük a children tartalom megjelenítését
  return <>{children}</>;
}
