"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Edit,
  Eye,
  InfoIcon,
  Loader2,
  Plus,
  Terminal,
  Trash,
} from "lucide-react";
import axios from "axios";
import useLocation from "@/hooks/useLocation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import AddRooms from "../room/addRooms";
import RoomCard from "../room/RoomCard";


const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  image: z.string().min(1, {
    message: "Image is required",
  }),
  country: z.string().min(1, {
    message: "Country is required",
  }),
  state: z.string().min(1, {
    message: "State is required",
  }),
  city: z.string().min(1, {
    message: "City is required",
  }),
  address: z.string().min(10, {
    message: "Address is required",
  }),
  amenities: z.object({
    gym: z.boolean().default(false),
    pool: z.boolean().default(false),
    restaurant: z.boolean().default(false),
    roomService: z.boolean().default(false),
    spa: z.boolean().default(false),
    bar: z.boolean().default(false),
    wifi: z.boolean().default(false),
    laundry: z.boolean().default(false),
    parking: z.boolean().default(false),
    breakfast: z.boolean().default(false),
    pets: z.boolean().default(false),
  }),
});

const amenitiesList = [
  { id: "gym", label: "Fitness Center/Gym" },
  { id: "pool", label: "Swimming Pool" },
  { id: "restaurant", label: "Restaurant" },
  { id: "roomService", label: "Room Service" },
  { id: "spa", label: "Spa Services" },
  { id: "bar", label: "Bar/Lounge" },
  { id: "wifi", label: "Free Wi-Fi" },
  { id: "laundry", label: "Laundry Service" },
  { id: "parking", label: "Parking" },
  { id: "breakfast", label: "Complimentary Breakfast" },
  { id: "pets", label: "Pet Friendly" },
];

