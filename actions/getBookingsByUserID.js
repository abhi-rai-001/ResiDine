import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";

const getBookingsByUserID = async () => {
  const session = await auth();
  console.log('Session:', session);
  
  const userId = session?.user?.id;
  
  if (!userId || userId === "undefined") {
    throw new Error("User is unauthorised");
  }

  try {
    const bookings = await prismadb.booking.findMany({
      where: { 
        userId 
      },
      include: {
        room: true,
        hotel: true
      },
      orderBy: {
        bookedAt: "desc",
      }
    });

    if (bookings.length === 0) {
      console.warn(`No bookings found for user ID: ${userId}`);
      return [];
    }

    console.log("Bookings data retrieved:", bookings);

    return bookings; 
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error fetching booking data");
  }
};

export default getBookingsByUserID;