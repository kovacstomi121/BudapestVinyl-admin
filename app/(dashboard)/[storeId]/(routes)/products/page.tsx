import { format } from "date-fns";

import { prismadb } from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";

// Oldal komponense, ami a termékek listáját jeleníti meg
const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  // Termékek lekérdezése az adatbázisból
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      genre: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // A lekért termékek formázása a megfelelő oszlopokhoz
  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    artist: item.artist,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    genre: item.genre.name,
    releaseYear: item.releaseYear,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* A termékek listáját megjelenítő komponens használata */}
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