const AddHotels = ({ hotel = null }) => {
 
  

    

  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false)
  const [isHotelDeleting, setIsHotelDeleting] = useState(false);
  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries();

  useEffect(() => {
    if (hotel) {
      console.log("Hotel data:", hotel);
      console.log("Rooms data:", Array.isArray(hotel?.rooms) ? hotel.rooms : "No rooms available");
        }
  }, [hotel]);

  useEffect(() => {
    if (hotel?.rooms) {
      console.log("Updated Rooms Data:", hotel.rooms);
    } else {
      console.log("Rooms data is missing or empty.");
    }
  }, [hotel?.rooms]);

  const handleImageDelete = (image) => {
    setImageIsDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    axios
      .post("/api/upload/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImageUrl("");
          form.setValue("image", "");
        }
      })
      .finally(() => {
        setImageIsDeleting(false);
      });
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "residine");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dccyx9crp/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Failed to upload image");

    const data = await res.json();
    return data.secure_url;
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: hotel || {
      title: hotel?.title || "",
      description: hotel?.description || "",
      image: hotel?.image || "",
      country: hotel?.country || "",
      state: hotel?.state || "",
      city: hotel?.city || "",
      address: hotel?.address || "",
      amenities: {
        gym: hotel?.amenities?.gym || false,
        pool: hotel?.amenities?.pool || false,
        restaurant: hotel?.amenities?.restaurant || false,
        roomService: hotel?.amenities?.roomService || false,
        spa: hotel?.amenities?.spa || false,
        bar: hotel?.amenities?.bar || false,
        wifi: hotel?.amenities?.wifi || false,
        laundry: hotel?.amenities?.laundry || false,
        parking: hotel?.amenities?.parking || false,
        breakfast: hotel?.amenities?.breakfast || false,
        pets: hotel?.amenities?.pets || false,
      },
    },
    mode: "onChange",
  });

  const watchedValues = form.watch();


  useEffect(() => {
    if (hotel?.image) {
      setImageUrl(hotel.image);
      form.setValue("image", hotel.image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [hotel, form]);

  // Update states when country changes
  useEffect(() => {
    if (watchedValues.country) {
      const countryStates = getCountryStates(watchedValues.country);
      if (countryStates) {
        setStates(countryStates);
      }
    }
  }, [watchedValues.country]);

  // Update cities when country or state changes
  useEffect(() => {
    if (watchedValues.country && watchedValues.state) {
      const stateCities = getStateCities(
        watchedValues.country,
        watchedValues.state
      );
      if (stateCities) {
        setCities(stateCities);
      }
    }
  }, [watchedValues.country, watchedValues.state]);

  // Check if form is complete
  useEffect(() => {
    const basicDetailsComplete =
      watchedValues.title.length >= 3 &&
      watchedValues.description.length >= 10 &&
      watchedValues.image.length >= 1;

    const locationComplete =
      watchedValues.country.length >= 1 &&
      watchedValues.state.length >= 1 &&
      watchedValues.city.length >= 1 &&
      watchedValues.address.length >= 10;

    setIsFormComplete(basicDetailsComplete && locationComplete);
  }, [watchedValues]);

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      if (hotel) {
        await axios.patch(`/api/hotel/${hotel.id}`, values).then((res) => {
          router.push(`/hotel/${res.data.id}`);
        });
      } else {
        const res = await axios.post("/api/hotel", values);
        router.push(`/hotel/${res.data.id}`);
      }
    } catch (err) {
      console.error("Error saving hotel:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteHotel = async (hotel) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hotel?"
    );
    if (!confirmDelete) return;

    setIsHotelDeleting(true);

    const getImageKey = (src) => {
      if (!src) return null;
      const index = src.lastIndexOf("/");
      return index !== -1 ? src.substring(index + 1) : src;
    };

    try {
      const imageKey = hotel.image ? getImageKey(hotel.image) : null;

      if (imageKey) {
        await axios.post("/api/upload/delete", { imageKey });
      }

      await axios.delete(`/api/hotel/${hotel.id}`);

      router.push("/hotel/new");
    } catch (error) {
      console.error("Error deleting hotel:", error.response || error.message);
      alert("An error occurred while deleting the hotel. Please try again.");
    } finally {
      setIsHotelDeleting(false);
    }
  };

  const handleDialougeOpen = ()=>{
    setOpen(prev=>!prev)
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {hotel ? "Edit Hotel" : "Add New Hotel"}
          </CardTitle>
          <CardDescription>
            Enter the details of your property to list it on our platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="details"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="details">Basic Details</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="details" className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hotel Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Eleganza Hotel & Suites"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The name of your property as it will appear to
                            guests.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A luxury hotel with breathtaking views..."
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Detailed description of your property, amenities,
                            and unique features.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {imageUrl && (
                                <div className="relative w-full h-64 rounded-md overflow-hidden">
                                  <Image
                                    src={imageUrl}
                                    alt="Hotel preview"
                                    fill
                                    className="object-cover"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => handleImageDelete(imageUrl)}
                                    disabled={imageIsDeleting}
                                  >
                                    {imageIsDeleting ? "Deleting..." : "Delete"}
                                  </Button>
                                </div>
                              )}

                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  if (!e.target.files[0]) return;

                                  try {
                                    const url = await uploadToCloudinary(
                                      e.target.files[0]
                                    );
                                    setImageUrl(url);
                                    field.onChange(url);
                                  } catch (error) {
                                    console.error("Upload failed:", error);
                                  }
                                }}
                                className="border p-2 w-full rounded-md"
                              />

                              <Input type="hidden" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload a high-quality image of your property.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={true}
                      className="opacity-0"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("location")}
                      className="w-full md:w-auto"
                    >
                      Next: Location
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Country Selection */}
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-base font-medium">
                            Select Country
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-500 mb-2">
                            In which country is your Hotel Located?
                          </FormDescription>
                          <Select
                            disabled={isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Select a Country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-80 overflow-y-auto">
                              {countries.map((country) => (
                                <SelectItem
                                  key={country.isoCode}
                                  value={country.isoCode}
                                >
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />

                    {/* State/Province Selection */}
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-base font-medium">
                            Select State/Province
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-500 mb-2">
                            Select the state or province
                          </FormDescription>
                          <Select
                            disabled={isLoading || states.length === 0}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Select a State" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-80 overflow-y-auto">
                              {states.length > 0 ? (
                                states.map((state) => (
                                  <SelectItem
                                    key={state.isoCode}
                                    value={state.isoCode}
                                  >
                                    {state.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="p-2 text-center text-gray-500">
                                  Select a country first
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />

                    {/* City Selection */}
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-base font-medium">
                            Select City
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-500 mb-2">
                            Select the city for your hotel
                          </FormDescription>
                          <Select
                            disabled={isLoading || cities.length === 0}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Select a City" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-80 overflow-y-auto">
                              {cities.length > 0 ? (
                                cities.map((city) => (
                                  <SelectItem key={city.name} value={city.name}>
                                    {city.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="p-2 text-center text-gray-500">
                                  Select a state first
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />

                    {/* Full Address - Spans full width on both mobile and desktop */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2 w-full">
                          <FormLabel className="text-base font-medium">
                            Full Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Park lane..."
                              {...field}
                              className="w-full h-10"
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-gray-500 mt-1">
                            Complete street address including unit/suite numbers
                          </FormDescription>
                          <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 mt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("details")}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      Back to Details
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("amenities")}
                      className="w-full sm:w-auto order-1 sm:order-2"
                    >
                      Next: Amenities
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-md mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <AlertCircle className="h-4 w-4" />
                      <p>Select all amenities available at your property</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    {amenitiesList.map((amenity) => (
                      <FormField
                        key={amenity.id}
                        control={form.control}
                        name={`amenities.${amenity.id}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                }}
                                id={`checkbox-${amenity.id}`}
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor={`checkbox-${amenity.id}`}
                              className="font-normal cursor-pointer"
                            >
                              {amenity.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("location")}
                    >
                      Back
                    </Button>

                    {isFormComplete && (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto"
                      >
                        {isSubmitting
                          ? "Saving..."
                          : hotel
                          ? "Update Hotel"
                          : "Add Hotel"}
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <Separator className="my-6" />

                {isFormComplete && activeTab !== "amenities" && (
  <>
    {hotel && hotel.rooms && !hotel.rooms.length && (
      <Alert className="bg-indigo-600 text-white my-5 rounded-xl">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Your hotel was created successfully</AlertTitle>
        <AlertDescription>
          If you want to add rooms to your hotel, press the Add Rooms button.
        </AlertDescription>
      </Alert>
    )}

    <div className="flex justify-around items-center space-x-2">
      {hotel && (
        <Button
          onClick={() => handleDeleteHotel(hotel)}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          aria-label="Delete Hotel"
        >
          {isHotelDeleting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Deleting
            </>
          ) : (
            <>
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </>
          )}
        </Button>
      )}
      {hotel && (
        <Button
          onClick={() => router.push(`/hotel-details/${hotel.id}`)}
          type="button"
          variant="outline"
          className="flex items-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          aria-label="View More Details"
        >
          <Eye className="w-4 h-4 mr-2" />
          View More
        </Button>
      )}
      {hotel && (
        <Dialog open={open} onOpenChange={setOpen} >
          <DialogTrigger asChild>
            <Button
              className="py-2 px-4 flex items-center w-30 bg-slate-700 text-white rounded-sm"
              type="button"
              variant="outline"
              aria-label="Add Rooms"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rooms
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a Room</DialogTitle>
              <DialogDescription>
                Add details about your room.
              </DialogDescription>
            </DialogHeader>
            <AddRooms hotel={hotel} handleDialougeOpen={handleDialougeOpen} />
          </DialogContent>
        </Dialog>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className={`flex items-center w-full md:w-auto py-2 px-4 rounded ${
          isSubmitting
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
        aria-label={hotel ? "Update Hotel" : "Add Hotel"}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : hotel ? (
          <>
            <Edit className="w-4 h-4 mr-2" />
            Update Hotel
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Add Hotel
          </>
        )}
      </Button>
    </div>
    {hotel && hotel.rooms && hotel.rooms.length > 0 && (
      <div className="mt-8 space-y-4">
        <Separator/>
        <h3 className="text-xl font-semibold py-2">Hotel Rooms</h3>
        <div className="grid grid-cols-1 gap-4">
          {hotel.rooms.map(room => (
            <RoomCard key={room.id} hotel={hotel} room={room}/>
          ))}
        </div>
      </div>
    )}
  </>
)}

              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddHotels;