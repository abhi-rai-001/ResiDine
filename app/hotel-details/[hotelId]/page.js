import getHotelsByID from "@/actions/getHotelsByID";
import HotelDetailsClient from "@/app/components/hotels/HotelDetailsClient";

const HotelDetails = async ({ params }) => {
  console.log("🔍 Received params:", params); 
  const hotel = await getHotelsByID(params.hotelId);
  
  console.log("🏨 Fetched hotel:", hotel ? hotel.title : "null"); 

  if (!hotel) {
    return <div className="">Oops! Hotel not found</div>;
  }

  return (
    <div className="">
      <HotelDetailsClient hotel={hotel} />
    </div>
  );
};

export default HotelDetails;