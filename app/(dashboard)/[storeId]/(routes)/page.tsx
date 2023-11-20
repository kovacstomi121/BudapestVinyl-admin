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

// Az interfész a DashboardPage komponenshez
interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

// A DashboardPage komponens definíciója
const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  // Különböző akciók segítségével aszinkron adatok lekérése
  const totalRevenue = await getTotalRevenue(params.storeId); // Teljes bevétel lekérése
  const graphRevenue = await getGraphRevenue(params.storeId); // Grafikon adatok lekérése a bevételhez
  const salesCount = await getSalesCount(params.storeId); // Eladások számának lekérése
  const stockCount = await getStockCount(params.storeId); // Raktárkészlet lekérése

  // JSX visszaadása a komponenshez
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Cím és alcím */}
        <Heading title="Vezérlőpult" description="Áttekintés az üzletedről" />
        {/* Elválasztó */}
        <Separator />
        {/* 3 kártya megjelenítése */}
        <div className="grid gap-4 grid-cols-3">
          {/* 1. Kártya: Teljes bevétel */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Teljes bevétel
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold overflow-hidden">
                {/* Teljes bevétel megjelenítése formázva */}
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          {/* 2. Kártya: Eladások */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eladások</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>
          {/* 3. Kártya: Raktáron lévő termékek */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Raktáron</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        {/* Grafikon kártya */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Áttekintés</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Áttekintő komponens használata a grafikon adatokkal */}
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
