import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { prismadb } from "@/lib/prismadb";
import { Item } from "@radix-ui/react-dropdown-menu";

//Fizetés

const corsHeaders = {
  // Engedélyezi bármely eredeti domainről érkező kéréseket
  "Access-Control-Allow-Origin": "*",
  // Engedélyezi a GET, POST, PUT, DELETE, OPTIONS HTTP műveleteket
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  // Engedélyezi a Content-Type és Authorization fejléceket
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Termékazonosítók megadása kötelező", {
      status: 400,
    });
  }
  // Az alábbi sorok egy terméklistát kérnek le az adatbázisból a kapott termékazonosítók alapján.
  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });
  // A következő sorok a Stripe számára létrehozzák a "line_items" listát a lekért termékekből.
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: product.quantity,
      price_data: {
        currency: "HUF",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      },
    });
  });
  // Az alábbi sorok egy rendelést hoznak létre az adatbázisban, amely tartalmazza a megrendelt termékeket.
  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  //Az alábbi sorok létrehozzák a Stripe fizetési munkamenetet a "line_items" listával és a rendelési adatokkal.
  const session = await stripe.checkout.sessions.create({
    line_items: [],
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });
  // Fizetési munkamenet URL visszaadása.

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
