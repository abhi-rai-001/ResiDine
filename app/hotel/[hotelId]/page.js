import getHotelsByID from "@/actions/getHotelsByID";
import { auth } from "@/auth";
import HotelClient from "./hotelClient";

export default async function Hotel({ params }) {
  console.log("Received params:", params);
  

  const hotelId = params?.hotelId;
  
  if (!hotelId) {
    console.error("Missing hotelId in params:", params);
    return <div>❌ Invalid Request</div>;
  }

  const session = await auth();
  console.log("Session data:", session);

  const userId = session?.user?.id;
  if (!userId) {
    return <div>❌ You are not authorized to view this page</div>;
  }

  if (hotelId === "new") {
    return (
      <div>
        <HotelClient hotel={null} />
      </div>
    );
  }

  if (!/^[0-9a-fA-F]{24}$/.test(hotelId)) {
    console.error("Invalid hotelId format:", hotelId);
    return <div>⚠️ Invalid Hotel ID format</div>;
  }

  let hotel = null;
  try {
    hotel = await getHotelsByID(hotelId);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return <div>⚠️ Server error while fetching hotel</div>;
  }

  if (!hotel) {
    return <div>⚠️ Hotel not found</div>;
  }

  if (hotel.userId !== userId) {
    return <div>🚫 Access Denied</div>;
  }

  return (
    <div>
      <HotelClient hotel={hotel} />
    </div>
  );
}