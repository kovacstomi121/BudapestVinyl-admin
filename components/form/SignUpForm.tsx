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
import { useParams, useRouter } from "next/navigation";

const FormSchema = z
  .object({
    username: z.string().min(1, "Felhasználónév megadása kötelező").max(100),
    email: z
      .string()
      .min(1, "Email megadása kötelező")
      .email("Helytelen email"),
    password: z
      .string()
      .min(1, "Jelszó megadása kötelező")
      .min(8, "Jelszó legalább 8 karakter legyen"),
    confirmPassword: z.string().min(1, "Jelszó visszaigazolás kötelező"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Jelszavak nem egyeznek",
  });

const SignUpForm = () => {
  const params = useParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch(`/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
      }),
    });

    if (response.ok) {
      // Sikeres regisztráció esetén továbblépés
      router.push("/sign-in");
    } else {
      // Hibakezelés sikertelen regisztráció esetén
      console.error("Regisztráció sikertelen");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Felhasználónév</FormLabel>
                <FormControl>
                  <Input placeholder="Név" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    placeholder="Írd be a jelszavad"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Írd be újból a jelszavad</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jelszó újból"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full mt-6" type="submit">
          Regisztráció
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
