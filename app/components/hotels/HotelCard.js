'use client'

import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Amenity from "../Amenities/Amenity";
import { IndianRupee, MapPin, Bed, Users, BedDouble, Wifi, GlassWater, Lock } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import { Button } from "@/components/ui/button";

const HotelCard = ({ hotel }) => {
  const pathname = usePathname();
  const isMyHotels = pathname.includes('my-hotels');
  const router = useRouter();
  const { getCountryByCode } = useLocation();
  const country = getCountryByCode(hotel.country);

  // Get the first room if it exists
  const room = hotel?.rooms && hotel.rooms.length > 0 ? hotel.rooms[0] : null;

  return (
    <div 
      onClick={() => { !isMyHotels && router.push(`/hotel-details/${hotel.id}`) }}
      className={cn(
        'h-full transition duration-300 hover:shadow-xl', 
        !isMyHotels && 'cursor-pointer hover:translate-y-[-4px]', 
        isMyHotels && 'cursor-default'
      )} 
    >
      <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm">
        {/* Image container with optimized height */}
        <div className="relative w-full h-48">
          <Image 
            fill
            src={hotel.image}
            alt={hotel.title}
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content container with reduced padding */}
        <div className="p-4 flex flex-col h-full">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">{hotel.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
            {hotel.description}
          </p>
          
          <div className="mb-2">
            <Amenity>
              <MapPin className="size-3.5 text-gray-500"/> 
              <span className="text-gray-600 text-sm">{hotel.city}, {country?.name}</span>
            </Amenity>
          </div>
          
          <div className="mt-auto">
            {/* Price section with tighter spacing */}
            {room?.price && (
              <div className="flex items-center mb-2">
                <div className="flex items-center font-bold text-lg text-gray-900">
                  <IndianRupee className="h-4 w-4 mr-1"/>
                  {room.price}
                </div> 
                <span className="text-xs text-gray-500">/24hrs</span>
              </div>
            )}
            
            {/* Room amenities with tighter grid */}
            {room && (
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {room.bedCount > 0 && (
                  <Amenity>
                    <Bed className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="ml-1 text-xs">{room.bedCount} Bed(s)</span>
                  </Amenity>
                )}
                
                {room.peopleCount > 0 && (
                  <Amenity>
                    <Users className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="ml-1 text-xs">{room.peopleCount} Guest(s)</span>
                  </Amenity>
                )}
                
                {room.balcony && (
                  <Amenity>
                    <BedDouble className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="ml-1 text-xs">Balcony</span>
                  </Amenity>
                )}
                
                {room.wifi && (
                  <Amenity>
                    <Wifi className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="ml-1 text-xs">Wi-Fi</span>
                  </Amenity>
                )}
                
                {room.minibar && (
                  <Amenity>
                    <GlassWater className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="ml-1 text-xs">Mini-Bar</span>
                  </Amenity>
                )}
                
                {room.safe && (
                  <Amenity>
                    <Lock className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="ml-1 text-xs">Locker</span>
                  </Amenity>
                )}
              </div>
            )}
            {isMyHotels && <div className="w-full flex justify-center items-center"> <Button onClick={()=>{
                 router.push(`/hotel/${hotel.id}`)
            }} variant='outline' className=' w-15  border-slate-600 rounded-xl my-5 shadow-xl'> Edit </Button></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default HotelCard;