"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const FormSchema = z.object({
  email: z.string().min(1, "Email megadása kötelező").email("Helytelen email"),
  password: z
    .string()
    .min(1, "Add meg a jelszót")
    .min(8, "Legalább 8 karakternek kell lennie"),
});

const SignInForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (signInData?.ok) {
      try {
        setLoading(true);
        // Szerveroldali bejelentkezési kísérlet
        const response = await axios.post("/api/login", values);

        // Kliensoldali irányítás
        window.location.assign(`/${response.data.id}`);
      } catch (error) {
        const axiosError = error as AxiosError;

        toast.error(`Bejelentkezés sikertelen. Hiba: ${axiosError.message}`);
        console.error(
          "Hiba a bejelentkezés során:",
          axiosError.response || axiosError
        );
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Hibás adatok");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jelszó</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Add meg jelszót"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full mt-6" type="submit">
          Bejelentkezés
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-2">
        Ha nincs fiókod, kérlek&nbsp;
        <Link className="text-blue-500 hover:underline" href="/sign-up">
          Regisztrálj
        </Link>
      </p>
    </Form>
  );
};

export default SignInForm;
