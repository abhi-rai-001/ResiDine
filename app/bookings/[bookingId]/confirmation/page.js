"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import Link from "next/link";

const BookingConfirmation = () => {
  const params = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`/api/bookings/${params.bookingId}`);
        setBooking(response.data);
        console.log("fdgzfgzh", response.data);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.bookingId) {
      fetchBookingDetails();
    }
  }, [params.bookingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="bg-green-50 border-b">
          <div className="flex items-center justify-center text-center">
            <div>
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <CardTitle className="text-2xl font-bold text-green-800">
                Booking Confirmed!
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Your booking has been successfully processed
              </p>
              {booking && (
                <p className="font-medium mt-1">Booking ID: {booking.id}</p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-6">
          {booking ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Guest Name:</span>
                      <span className="font-medium">{booking?.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{booking.userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium">{booking.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Guests:</span>
                      <span className="font-medium">{booking.guest}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Check-in:</span>
                      <span className="font-medium">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Check-out:</span>
                      <span className="font-medium">
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      {booking.paymentStatus ? (
                        <span className="font-medium text-green-600">
                          {" "}
                          Paid{" "}
                        </span>
                      ) : (
                        <span className="font-medium text-red-600">
                          {" "}
                          Rejected{" "}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-3">
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="font-medium">Credit Card</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Card:</span>
                      <span className="font-medium">
                        **** **** ****{" "}
                        {booking.paymentDetails?.lastFourDigits || "****"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
 
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Amount:</span>
                      <span className="font-medium text-lg">
                        ₹ {booking.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">Booking details not found</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-gray-50 flex justify-center border-t">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Return to Homepage
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
