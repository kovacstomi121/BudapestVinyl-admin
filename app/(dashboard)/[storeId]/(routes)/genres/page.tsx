import { format } from "date-fns";

import { GenreColumn } from "./components/columns";
import { GenreClient } from "./components/client";
import { prismadb } from "@/lib/prismadb";

const GenrePage = async ({ params }: { params: { storeId: string } }) => {
  const genres = await prismadb.genre.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedGenres: GenreColumn[] = genres.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <GenreClient data={formattedGenres} />
      </div>
    </div>
  );
};

export default GenrePage;
