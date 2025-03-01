
"use client";

import AddHotels from "@/app/components/hotels/addhotels";

export default function HotelEditor({ hotel, isNew, userId }) {
  return (
    <div>
      {isNew ? (
        <AddHotels userId={userId} />
      ) : (
        <>
          <h2>🏨 Edit Hotel Details</h2>
          <AddHotels hotel={hotel} />
        </>
      )}
    </div>
  );
}
