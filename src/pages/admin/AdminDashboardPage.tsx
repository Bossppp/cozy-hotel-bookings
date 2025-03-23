
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/Layout/PageLayout";
import LoadingScreen from "@/components/UI/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ApiResponse, Hotel, Booking } from "@/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const AdminDashboardPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteHotelId, setDeleteHotelId] = useState<string | null>(null);

  // Fetch hotels
  const {
    data: hotelsData,
    isLoading: hotelsLoading,
  } = useQuery({
    queryKey: ["admin-hotels"],
    queryFn: () => api.get<Hotel[]>("/hotels"),
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Fetch all bookings (admin view)
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
  } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => api.get<Booking[]>("/bookings"),
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Delete hotel mutation
  const deleteHotelMutation = useMutation({
    mutationFn: (hotelId: string) => api.delete<{}>(`/hotels/${hotelId}`),
    onSuccess: () => {
      toast.success("Hotel deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-hotels"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete hotel");
      }
    },
    onSettled: () => {
      setDeleteHotelId(null);
    },
  });

  // Handle hotel deletion
  const openDeleteDialog = (hotelId: string) => {
    setDeleteHotelId(hotelId);
  };

  const handleDeleteHotel = () => {
    if (deleteHotelId) {
      deleteHotelMutation.mutate(deleteHotelId);
    }
  };

  // Loading state
  if (authLoading || hotelsLoading || bookingsLoading) {
    return <LoadingScreen />;
  }

  // Check if user is authenticated and is admin
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            You don't have permission to access the admin dashboard.
          </p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const hotels = hotelsData?.data || [];
  const bookings = bookingsData?.data || [];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage hotels and bookings
            </p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/admin/hotels/new">Add New Hotel</Link>
          </Button>
        </div>

        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Hotels</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{hotels.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{bookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Last booking: {bookings.length > 0 ? formatDate(bookings[0].createdAt) : "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="hotels">
          <TabsList className="mb-6">
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          {/* Hotels Tab */}
          <TabsContent value="hotels">
            <Card>
              <CardHeader>
                <CardTitle>Manage Hotels</CardTitle>
                <CardDescription>
                  View, edit or delete hotels in your system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hotels.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No hotels found</p>
                    <Button asChild>
                      <Link to="/admin/hotels/new">Add Hotel</Link>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hotels.map((hotel) => (
                        <TableRow key={hotel._id}>
                          <TableCell className="font-medium">
                            {hotel.name}
                          </TableCell>
                          <TableCell>
                            {`${hotel.address.district}, ${hotel.address.province}`}
                          </TableCell>
                          <TableCell>{hotel.tel}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/admin/hotels/${hotel._id}`)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteDialog(hotel._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>
                  View all bookings in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No bookings found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hotel</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking._id}>
                          <TableCell className="font-medium">
                            {typeof booking.hotel === "object"
                              ? booking.hotel.name
                              : "Unknown Hotel"}
                          </TableCell>
                          <TableCell>
                            {typeof booking.user === "object"
                              ? booking.user.name
                              : "Unknown User"}
                          </TableCell>
                          <TableCell>{formatDate(booking.start_date)}</TableCell>
                          <TableCell>{formatDate(booking.end_date)}</TableCell>
                          <TableCell>{formatDate(booking.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Hotel Dialog */}
        <AlertDialog
          open={!!deleteHotelId}
          onOpenChange={(open) => !open && setDeleteHotelId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Hotel</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this hotel? This action cannot
                be undone, and all associated bookings will be affected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteHotel}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
};

export default AdminDashboardPage;
