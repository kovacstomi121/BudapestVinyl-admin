import { prismadb } from "@/lib/prismadb";
import { GenreForm } from "./components/genre-form";

// GenrePage komponens definíciója
const GenrePage = async ({ params }: { params: { genreId: string } }) => {
  // A műfaj lekérdezése az adatbázisból
  const genre = await prismadb.genre.findUnique({
    where: {
      id: params.genreId,
    },
  });

  // A komponens renderelése, a GenreForm komponenssel
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* A GenreForm komponens meghívása az inicializált adatokkal */}
        <GenreForm initialData={genre} />
      </div>
    </div>
  );
};

export default GenrePage;
