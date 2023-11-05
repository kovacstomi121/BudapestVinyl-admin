import { getServerSession } from "next-auth";
import { prismadb } from "@/lib/prismadb";
import { redirect } from "next/navigation";

export default async function checkUserStore() {
  const session = await getServerSession();

  if (!session?.user) {
    return null;
  }

  const userId = session.user.id;
  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      store: true,
    },
  });

  if (user) {
    const stores = user.store; // Itt több bolt is lehet, tehát egy tömb
    if (stores && stores.length > 0) {
      // Ha vannak boltok a felhasználóhoz, akkor válaszd ki az elsőt (vagy a kívánt módon)
      const store = stores[0];
      redirect(`/${store.id}`);
    } else {
      redirect("/root");
    }
  }
}
