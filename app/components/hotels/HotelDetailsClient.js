'use client'

import useLocation from "@/hooks/useLocation";
import Image from "next/image";
import Amenity from "../Amenities/Amenity";
import { MapPin, Wifi, Car, Coffee, Utensils, Dumbbell, 
         Droplet, Wine, Bed, Award, DollarSign, Dog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import RoomCard from "../room/RoomCard";
import { useEffect } from "react";

const HotelDetailsClient = ({ hotel}) => {
  const { getCountryByCode, getStateByCode } = useLocation();
  const country = getCountryByCode(hotel.country);
  const state = getStateByCode(hotel.country, hotel.state);
const rooms = hotel?.rooms
const bookings =hotel.bookings
    console.log("Hotel data:", hotel);
    console.log("Rooms data:", rooms);
    console.log("Bookings data:", bookings)

  return (
    <div className="container">
      <Card className="w-full shadow-md font-sans">
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={hotel.image}
            alt={hotel.title}
            fill
            className="object-cover rounded-t-lg"
            priority
          />
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <CardTitle className="text-2xl md:text-3xl font-bold font-heading tracking-tight text-primary">
              {hotel.title}
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-sm w-fit font-medium">
              <MapPin className="h-4 w-4" />
              {`${hotel.city}, ${state?.name}, ${country?.name}`}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 font-heading text-primary/90">Location Details</h3>
            <p className="text-gray-600 font-normal leading-relaxed">
              {`${hotel.address}, ${hotel.city}, ${state?.name}`}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-3 font-heading text-primary/90">About this Hotel</h3>
            <p className="text-gray-600 leading-relaxed font-normal">
              {hotel.description}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-4 font-heading text-primary/90">Popular Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {hotel.wifi && (
                <Amenity>
                  <Wifi className="h-5 w-5 text-primary" />
                  <span className="ml-2 font-medium text-sm">Free WiFi</span>
                </Amenity>
              )}
              
              {hotel.parking && (
                <Amenity>
                  <Car className="h-5 w-5 text-primary" />
                  <span className="ml-2 font-medium text-sm">Parking</span>
                </Amenity>
              )}
              
              {hotel.breakfast && (
                <Amenity>
                  <Coffee className="h-5 w-5 text-primary" />
                  <span className="ml-2 font-medium text-sm">Breakfast</span>
                </Amenity>
              )}
              
              {hotel.restaurant && (
                <Amenity>
                  <Utensils className="h-5 w-5 text-primary" />
                  <span className="ml-2 font-medium text-sm">Restaurant</span>
                </Amenity>
              )}
              
              {hotel.gym && (
                <Amenity>
                  <Dumbbell className="h-5 w-5 text-primary" />
                  <span className="ml-2 font-medium text-sm">Fitness Center</span>
                </Amenity>
              )}
              
              {hotel.pool && (
                <Amenity>
                  <Droplet className="h-5 w-5 text-primary" />
                  <span className="ml-2 font-medium text-sm">Swimming Pool</span>
                </Amenity>
              )}
              
              {hotel.bar && (
                <Amenity>
                  <Wine className="h-5 w-5 text-primary" />
                  <span className="ml-2 font-medium text-sm">Bar</span>
                </Amenity>
              )}
              
              {hotel.roomService && (
                <Amenity>
                  <Bed className="h-5 w-5 text-primary" />
                  <span className="ml-2 font-medium text-sm">Room Service</span>
                </Amenity>
              )}
              
              {hotel.spa && (
                <Amenity>
                  <Award className="h-5 w-5 text-primary" />
                  <span className="ml-2 font-medium text-sm">Spa</span>
                </Amenity>
              )}
              
              {hotel.laundry && (
                <Amenity>
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="ml-2 font-medium text-sm">Laundry</span>
                </Amenity>
              )}
              
              {hotel.pets && (
                <Amenity>
                  <Dog className="h-5 w-5 text-primary" />
                  <span className="ml-2 font-medium text-sm">Pet Friendly</span>
                </Amenity>
              )}
            </div>
          </div>

          <Separator />
          
          <div>
            <h3 className="text-xl font-semibold mb-4 font-heading text-primary/90">Available Rooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms && rooms.length > 0 ? (
                rooms.map((room) => (
                  <RoomCard key={room.id} hotel={hotel} room={room} bookings={bookings} />
                ))
              ) : (
                <p className="text-gray-600">No rooms available for this hotel.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
 
export default HotelDetailsClient;