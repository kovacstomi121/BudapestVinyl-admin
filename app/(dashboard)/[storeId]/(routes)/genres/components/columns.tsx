"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type GenreColumn = {
  id: string;
  name: string;
  createdAt: string;
};

export const columns: ColumnDef<GenreColumn>[] = [
  {
    accessorKey: "name",
    header: "Műfaj",
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
