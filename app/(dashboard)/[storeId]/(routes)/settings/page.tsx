import { redirect } from "next/navigation";

import { SettingsForm } from "./components/settings-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prismadb } from "@/lib/prismadb";

const SettingsPage = async ({ params }: { params: { storeId: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }
  const userId = session.user?.id;

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
