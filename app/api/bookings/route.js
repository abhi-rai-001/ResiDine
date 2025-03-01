

import prismadb from '@/lib/prismadb';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {

    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    
 
    const hotel = await prismadb.hotel.findUnique({
      where: {
        id: data.hotelId
      }
    });

    if (!hotel) {
      return NextResponse.json(
        { error: "Hotel not found" },
        { status: 404 }
      );
    }


    const booking = await prismadb.booking.create({
      data: {
        userId: session.user.id, 
        userEmail: data.email,
        userName: `${data.firstName} ${data.lastName}`,
        checkInDate: new Date(data.checkInDate),
        checkOutDate: new Date(data.checkOutDate),
        price: parseFloat(data.totalPrice),
        phone: data.phone,
        guest: data.guestCount,
        days: parseInt(data.days || 1), 
        paymentStatus: true,
        paymentIntentId: crypto.randomUUID(),
        hotelName: hotel.name || "Unknown Hotel",
        hotelOwnerId: hotel.userId || "000000000000000000000000",
        hotel: {
          connect: {
            id: data.hotelId
          }
        },
        room: {
          connect: {
            id: data.roomId
          }
        }
      }
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Error creating booking", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    

    const bookings = await prismadb.booking.findMany({
      where: {
        userId: userId || session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        hotel: true,
        room: true
      }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Error fetching bookings" },
      { status: 500 }
    );
  }
}