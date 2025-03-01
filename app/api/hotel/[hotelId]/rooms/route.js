import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";
export async function GET(request, context) {
  try {
    const params = await context.params; 
    console.log("Received params:", params); 

    const { hotelId } = params;

    if (!hotelId) {
      return NextResponse.json(
        { message: "Hotel ID is required" },
        { status: 400 }
      );
    }

    const rooms = await prismadb.room.findMany({
      where: { hotelId },
      orderBy: { price: "asc" },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { message: "Error fetching rooms", error: error.message },
      { status: 500 }
    );
  }
}