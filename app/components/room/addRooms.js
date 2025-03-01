'use client';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import axios from 'axios';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Edit, Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  image: z.string().min(1, {
    message: "Image is required.",
  }),
  bedCount: z.coerce.number().int().positive({
    message: "Bed count must be a positive integer.",
  }),
  peopleCount: z.coerce.number().int().positive({
    message: "People count must be a positive integer.",
  }).default(1),
  kingSizeBed: z.boolean().default(false),
  queenSizeBed: z.boolean().default(false),
  singleBed: z.boolean().default(false),
  sofaBed: z.boolean().default(false),
  bathroom: z.boolean().default(false),
  balcony: z.boolean().default(false),
  wifi: z.boolean().default(false),
  minibar: z.boolean().default(false),
  safe: z.boolean().default(false),
});

const AddRooms = ({ hotel, room, handleDialougeOpen }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
    defaultValues: room || {
      title: '',
      description: '',
      price: 0,
      image: '',
      peopleCount: 1,
      bedCount: 1,
      kingSizeBed: false,
      queenSizeBed: false,
      singleBed: false,
      sofaBed: false,
      bathroom: false,
      balcony: false,
      wifi: false,
      minibar: false,
      safe: false,
    },
  });

  useEffect(() => {
    if (room?.image) {
      setImageUrl(room.image);
      form.setValue("image", room.image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [room, form]);

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      console.log('Submitting values:', values);
      
      if (hotel && room) {
        const roomId = room.Id || room.id;
        
        await axios.patch(`/api/room/${roomId}`, { 
          ...values, 
          hotelId: hotel.id || hotel.Id,
          Id: roomId  
        })
        .then((res) => {
          console.log('Room updated successfully:', res.data);
          router.refresh();
          handleDialougeOpen();
        })
        .catch((error) => {
          console.error("Error updating room:", error.response?.data || error.message);
        });
      } else {
        if (!hotel) {
          console.error("Hotel data is missing");
          setIsSubmitting(false);
          return;
        }
        
        try {
          const res = await axios.post("/api/room", { 
            ...values, 
            hotelId: hotel.id || hotel.Id 
          });
          console.log("Room created successfully:", res.data);
          router.refresh();
          handleDialougeOpen();
        } catch (error) {
          console.error("Error creating room:", error.response?.data || error.message);
        }
      }
    } catch (err) {
      console.error("Error saving room:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const amenities = [
    { id: "kingSizeBed", label: "King Size Bed" },
    { id: "queenSizeBed", label: "Queen Size Bed" },
    { id: "singleBed", label: "Single Bed" },
    { id: "sofaBed", label: "Sofa Bed" },
    { id: "bathroom", label: "Bathroom" },
    { id: "balcony", label: "Balcony" },
    { id: "wifi", label: "Wi-Fi" },
    { id: "minibar",  label: "Minibar" },
    { id: "safe", label: "Safe" },
  ];

  return (
    <Card className="w-full max-w-2xl max-h-[500px] overflow-y-auto mx-auto">
      <CardHeader>
        <CardTitle>{room ? "Edit Room" : "Add New Room"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Deluxe King Room" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the room type
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
                        placeholder="A luxurious room with mountain view..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed description of the room
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night (in INR)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="peopleCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of People</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bedCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Beds</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                              alt="Room preview"
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
                      Upload a high-quality image of the room.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-medium mb-2">Room Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((amenity) => (
                    <FormField
                      key={amenity.id}
                      control={form.control}
                      name={amenity.id}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              {amenity.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
                className="flex items-center w-full md:w-auto"
                aria-label={room ? "Update Room" : "Add Room"}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : room ? (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Room
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Room
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddRooms;