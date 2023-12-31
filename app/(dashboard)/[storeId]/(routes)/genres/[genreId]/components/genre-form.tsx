"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Genre } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";

// Űrlap validációs séma definiálása a zod modullal
const formSchema = z.object({
  name: z.string().min(1),
});

// Az űrlap értékeit reprezentáló típus definiálása
type GenreFormValues = z.infer<typeof formSchema>;
interface GenreFormProps {
  initialData: Genre | null;
}

// GenreForm komponens definíciója
export const GenreForm: React.FC<GenreFormProps> = ({ initialData }) => {
  // Az útvonal és router kezelése a next/navigation modullal
  const params = useParams();
  const router = useRouter();

  // Állapotok inicializálása
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // A komponens címe, leírása, üzenetei, gombfeliratainak beállítása
  const title = initialData ? "Műfaj szerkesztése" : "Műfaj létrehozása";
  const description = initialData
    ? "Műfaj szerkesztése."
    : "Új műfaj hozzáadása";
  const toastMessage = initialData ? "Műfaj frissítve" : "Műfaj létrehozva";
  const action = initialData ? "Mentés" : "Létrehoz";

  // React Hook Form használata az űrlapkezeléshez
  const form = useForm<GenreFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  // Űrlap elküldésekor lefutó függvény
  const onSubmit = async (data: GenreFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/genres/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/genres`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/genres`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Valami hiba történt.");
    } finally {
      setLoading(false);
    }
  };

  // Műfaj törlésekor lefutó függvény
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/genres/${params.gerneId}`);
      router.refresh();
      router.push(`/${params.storeId}/genres`);
      toast.success("Műfaj törölve.");
    } catch (error: any) {
      toast.error(
        "Győződj meg róla hogy az összes műfajhoz tartozó terméket törölted."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Műfaj törléséhez használt megerősítő modális ablak */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      {/* Űrlap és műveletek megjelenítése */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      {/* Űrlap megjelenítése */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Műfaj" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Űrlap elküldéséhez szükséges gomb */}
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
