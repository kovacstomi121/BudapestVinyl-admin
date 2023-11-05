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

import { BillboardColumn } from "./columns";

// A CellAction komponens deklarációja
interface CellActionProps {
  data: BillboardColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // Router és params hook-ok használata
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // A hirdetőtábla törlését végző függvény
  const onConfirm = async () => {
    try {
      setLoading(true);
      // A hirdetőtábla törlése a szerverről
      await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
      toast.success("Hirdetőtábla törölve");
      router.refresh();
    } catch (error) {
      toast.error(
        "Győződjön meg róla, hogy először eltávolított minden kategóriát ezzel a hirdetőtáblával."
      );
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  // Az aktuális hirdetőtábla azonosítójának vágólapra másolását végző függvény
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("A hirdetőtábla azonosítója a vágólapra másolva.");
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Opciók</DropdownMenuLabel>
          {/* Az aktuális hirdetőtábla azonosítójának másolása */}
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> Id másolása
          </DropdownMenuItem>
          {/* A hirdetőtábla szerkesztésére való átirányítás */}
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/billboards/${data.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" /> Frissít
          </DropdownMenuItem>
          {/* A hirdetőtábla törlését indító függvény meghívása */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Töröl
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
