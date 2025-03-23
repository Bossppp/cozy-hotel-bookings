
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/Layout/PageLayout";
import BookingCard from "@/components/Bookings/BookingCard";
import LoadingScreen from "@/components/UI/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ApiResponse, Booking } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  // Fetch user bookings
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => api.get<Booking[]>("/bookings"),
    enabled: isAuthenticated,
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => api.delete<{}>(`/bookings/${bookingId}`),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to cancel booking");
      }
    },
    onSettled: () => {
      setCancelBookingId(null);
    },
  });

  // Handle booking cancellation
  const openCancelDialog = (bookingId: string) => {
    setCancelBookingId(bookingId);
  };

  const handleCancelBooking = () => {
    if (cancelBookingId) {
      cancelBookingMutation.mutate(cancelBookingId);
    }
  };

  // Loading state
  if (authLoading || bookingsLoading) {
    return <LoadingScreen />;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            Please log in to view your dashboard.
          </p>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const bookings = bookingsData?.data || [];

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground mt-2">
            Manage your bookings and account details
          </p>
        </div>

        {/* Bookings Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Bookings</h2>
            <Link to="/hotels">
              <Button variant="outline" size="sm">
                Find Hotels
              </Button>
            </Link>
          </div>

          {bookingsError ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                There was an error loading your bookings. Please try again.
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't made any hotel reservations yet.
              </p>
              <Link to="/hotels">
                <Button>Browse Hotels</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={openCancelDialog}
                  isLoading={
                    cancelBookingMutation.isPending &&
                    cancelBookingId === booking._id
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* Cancel Booking Dialog */}
        <AlertDialog
          open={!!cancelBookingId}
          onOpenChange={(open) => !open && setCancelBookingId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelBooking}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Confirm Cancellation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
