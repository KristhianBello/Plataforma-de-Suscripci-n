import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderID, expectedAmount } = await req.json();

    // Obtener credenciales de PayPal desde variables de entorno
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET_KEY;
    if (!clientId || !secret) {
      return NextResponse.json({ error: "PayPal credentials not set" }, { status: 500 });
    }

    // Obtener access token de PayPal
    const basicAuth = Buffer.from(`${clientId}:${secret}`).toString("base64");
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!tokenRes.ok) {
      return NextResponse.json({ error: "Failed to get PayPal token" }, { status: 500 });
    }
    const { access_token } = await tokenRes.json();

    // Consultar la orden en PayPal
    const orderRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}`, {
      headers: {
        "Authorization": `Bearer ${access_token}`,
      },
    });
    if (!orderRes.ok) {
      return NextResponse.json({ error: "Order not found in PayPal" }, { status: 404 });
    }
    const orderData = await orderRes.json();

    // Validar estado y monto
    if (orderData.status !== "COMPLETED") {
      return NextResponse.json({ error: "Order not completed" }, { status: 400 });
    }
    const purchaseAmount = orderData.purchase_units?.[0]?.amount?.value;
    if (expectedAmount && purchaseAmount !== expectedAmount.toFixed(2)) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Puedes guardar la transacción en tu base de datos aquí

    return NextResponse.json({ success: true, payer: orderData.payer, orderID });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
