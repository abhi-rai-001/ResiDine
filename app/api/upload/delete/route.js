import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { imageKey } = await request.json();

    if (!imageKey) {
      return NextResponse.json(
        { error: 'Image key is required' },
        { status: 400 }
      );
    }

    // Construct the Basic Auth header
    const auth = Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64');

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image/upload?public_id=${encodeURIComponent(imageKey)}&invalidate=true`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const result = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok) {
      console.error('Failed to delete image:', result);
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: cloudinaryResponse.status }
      );
    }

    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
