"use client";
import React, { useState, useEffect } from "react";
import { Booking, Hotel, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Amenity from "../Amenities/Amenity";
import {
  Bed,
  BedDouble,
  Edit,
  GlassWater,
  IndianRupeeIcon,
  Loader2,
  Loader2Icon,
  Lock,
  Trash,
  Users,
  Wand2,
  Wifi,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddRooms from "./addRooms";
import axios from "axios";
import { toast } from "sonner";
import { DatePickerWithRange } from "./DateRangePicker";
import { differenceInCalendarDays } from "date-fns";

const RoomCard = ({ hotel, room, bookings = [] }) => {
  const pathname = usePathname();
  const isHotelDetailsPage = pathname.includes("hotel-details");
  const [isLoading, setIsLoading] = useState(false);
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const Router = useRouter();
  const [date, setDate] = useState();
    const [days, setDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(room?.price || 0) 

    useEffect(() => {
      if (date && date.from && date.to) {
        const dayCount = differenceInCalendarDays(date.to, date.from)
        setDays(dayCount)
        if (dayCount && room?.price) {
          setTotalPrice(dayCount * room.price)
        }
      } else {
        setTotalPrice(room?.price || 0)
      }
    }, [date, room?.price])


  const handleDialougeOpen = () => {
    setOpen((prev) => !prev);
  };
  const handleBooking = () => {
    const params = new URLSearchParams({
      hotelId: hotel.id,
      hotelName: hotel.title,
      roomId: room.id,
      roomTitle: room.title,
      roomImage: room.image,
      roomPrice: room.price,
      checkInDate: date?.from ? date.from.toISOString() : '',
      checkOutDate: date?.to ? date.to.toISOString() : '',
      days: days,
      totalPrice: totalPrice
    });
    
    Router.push(`/hotel-details/${hotel.id}/bookings?${params.toString()}`);
  };
    

  



  const handleRoomDelete = async (room) => {
    setIsLoading(true);
    try {
      const ImageKey = room.image.substring(room.image.lastIndexOf("/") + 1);
      
      await axios.post("/api/upload/delete", { ImageKey });
      await axios.delete(`/api/room/${room.id}`);
      
      toast.success(
         "Room Deleted",
      );

      
      Router.refresh();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      
      const errorMessage = error.response?.data?.message || "Something went wrong";
      
      toast.error(
       
       errorMessage,
      );
      
      console.error("Error deleting room:", error);
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-indigo-50 pb-2">
        <CardTitle className="text-xl font-bold text-indigo-800">{room.title}</CardTitle>
        <CardDescription className="text-gray-600">{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-64 w-full">
          <Image
            src={room.image}
            fill
            alt={room.title}
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            <Amenity>
              <Bed className="h-4 w-4 text-indigo-600" />
              <span className="ml-2">{room.bedCount} Bed(s)</span>
            </Amenity>
            <Amenity>
              <Users className="h-4 w-4 text-indigo-600" />
              <span className="ml-2">{room.peopleCount} Guest(s)</span>
            </Amenity>
            {!!room.kingSizeBed && (
              <Amenity>
                <BedDouble className="h-4 w-4 text-indigo-600" />
                <span className="ml-2">{room.kingSizeBed} King-sized Bed</span>
              </Amenity>
            )}
            {!!room.queenSizeBed && (
              <Amenity>
                <BedDouble className="h-4 w-4 text-indigo-600" />
                <span className="ml-2">{room.queenSizeBed} Queen-sized Bed</span>
              </Amenity>
            )}
            {!!room.singleBed && (
              <Amenity>
                <Bed className="h-4 w-4 text-indigo-600" />
                <span className="ml-2">{room.singleBed} Single Bed</span>
              </Amenity>
            )}
            {!!room.balcony && (
              <Amenity>
                <BedDouble className="h-4 w-4 text-indigo-600" />
                <span className="ml-2">{room.balcony} Balcony</span>
              </Amenity>
            )}
            {!!room.wifi && (
              <Amenity>
                <Wifi className="h-4 w-4 text-indigo-600" />
                <span className="ml-2">{room.wifi} Wi-Fi</span>
              </Amenity>
            )}
            {!!room.minibar && (
              <Amenity>
                <GlassWater className="h-4 w-4 text-indigo-600" />
                <span className="ml-2">{room.minibar} Mini-Bar</span>
              </Amenity>
            )}
            {!!room.safe && (
              <Amenity>
                <Lock className="h-4 w-4 text-indigo-600" />
                <span className="ml-2">{room.safe} Locker</span>
              </Amenity>
            )}
          </div>
          <Separator className="my-4" />
          <div className="flex gap-5 items-center py-2">
            <span className="text-gray-700">Room Price:</span>
            <span className="font-bold text-xl flex items-center text-indigo-800">
              <IndianRupeeIcon className="w-4 h-4 mr-1" /> {room.price}
            </span>
          </div>
          <Alert className="bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center my-4 rounded-xl border-none">
            <AlertDescription className="font-medium">
              Room rates are applicable for a 24-hour period from the time of booking.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-5 rounded-b-lg border-t border-gray-200 shadow-inner">
  {isHotelDetailsPage ? (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        <div className="mb-2 text-gray-700 font-medium">
          Select your Check-In and Check-Out days
        </div>
        <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>
      <div className="mt-6 font-bold text-lg text-indigo-800">
        {`Total Price: ${totalPrice} for ${days} day(s)`}
      </div>
      <div className="w-[90%] flex justify-center ">
      <Button className='my-5 mx-auto bg-blue-400' disabled={bookingIsLoading} type='button' onClick={handleBooking}>
        {bookingIsLoading? <Loader2 className="mr-2 h-4 w-4"/> : <Wand2 className="mr-2 h-4 w-4"/>}
        {bookingIsLoading? 'Loading' : 'Book Now'}
      </Button>
      </div>
    </div> 
  ) : (
    <div className="flex justify-between w-full">
      <Button
        className="bg-white border border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-md rounded-lg transition-all duration-200"
        onClick={() => handleRoomDelete(room)}
        disabled={isLoading}
        type="button"
        variant="outline"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
          </>
        ) : (
          <>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </>
        )}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 shadow-sm"
            type="button"
            variant="outline"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Room
          </Button>

        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-indigo-800">Edit a Room</DialogTitle>
            <DialogDescription className="text-gray-600">Make changes to this room</DialogDescription>
          </DialogHeader>
          <AddRooms
            hotel={hotel}
            room={room}
            handleDialougeOpen={handleDialougeOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  )}
</CardFooter>
    </Card>
  );
};

export default RoomCard;