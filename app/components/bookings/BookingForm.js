'use client'
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Users, Bed, CreditCard, Home, Mail, Phone, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import Image from 'next/image';

const HotelBookingForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hotelId = searchParams.get('hotelId');
  const hotelName = searchParams.get('hotelName');
  const roomId = searchParams.get('roomId');
  const roomTitle = searchParams.get('roomTitle');
  const roomImage = searchParams.get('roomImage');
  const roomPrice = searchParams.get('roomPrice');
  const days = searchParams.get('days') || 0;
  const totalPrice = searchParams.get('totalPrice') || 0;
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [selectedRoomId, setSelectedRoomId] = useState(roomId || '');
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    const fetchRooms = async () => {
      if (hotelId) {
        try {
       
          const response = await axios.get(`/api/hotel/${hotelId}/rooms`);
          setAvailableRooms(response.data);
        } catch (error) {
          console.error('Error fetching rooms:', error);
        
          toast.error(
          
           'Unable to load available rooms. Please select a hotel first.',
          );
        }
      }
    };
    
    fetchRooms();
  }, [hotelId]);
  
  // Parse dates from URL parameters
  useEffect(() => {
    const checkInParam = searchParams.get('checkInDate');
    const checkOutParam = searchParams.get('checkOutDate');
    
    if (checkInParam) {
      setCheckInDate(parseISO(checkInParam));
    }
    
    if (checkOutParam) {
      setCheckOutDate(parseISO(checkOutParam));
    }
  }, [searchParams]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate || !selectedRoomId) {
      toast.error(
     
       'Please fill in all required booking details',
      );
      return;
    }
    
    setIsLoading(true);
    
    try {
      const bookingData = {
        hotelId,
        roomId: selectedRoomId || null, 
        checkInDate: checkInDate ? checkInDate.toISOString() : null,
        checkOutDate: checkOutDate ? checkOutDate.toISOString() : null,
        firstName: firstName?.trim() || "", 
        lastName: lastName?.trim() || "",
        email: email?.trim() || "",
        phone: phone?.trim() || "",
        guestCount: guestCount ? parseInt(guestCount, 5) : 1, 
        totalPrice: totalPrice ? parseFloat(totalPrice).toFixed(2) : "0.00", 
        specialRequests: specialRequests?.trim() || "",
    
        paymentDetails: {
            cardName: cardName?.trim() || "Unknown",
            lastFourDigits: cardNumber && cardNumber.length >= 4 ? cardNumber.slice(-4) : "****", 
        }
    };
      
      const response = await axios.post('/api/bookings', bookingData);
      
      toast.success(
    'Booking completed successfully!',
      );
      

      router.push(`/bookings/${response.data.id}/confirmation`);
      
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error(
        error.response?.data?.message || 'Failed to complete booking',
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <Card className="bg-white shadow-md">
          <CardHeader className="bg-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Hotel Reservation</CardTitle>
                <CardDescription className="text-blue-100">
                  {hotelName ? `Booking for ${hotelName}` : 'Book your perfect stay with us'}
                </CardDescription>
              </div>
              <Home className="h-8 w-8" />
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Room Summary */}
            {roomTitle && roomImage && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Booking Summary</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-full md:w-1/3 h-48">
                    <Image
                      src={roomImage}
                      alt={roomTitle}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 grid gap-2">
                    <div className="flex justify-between">
                      <span>Hotel:</span>
                      <span className="font-medium">{hotelName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Room:</span>
                      <span className="font-medium">{roomTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-in:</span>
                      <span className="font-medium">{checkInDate ? format(checkInDate, "PPP") : "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out:</span>
                      <span className="font-medium">{checkOutDate ? format(checkOutDate, "PPP") : "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{days} day(s)</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Price:</span>
                      <span>₹ {totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {/* Guest Information */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium">Guest Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Abhi" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Rai" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex">
                      <Mail className="mr-2 h-4 w-4 opacity-50 self-center" />
                      <Input 
                        id="email" 
                        placeholder="abhi.rai@example.com" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <Phone className="mr-2 h-4 w-4 opacity-50 self-center" />
                      <Input 
                        id="phone" 
                        placeholder="+91 99999 99999" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking Details */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium">Booking Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Check-in Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkInDate ? format(checkInDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={checkInDate}
                          onSelect={setCheckInDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Check-out Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOutDate ? format(checkOutDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={checkOutDate}
                          onSelect={setCheckOutDate}
                          initialFocus
                          disabled={(date) => date <= checkInDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="roomType">Room Type</Label>
                    <Select 
                      value={selectedRoomId} 
                      onValueChange={setSelectedRoomId}
                    >
                      <SelectTrigger id="roomType" className="w-full">
                        <div className="flex items-center">
                          <Bed className="mr-2 h-4 w-4 opacity-70" />
                          <SelectValue placeholder="Select room type" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.length > 0 ? (
                          availableRooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.title} - ₹{room.price}/night
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value={roomId} disabled={!roomId}>
                            {roomTitle || "Loading room options..."}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select value={guestCount} onValueChange={setGuestCount}>
                      <SelectTrigger id="guests" className="w-full">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 opacity-70" />
                          <SelectValue placeholder="Select guests" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                        <SelectItem value="5">5+ Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium">Payment Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input 
                      id="cardName" 
                      placeholder="Abhi Rai" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="flex">
                      <CreditCard className="mr-2 h-4 w-4 opacity-50 self-center" />
                      <Input 
                        id="cardNumber" 
                        placeholder="•••• •••• •••• ••••" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY" 
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv" 
                      placeholder="123" 
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <textarea
                  id="specialRequests"
                  className="w-full p-2 border rounded-md min-h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special requests or requirements for your stay..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                ></textarea>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="text-sm text-gray-500">
              <p>* Cancellation policy: Free cancellation up to 24 hours before check-in</p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                `Complete Booking (₹ ${totalPrice})`
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default HotelBookingForm;