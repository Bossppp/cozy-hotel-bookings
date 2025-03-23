import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PageLayout from "@/components/Layout/PageLayout";
import BookingForm from "@/components/Bookings/BookingForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, ArrowLeft, Calendar, Users } from "lucide-react";
import { api } from "@/utils/api";
import { Booking, BookingFormData } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useHotel } from "@/hooks/useHotel";
import { useMockData } from "@/utils/useMockData";
import { useBookings } from "@/hooks/useBookings";

const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { isMockEnabled, mockApi } = useMockData();
  
  // Use the useHotel hook instead of direct API call
  const { hotel, isLoading, error } = useHotel(id);
  
  // Use the useBookings hook for booking operations
  const { createBooking, isCreating } = useBookings();

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a hotel");
      navigate("/login", { state: { from: `/hotels/${id}` } });
      return;
    }

    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (data: BookingFormData) => {
    createBooking(data, {
      onSuccess: () => {
        toast.success("Booking created successfully!");
        setShowBookingForm(false);
        navigate("/dashboard");
      }
    });
  };

  // Display loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-6 w-full max-w-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="aspect-video w-full rounded-lg mb-6" />
              <Skeleton className="h-6 w-full mb-3" />
              <Skeleton className="h-6 w-5/6 mb-3" />
              <Skeleton className="h-6 w-4/6" />
            </div>
            <div>
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Display error state
  if (error || !hotel) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Hotel Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The hotel you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/hotels">
            <Button>Back to Hotels</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/hotels"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Hotels
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hotel Details */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{hotel.name}</h1>

            {/* Hotel Placeholder Image */}
            <div className="aspect-video bg-gradient-to-tr from-blue-100 to-white rounded-lg mb-8 flex items-center justify-center relative overflow-hidden">
              <span className="text-6xl font-medium text-primary/20">{hotel.name.charAt(0)}</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Address</div>
                  <p className="text-muted-foreground">
                    {`${hotel.address.building_number} ${hotel.address.street}, ${hotel.address.district}, ${hotel.address.province}, ${hotel.address.postalcode}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Contact</div>
                  <p className="text-muted-foreground">{hotel.tel}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold">About this hotel</h2>
              <p className="text-muted-foreground">
                Experience exceptional service at {hotel.name}. Conveniently located in {hotel.address.district}, our hotel 
                offers a comfortable stay with modern amenities for both business and leisure travelers.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                {/* Mock Amenities */}
                {[
                  { icon: Users, label: "Spacious Rooms" },
                  { icon: Calendar, label: "24/7 Service" }
                ].map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <amenity.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div>
            <div className="glass-card rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                {showBookingForm ? "Make a Reservation" : "Ready to Book?"}
              </h3>

              {showBookingForm ? (
                <BookingForm
                  hotelId={hotel._id}
                  onSubmit={handleBookingSubmit}
                  isLoading={isCreating}
                />
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">
                    Reserve your stay with us for up to 3 nights. Fast, secure, and hassle-free booking.
                  </p>
                  <Button onClick={handleBookNow} className="w-full">
                    Book Now
                  </Button>
                </>
              )}

              {showBookingForm && (
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HotelDetailPage;
