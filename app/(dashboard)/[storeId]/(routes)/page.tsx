import { CreditCard, DollarSign, Package } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getStockCount } from "@/actions/get-stock-count";
import { formatter } from "@/lib/utils";
import { getServerSession } from "next-auth";
import AuthProvider from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  // Az alábbi sorok adatokat kérnek le az API-tól és tárolják azokat a megfelelő változókban.
  const totalRevenue = await getTotalRevenue(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);
  const session = await getServerSession(authOptions);

  return (
    // Az alábbi sorban az AuthProvider komponens kerül használatra.
    // Ez a komponens az autentikációhoz és az engedélyekhez kapcsolódik.
    // A kód az alatta lévő tartalmat az autentikáció után rendeli hozzáférhetővé.

    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* A következő sorok egyszerűen címeket és elválasztó vonalat jelenítenek meg. */}
        <Heading title="Irányítópult" description="Bolt áttekintése" />

        <Separator />

        {/* Az alábbi sorban a felhasználói adatokat jelenítik meg különböző kártyákban. */}
        <div className="grid gap-4 grid-cols-3">
          <Card>
            {/* A Card komponens megjelenít egy kártya fejlécet. */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {/* A CardTitle a fejléc címét tartalmazza. */}
              <CardTitle className="text-sm font-medium">
                Teljes bevétel
              </CardTitle>
              {/* A DollarSign ikon a pénzügyi információkhoz tartozik. */}
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* Az adott adatokat jelenítik meg itt a megfelelő formázással. */}
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          {/* Hasonló kártyák következnek itt a különböző adatokkal. */}
        </div>

        {/* Az Overview komponens jeleníti meg a grafikus áttekintést a data prop alapján. */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Áttekintés</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
