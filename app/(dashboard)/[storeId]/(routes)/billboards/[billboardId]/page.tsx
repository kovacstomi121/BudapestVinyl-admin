import { prismadb } from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

// A BillboardPage komponens deklarációja
const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  // A hirdetőtábla lekérdezése a prisma adatbázisból a megadott billboardId alapján
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    // Az oldal felépítése, ahol a BillboardForm komponens kapja az inicializációs adatokat
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
