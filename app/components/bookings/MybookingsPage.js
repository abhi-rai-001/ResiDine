'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { CalendarDays, MapPin, Users, CreditCard, CheckCircle, XCircle, Hotel, User } from 'lucide-react';
import Link from 'next/link';

const MyBookingsPage = ({ bookingsMade, bookingsReceived }) => {
  const [activeTab, setActiveTab] = useState('made');
  
  const noDataComponent = (
    <div className="min-h-[50vh] bg-gray-50 flex items-center justify-center">
      <XCircle className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-gray-600">No data available</p>
    </div>
  );
  
  const noBookingsComponent = (type) => (
    <div className="min-h-[50vh] bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <CalendarDays className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {type === 'made' ? 'No bookings yet' : 'No guest bookings yet'}
        </h2>
        <p className="text-gray-600 mb-6">
          {type === 'made' 
            ? "Looks like you haven't made any hotel reservations yet." 
            : "You don't have any guest bookings for your properties yet."}
        </p>
        <Link 
          href={type === 'made' ? "/" : "/hotels/new"}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {type === 'made' ? 'Find Hotels' : 'Add a Hotel'}
        </Link>
      </div>
    </div>
  );
  
  const renderBookingsList = (bookings) => {
    if (!bookings) return noDataComponent;
    if (bookings.length === 0) return noBookingsComponent(activeTab);
    
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col transition-transform hover:shadow-md hover:translate-y-px">
            <div className="relative h-48 w-full">
              <Image 
                src={booking.hotel.image || '/placeholder.jpg'}
                alt={booking.hotel.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4 flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-gray-800 truncate">{booking.hotel.title}</h2>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  booking.paymentStatus ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {booking.paymentStatus ? 'Paid' : 'Pending'}
                </span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm truncate">
                  {booking.hotel.city}, {booking.hotel.country}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-700">
                  <CalendarDays className="w-4 h-4 mr-2 text-blue-500" />
                  <div>
                    <span className="font-medium">
                      {format(new Date(booking.checkInDate), 'PPP')}
                    </span>
                    <span className="mx-2">→</span>
                    <span className="font-medium">
                      {format(new Date(booking.checkOutDate), 'PPP')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-700">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{booking.guest} guest{booking.guest !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-700">
                  <CreditCard className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Total: ${booking.price}</span>
                </div>
                
                {activeTab === 'received' && (
                  <div className="flex items-center text-sm text-gray-700">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Guest: {booking.userName}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-100 pt-3 mt-auto">
                <div className="text-sm font-medium text-gray-500">
                  Room: {booking.room.title}
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
              <span className="text-xs text-gray-500">
                Booked on {format(new Date(booking.bookedAt), 'PP')}
              </span>
              <Link 
                href={`/bookings/${booking.id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">Manage your bookings and reservations</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('made')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'made'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-5 h-5 inline-block mr-2" />
              Bookings Made In Your Hotel
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'received'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Hotel className="w-5 h-5 inline-block mr-2" />
              Bookings in other Hotels
            </button>
          </div>
        </div>

        {activeTab === 'made' ? renderBookingsList(bookingsMade) : renderBookingsList(bookingsReceived)}
      </div>
    </div>
  );
};

export default MyBookingsPage;