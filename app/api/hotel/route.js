import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";


export async function POST(req) {
    try {
      const body = await req.json();
      const session = await auth();
  
      const userId = session?.user?.id;
  
      if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized. User ID not found" }), { status: 401 });
      }
  
      const { amenities, ...hotelData } = body;
  
      const hotel = await prismadb.hotel.create({
        data: {
          ...hotelData,
          ...amenities,
          userId: userId, 
        },
      });
  
      return new Response(JSON.stringify(hotel), { status: 201 });
    } catch (error) {
      console.error("Error creating hotel:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  