import { prismadb } from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

// ProductPage komponens definíciója
const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  // A termék adatainak lekérése az adatbázisból
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });

  // Az elérhető műfajok lekérése az adatbázisból
  const genres = await prismadb.genre.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  // Komponens renderelése
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* ProductForm komponens használata a termék szerkesztéséhez */}
        <ProductForm genres={genres} initialData={product} />
      </div>
    </div>
  );
};
export default ProductPage;
