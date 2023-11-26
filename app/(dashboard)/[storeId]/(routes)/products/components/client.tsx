"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { ProductColumn, columns } from "./columns";

// ProductsClient komponens definíciója
interface ProductsClientProps {
  data: ProductColumn[];
}

export const ProductsClient: React.FC<ProductsClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  // Komponens renderelése
  return (
    <>
      <div className="flex items-center justify-between">
        {/* Termékek címe és hozzáadás gomb */}
        <Heading
          title={`Termékek (${data.length})`}
          description="Kezelje üzletének termékeit"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Hozzáadás
        </Button>
      </div>
      <Separator />
      {/* Termékek táblázata */}
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* API hívások címe és listája */}
      <Heading title="API" description="API-hívások termékekért" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};
