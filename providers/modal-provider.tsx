//A komponens funkciója az, hogy ellenőrzi, hogy a komponens mountolva van-e (azaz, hogy a DOM-ba be lett-e helyezve). Ha a komponens nincs még mountolva, akkor egyszerűen null-t (nullát) ad vissza, tehát a komponens semmilyen tartalmat nem jelenít meg.

"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
};
