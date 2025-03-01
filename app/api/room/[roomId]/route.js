import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { z } from "zod";

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!params || !params.roomId) {
      return new Response(JSON.stringify({ error: "Room ID is required" }), {
        status: 400,
      });
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const body = await req.json();

  
    const roomUpdateSchema = z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      price: z.number().optional(),
      image: z.string().optional(),
      peopleCount: z.number().optional(),
      bedCount: z.number().optional(),
      kingSizeBed: z.boolean().optional(),
      queenSizeBed: z.boolean().optional(),
      singleBed: z.boolean().optional(),
      sofaBed: z.boolean().optional(),
      bathroom: z.boolean().optional(),
      balcony: z.boolean().optional(),
      wifi: z.boolean().optional(),
      minibar: z.boolean().optional(),
      safe: z.boolean().optional(),
    });

    const validatedData = roomUpdateSchema.parse(body);

    const existingRoom = await prismadb.room.findUnique({
      where: {
        id: params.roomId,
      },
      include: {
        hotel: true,
      },
    });

    if (!existingRoom) {
      return new Response(JSON.stringify({ error: "Room not found" }), {
        status: 404,
      });
    }

    if (existingRoom.hotel.userId !== userId) {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
      });
    }

    const room = await prismadb.room.update({
      where: {
        id: params.roomId,
      },
      data: validatedData,
    });

    return new Response(JSON.stringify(room), { status: 200 });
  } catch (error) {
    console.error("Error updating room:", error);

    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
export async function DELETE(req, { params }) {
    try {
      const session = await auth();
      const userId = session?.user?.id;
  
      if (!params || !params.roomId) {
        return new Response(JSON.stringify({ error: "Room ID is required" }), {
          status: 400,
        });
      }
  
      if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }
  
      const existingRoom = await prismadb.room.findUnique({
        where: {
          id: params.roomId,
        },
        include: {
          hotel: true,
        },
      });
  
      if (!existingRoom) {
        return new Response(JSON.stringify({ error: "Room not found" }), {
          status: 404,
        });
      }
  
      if (existingRoom.hotel.userId !== userId) {
        return new Response(JSON.stringify({ error: "Access denied" }), {
          status: 403,
        });
      }
  
      await prismadb.room.delete({
        where: {
          id: params.roomId,
        },
      });
  
      return new Response(
        JSON.stringify({ message: "Room deleted successfully" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting room:", error);
  
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }
  