import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { prismadb } from "@/lib/prismadb";

export async function POST(req: Request) {
  // Kérés szövegének beolvasása
  const body = await req.text();
  // Stripe aláírás megszerzése a fejlécből
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    // Stripe webhook esemény konstruálása az aláírás és a test alapján
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    // Hiba esetén hibakódot és hibaüzenetet visszaadása
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Stripe eseményből session és cím adatok kinyerése
  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  // Cím komponensek összegyűjtése és egy stringként összefűzése
  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  // Ha a fizetés
  if (event.type === "checkout.session.completed") {
    // Megrendelés státuszának frissítése, cím és telefon hozzáadása
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });

    // Megrendelt termékek azonosítóinak lekérése
    const productIds = order.orderItems.map((orderItem) => orderItem.productId);
  }

  // Sikeres válasz létrehozása, státusz 200
  return new NextResponse(null, { status: 200 });
}
