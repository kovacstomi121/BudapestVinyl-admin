"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

// Props, amelyek befolyásolják a modális ablak viselkedését és állapotát
interface AlertModalProps {
  isOpen: boolean; // A modális ablak láthatóságát vezérli
  onClose: () => void; // A modális ablak bezárásáért felelős callback függvény
  onConfirm: () => void; // A modális ablakban lévő megerősítő gomb lenyomásakor meghívandó callback függvény
  loading: boolean; // Azt jelzi, hogy a komponens jelenleg betöltés alatt áll-e
}

// A modális ablakot megvalósító React komponens
export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  // Állapot, ami segít elkerülni a felesleges renderelést
  const [isMounted, setIsMounted] = useState(false);

  // Amikor a komponens felkerül a DOM-ra, akkor a `isMounted` állapot `true`-ra vált
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ha a komponens még nem került fel a DOM-ra, akkor ne rendereljen semmit
  if (!isMounted) {
    return null;
  }

  // Modális ablak renderelése a `Modal` komponens segítségével
  return (
    <Modal
      title="Biztos vagy benne"
      description="Nem lehetséges visszavonni."
      isOpen={isOpen}
      onClose={onClose}
    >
      {/* A modális ablak alján két gomb: "Kilépés" és "Folytatás" */}
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Kilépés
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Folytatás
        </Button>
      </div>
    </Modal>
  );
};
