import { NextResponse } from 'next/server';
import prismadb  from '@/lib/prismadb';


export async function GET(request, { params }) {
  try {
   
    const bookingId = params.bookingId;
    console.log('Received bookingId:', bookingId);
    
    if (!bookingId) {
      return NextResponse.json(
        { message: 'Booking ID is required' },
        { status: 400 }
      );
    }
    
    const booking = await prismadb.booking.findUnique({
      where: {
        id: bookingId
      },
      include: {
        hotel: {
          select: {
            id: true,
            title: true,
            image: true,
          }
        },
        room: {
          select: {
            id: true,
            title: true,
            image: true,
            price: true,
          }
        }
      }
    });
    
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { message: 'Error fetching booking', error: error.message },
      { status: 500 }
    );
  }
}