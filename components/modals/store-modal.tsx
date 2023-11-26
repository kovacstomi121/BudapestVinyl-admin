"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";

// Az űrlap validációjához használt sémát definiálja
const formSchema = z.object({
  name: z.string().min(1),
});

// A StoreModal komponens, ami egy modális ablakban hoz létre új üzletet
export const StoreModal = () => {
  // A useStoreModal hook segítségével hozzuk létre a modális ablak kezelését
  const storeModal = useStoreModal();
  const router = useRouter();

  // Állapot, ami jelzi, hogy éppen történik-e adat küldése vagy nem
  const [loading, setLoading] = useState(false);

  // React Hook Form hook használata az űrlap kezeléséhez
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // Az űrlap elküldésekor meghívódó callback függvény
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      // Üzlet létrehozása a szerveren keresztül
      const response = await axios.post("/api/stores", values);
      // Átirányítás az újonnan létrehozott üzlet oldalára
      window.location.assign(`/${response.data.id}`);
      // Sikeres üzenet megjelenítése
      toast.success("Üzlet létrehozva");
    } catch (error) {
      // Hiba esetén hibaüzenet megjelenítése
      toast.error("Valami hiba történt");
    } finally {
      // Betöltés állapotának visszaállítása
      setLoading(false);
    }
  };

  // Modális ablak és űrlap renderelése
  return (
    <Modal
      title="Üzlet létrehozása"
      description="Hozz létre új üzletet"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            {/* Űrlap komponens használata */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Űrlap mezője a név megadásához */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Név</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Bolt"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Űrlap gombjai: Kilépés és Folytatás */}
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                  <Button
                    disabled={loading}
                    variant="outline"
                    onClick={storeModal.onClose}
                  >
                    Kilépés
                  </Button>
                  <Button disabled={loading} type="submit">
                    Folytatás
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
