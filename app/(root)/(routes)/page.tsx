"use client";

import { useEffect } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";

const SetupPage = () => {
  // `useStoreModal` hook segítségével lekéri az `onOpen` függvényt.
  const onOpen = useStoreModal((state) => state.onOpen);

  // `useStoreModal` hook segítségével lekéri az `isOpen` állapotot.
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    // Ellenőrzi, hogy az `isOpen` állapot `false`-e. Ha igen, akkor az `onOpen` függvényt meghívja.
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

export default SetupPage;
