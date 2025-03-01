// app/my-bookings/page.js
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import MyBookingsPage from '../components/bookings/MybookingsPage';
import getBookingsByHotelOwnerID from '@/actions/getBookingsByHotelOwnerID';
import getBookingsByUserID from '@/actions/getBookingsByUserID';

export const metadata = {
  title: 'My Bookings | Hotel Booking Platform',
  description: 'View and manage your hotel bookings',
};

export default async function BookingsPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/login?callbackUrl=/my-bookings');
  }

  try {
    // Get both types of bookings
    const [bookingIMade, bookingUsersMade] = await Promise.all([
      getBookingsByHotelOwnerID(),
      getBookingsByUserID()
    ]);

    return (
      <MyBookingsPage 
        bookingsMade={bookingIMade || []} 
        bookingsReceived={bookingUsersMade || []} 
      />
    );
  } catch (error) {
    console.error("Error loading bookings:", error);
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold">My Bookings</h1>
        <p className="text-red-500">There was an error loading your bookings. Please try again later.</p>
      </div>
    );
  }
}