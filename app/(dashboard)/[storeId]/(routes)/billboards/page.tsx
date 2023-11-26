import { format } from "date-fns";

import { BillboardColumn } from "./components/columns";
import { BillboardClient } from "./components/client";
import { prismadb } from "@/lib/prismadb";

// A BillboardsPage komponens definíciója
const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  // Az adatbázisból lekérdezi a hirdetőtáblákat a megadott üzlet (storeId) alapján
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // A lekérdezett adatokat formázott formára alakítja
  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  // A BillboardsPage komponens JSX struktúrája
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* A BillboardClient komponens, amely megjeleníti a formázott reklámtáblákat */}
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
