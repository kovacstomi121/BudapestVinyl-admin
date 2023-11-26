"use client";

import axios from "axios";
import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";

import { GenreColumn } from "./columns";

// CellAction komponens definíciója
interface CellActionProps {
  data: GenreColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // Hook-ok inicializálása
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Törlés megerősítése
  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/genres/${data.id}`);
      toast.success("Műfaj törölve");
      router.refresh();
    } catch (error) {
      toast.error(
        "Először győződjön meg róla, hogy eltávolított minden terméket, amely ezt a műfajt használja"
      );
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  // Műfaj ID másolása a vágólapra
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Műfaj ID másolva");
  };

  // Komponens renderelése
  return (
    <>
      {/* Törlés megerősítő modális ablak */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      {/* Dropdown menü */}
      <DropdownMenu>
        {/* Trigger gomb */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        {/* Dropdown tartalom */}
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* Műfaj ID másolása */}
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> ID másolása
          </DropdownMenuItem>
          {/* Műfaj szerkesztése */}
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/genres/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Módosítás
          </DropdownMenuItem>
          {/* Műfaj törlése */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Töröl
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
