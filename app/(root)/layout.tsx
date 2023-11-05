import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prismadb } from "@/lib/prismadb";
import AuthProvider from "@/components/AuthProvider";
import { useSession } from "next-auth/react";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/sign-in");
    return null;
  }

  const userId = session.user.id; // Kinyerjük a felhasználó azonosítóját

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    redirect(`${store.id}`);
    return null;
  }
  // Ha eljut ide, akkor a felhasználónak van boltja, és betölthetjük a kívánt oldalt
  return <>{children}</>;
}
