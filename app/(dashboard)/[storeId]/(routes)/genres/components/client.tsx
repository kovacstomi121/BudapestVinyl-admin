"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, GenreColumn } from "./columns";

// GenreClient komponens definíciója
interface GenreClientProps {
  data: GenreColumn[];
}

export const GenreClient: React.FC<GenreClientProps> = ({ data }) => {
  // Hook-ok inicializálása
  const params = useParams();
  const router = useRouter();

  // Komponens renderelése
  return (
    <>
      {/* Lista fejléce */}
      <div className="flex items-center justify-between">
        <Heading
          title={`Műfajok (${data.length})`}
          description="Kezelje termékei műfaját"
        />
        {/* Hozzáadás gomb */}
        <Button onClick={() => router.push(`/${params.storeId}/genres/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Hozzáadás
        </Button>
      </div>
      <Separator />
      {/* Műfajok táblázat */}
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
