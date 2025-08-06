import { NextResponse } from "next/server";

// Permitir preflight (CORS)
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Endpoint GET básico
export async function GET() {
  return NextResponse.json({ message: "Endpoint de suscripciones activo" });
}

// Endpoint POST básico
export async function POST(request: Request) {
  const data = await request.json();
  // Aquí puedes agregar lógica para guardar la suscripción, etc.
  return NextResponse.json({ message: "Suscripción creada", data });
}
