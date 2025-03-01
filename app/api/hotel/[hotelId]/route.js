import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { z } from "zod";
export async function PATCH(req, { params }) {
  const Params = await params;
  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!Params || !Params.hotelId) {
      return new Response(JSON.stringify({ error: "Hotel ID is required" }), {
        status: 400,
      });
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. User ID not found" }),
        { status: 401 }
      );
    }

    const body = await req.json();

    const hotelUpdateSchema = z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      country: z.string().optional(),
      state: z.string().optional(),
      city: z.string().optional(),
      address: z.string().optional(),
      amenities: z
        .object({
          gym: z.boolean().optional(),
          pool: z.boolean().optional(),
          restaurant: z.boolean().optional(),
          roomService: z.boolean().optional(),
          spa: z.boolean().optional(),
          bar: z.boolean().optional(),
          wifi: z.boolean().optional(),
          laundry: z.boolean().optional(),
          parking: z.boolean().optional(),
          breakfast: z.boolean().optional(),
          pets: z.boolean().optional(),
        })
        .optional(),
    });

    const validatedData = hotelUpdateSchema.parse(body);

    const { amenities, ...hotelData } = validatedData;

    const existingHotel = await prismadb.hotel.findUnique({
      where: {
        id: Params.hotelId,
      },
    });

    if (!existingHotel) {
      return new Response(JSON.stringify({ error: "Hotel not found" }), {
        status: 404,
      });
    }

    if (existingHotel.userId !== userId) {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
      });
    }

    const updateData = {
      ...hotelData,
      ...(amenities ? { ...amenities } : {}),
    };

    const hotel = await prismadb.hotel.update({
      where: {
        id: Params.hotelId,
      },
      data: updateData,
    });

    return new Response(JSON.stringify(hotel), { status: 200 });
  } catch (error) {
    console.error("Error updating hotel:", error);

    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}


export async function DELETE(req, { Params }) {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!Params || !Params.hotelId) {
      return new Response(JSON.stringify({ error: "Hotel ID is required" }), {
        status: 400,
      });
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. User ID not found" }),
        { status: 401 }
      );
    }

    const existingHotel = await prismadb.hotel.findUnique({
      where: {
        id: Params.hotelId,
      },
    });

    if (!existingHotel) {
      return new Response(JSON.stringify({ error: "Hotel not found" }), {
        status: 404,
      });
    }

    if (existingHotel.userId !== userId) {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
      });
    }

    
    await prismadb.hotel.delete({
      where: {
        id: Params.hotelId,
      },
    });

    return new Response(JSON.stringify({ message: "Hotel deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting hotel:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
