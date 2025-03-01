import prismadb from "@/lib/prismadb"
export const getHotels = async (searchParams) => {
  const params = await searchParams;
  try {
    const { title, country, state, city } = params;
    
    const whereClause = {};
    if (title) whereClause.title = { contains: title };
    if (country) whereClause.country = country;
    if (state) whereClause.state = state;
    if (city) whereClause.city = city;
    
    const hotels = await prismadb.hotel.findMany({
      where: whereClause,
      include: { rooms: true }
    });
    return hotels;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw new Error(error.message || "Error fetching hotels");
  }
};

const getHotelsByID = async (hotelId) => {
  console.log("Received hotelId:", hotelId);


  
  if (!hotelId || hotelId === "undefined") {
    throw new Error("Invalid Hotel ID: hotelId is undefined");
  }
  
  try {
    const hotel = await prismadb.hotel.findUnique({
      where: { id: hotelId },
      include: { rooms: true }
    });
    console.log("Fetched Hotel:", hotel);
console.log("Fetched Rooms:", hotel?.rooms);
    
    return hotel; 
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Error fetching hotel data: ${error.message}`);
  }
};