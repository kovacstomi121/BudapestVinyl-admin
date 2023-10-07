"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

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

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Album címe ",
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
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
