import HotelCard from "./HotelCard";

const HotelList = ({ hotel }) => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotel.map((hotel) => (
            <div key={hotel.id} className="h-full">
              <HotelCard hotel={hotel} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
export default HotelList;