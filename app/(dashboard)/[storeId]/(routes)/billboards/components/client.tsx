"use client"; // Importáljuk a "use client" modult, ami valószínűleg egy egyedi modul vagy szolgáltatás.

import { Plus } from "lucide-react"; // Az "lucide-react" modulból importáljuk a "Plus" ikont.
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, BillboardColumn } from "./columns";

// A "BillboardClient" komponensnek átadott adatok struktúrájának meghatározása.
interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const params = useParams(); // Az aktuális útvonal paramétereinek lekérése a "useParams" hook segítségével.
  const router = useRouter(); // Az útvonalváltás funkciók eléréséhez használt "useRouter" hook.

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Hirdetőtáblák (${data.length})`}
          description="Kezelje üzlete hirdetőtábláit"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Hozzáadás
        </Button>
      </div>
      <Separator /> // Elválasztó vonal beszúrása a felhasználói felületen.
      <DataTable searchKey="label" columns={columns} data={data} /> //
      <Heading title="API" description="API-hívások hirdetőtáblákhoz" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" /> //
    </>
  );
};
