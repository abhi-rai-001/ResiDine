import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";

const getBookingsByHotelOwnerID = async () => {
 
  const session = await auth();
    console.log('Session:', session);
    const userId = session?.user?.id;
  if (!userId || userId === "undefined") {
    throw new Error("User is unauthorised");
  }

  try {
    const bookings = await prismadb.booking.findMany({
      where: { hotelOwnerId: userId },
      include: {
        room: true,
        hotel: true
      },
      orderBy:{
        bookedAt: "desc",
      }
    });

    if (!bookings) {
      console.warn(`No hotel found with ID`);
      return null;
    }

    console.log("Hotel data retrieved:", bookings);

    return bookings; 
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error fetching hotel data");
  }
};

export default getBookingsByHotelOwnerID
