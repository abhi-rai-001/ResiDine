export async function POST(req) {
  try {
    const body = await req.json();
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized. User ID not found" }), { status: 401 });
    }

    const { amenities, hotelId, ...roomData } = body;

    if (!hotelId) {
      return new Response(JSON.stringify({ error: "Hotel ID is required" }), { status: 400 });
    }

    const hotel = await prismadb.hotel.findUnique({
      where: {
        id: hotelId,
        userId: userId
      }
    });

    if (!hotel) {
      return new Response(JSON.stringify({ error: "Hotel not found or you don't have permission" }), { status: 404 });
    }

    const room = await prismadb.room.create({
      data: {
        ...roomData,
        ...amenities,
        hotelId
      },
    });

    return new Response(JSON.stringify(room), { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}