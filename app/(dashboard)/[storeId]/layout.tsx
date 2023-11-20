import { redirect, useRouter } from "next/navigation";
import { NavbarDefault } from "@/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prismadb } from "@/lib/prismadb";
import AuthProvider from "@/components/AuthProvider";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: session.user.id,
    },
  });
  if (!store) {
    redirect("/");
  }

  return (
    <>
      <NavbarDefault />
      {children}
    </>
  );
}
