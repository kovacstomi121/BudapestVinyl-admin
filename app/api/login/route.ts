import { useRouter } from "next/router";
import { useEffect } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prismadb } from "@/lib/prismadb";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        router.push("/sign-in");
      } else {
        const userId = session.user.id;
        const store = await prismadb.store.findFirst({
          where: {
            userId,
          },
        });

        if (store) {
          router.push(`/${store.id}`);
        } else {
          router.push("/root");
        }
      }
    };

    checkSession();
  }, []);
}
