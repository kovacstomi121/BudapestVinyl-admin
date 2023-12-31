"use client";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Billboard } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";

// A formSchema definíciója az adatformátumhoz
const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  // Felhasznált hook-ok és változók deklarációja
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // A form címének és leírásának beállítása attól függően, hogy adatak szerkesztése vagy létrehozása történik
  const title = initialData
    ? "Hirdetőtábla szerkesztése"
    : "Hirdetőtábla létrehozása ";
  const description = initialData
    ? "Hirdetőtábla szerkesztése"
    : "Új hirdetőtábla létrehozása";
  const toastMessage = initialData
    ? "Hirdetőtábla frissítése"
    : "Hirdetőtábla létrehozva";
  const action = initialData ? "Mentés" : "Létrehoz";

  // A React Hook Form használata a form kezeléséhez
  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  // Az űrlap elküldésekor futtatott függvény
  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      // Az adatok küldése a szervernek
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      // Újratölti az oldalt és átirányít a megfelelő helyre, majd értesítés jelenik meg
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMessage);
    } catch (error: any) {
      // Hiba esetén értesítés jelenik meg
      toast.error("Valami hiba történt");
    } finally {
      setLoading(false);
    }
  };

  // Hirdetőtábla törlését végző függvény
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      // Újratölti az oldalt és átirányít a megfelelő helyre, majd értesítés jelenik meg
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Hirdetőtábla törölve");
    } catch (error: any) {
      // Hiba esetén értesítés jelenik meg
      toast.error(
        "Győződjön meg róla, hogy először eltávolított minden kategóriát ezzel a hirdetőtáblával."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {/* Háttérkép feltöltési mező */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Háttérkép</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* Cím mező */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cím</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Hirdetőtábla cím"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Űrlap elküldése gomb */}
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
