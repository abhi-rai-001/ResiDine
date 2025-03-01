import getHotelsByUserID from "@/actions/getHotelsByUserID";
import HotelList from "../components/hotels/hotelList";

const myHotels = async() => {
    const hotel = await getHotelsByUserID()
    console.log(hotel)
    return (  
        <>
       
        <div className=""><h1 className="text-2xl font-bold text-center">My hotels </h1></div>
      {hotel.length===0?<div className="text-xl font-bold text-center flex items-center justify-center h-[80vh] "> No hotels found. Add one to view your hotel here.</div> :
        <div className=""> <HotelList hotel = {hotel}/> </div>}
        </>
    );
}
 
export default myHotels;