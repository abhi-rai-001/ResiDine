import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";
const getHotelsByUserID = async () => {
 
  const session = await auth();
    console.log('Session:', session);
    const userId = session?.user?.id;
  if (!userId || userId === "undefined") {
    throw new Error("User is unauthorised");
  }

  try {
    const hotel = await prismadb.hotel.findMany({
      where: { userId: userId },
      include: {
        rooms: true
      }
    });

    if (!hotel) {
      console.warn(`No hotel found with ID`);
      return null;
    }

    console.log("Hotel data retrieved:", hotel);

    return hotel; 
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error fetching hotel data");
  }
};

export default getHotelsByUserID;