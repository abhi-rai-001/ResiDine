import { getHotels } from "@/actions/getHotels";
import HotelList from "../components/hotels/hotelList";

export default async function Home({searchParams}) {
  const hotel = await getHotels(searchParams)

  if(!hotel) {<div className="">No hotels Found...</div>}
  return (
<div className="">
  
   <HotelList hotel={hotel}/>
</div>
  );
}
