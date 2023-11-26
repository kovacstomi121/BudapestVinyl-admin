"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

// A termék táblázat oszlopainak típusa
export type ProductColumn = {
  id: string;
  name: string;
  artist: string;
  price: string;
  genre: string;
  releaseYear: string;
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
};

// A termék táblázat oszlopainak definíciója
export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Album címe",
  },
  {
    accessorKey: "artist",
    header: "Előadó",
  },
  {
    accessorKey: "isArchived",
    header: "Archivált",
  },
  {
    accessorKey: "isFeatured",
    header: "Kiemelt",
  },
  {
    accessorKey: "price",
    header: "Ár",
  },
  {
    accessorKey: "genre",
    header: "Műfaj",
  },
  {
    accessorKey: "releaseYear",
    header: "Megjelenés éve",
  },
  {
    accessorKey: "createdAt",
    header: "Dátum",
  },
  {
    // Egyedi azonosító az "actions" oszlop számára
    id: "actions",
    // Az "actions" oszlop celláját reprezentáló komponens importálása és használata
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
