import prismadb from "@/lib/prismadb";

const getHotelsByID = async (hotelId) => {
  console.log("Received hotelId:", hotelId);

  if (!hotelId || hotelId === "undefined") {
    throw new Error("Invalid Hotel ID: hotelId is undefined");
  }

  try {
    const hotel = await prismadb.hotel.findUnique({
      where: { id: hotelId },
      include: {
        rooms: true
      }
    });

    if (!hotel) {
      console.warn(`No hotel found with ID: ${hotelId}`);
      return null;
    }

    console.log("Hotel data retrieved:", hotel);

    return hotel; 
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error fetching hotel data");
  }
};

export default getHotelsByID;