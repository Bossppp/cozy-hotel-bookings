
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/Layout/PageLayout";
import LoadingScreen from "@/components/UI/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Hotel, ApiResponse, Address } from "@/types";
import { ArrowLeft } from "lucide-react";

interface HotelFormData {
  name: string;
  address: {
    building_number: string;
    street: string;
    district: string;
    province: string;
    postalcode: string;
  };
  tel: string;
}

const EditHotelPage = () => {
  const { id } = useParams<{ id: string }>();
  const isNewHotel = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data state
  const [formData, setFormData] = useState<HotelFormData>({
    name: "",
    address: {
      building_number: "",
      street: "",
      district: "",
      province: "",
      postalcode: "",
    },
    tel: "",
  });

  // Fetch hotel details if editing existing hotel
  const {
    data: hotelData,
    isLoading: hotelLoading,
    error: hotelError,
  } = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => api.get<Hotel>(`/hotels/${id}`),
    enabled: isAuthenticated && !isNewHotel && !!id,
  });

  // Mutations for create/update hotel
  const createHotelMutation = useMutation({
    mutationFn: (data: HotelFormData) => api.post<Hotel>("/hotels", data),
    onSuccess: () => {
      toast.success("Hotel created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-hotels"] });
      navigate("/admin");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create hotel");
      }
      setIsSubmitting(false);
    },
  });

  const updateHotelMutation = useMutation({
    mutationFn: (data: HotelFormData) => api.put<Hotel>(`/hotels/${id}`, data),
    onSuccess: () => {
      toast.success("Hotel updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotel", id] });
      navigate("/admin");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update hotel");
      }
      setIsSubmitting(false);
    },
  });

  // Set form data when hotel data is loaded
  useEffect(() => {
    if (hotelData && !isNewHotel) {
      const hotel = hotelData.data;
      setFormData({
        name: hotel.name,
        address: {
          building_number: hotel.address.building_number,
          street: hotel.address.street,
          district: hotel.address.district,
          province: hotel.address.province,
          postalcode: hotel.address.postalcode,
        },
        tel: hotel.tel,
      });
    }
  }, [hotelData, isNewHotel]);

  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field?: keyof Address
  ) => {
    const { name, value } = e.target;

    if (field) {
      // Update nested address field
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [field]: value,
        },
      });
    } else {
      // Update top-level field
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate postal code
    if (formData.address.postalcode.length !== 5) {
      toast.error("Postal code must be exactly 5 characters");
      setIsSubmitting(false);
      return;
    }

    // Validate telephone number
    if (formData.tel.length < 10 || formData.tel.length > 12) {
      toast.error("Telephone number must be between 10-12 digits");
      setIsSubmitting(false);
      return;
    }

    if (isNewHotel) {
      createHotelMutation.mutate(formData);
    } else {
      updateHotelMutation.mutate(formData);
    }
  };

  // Loading state
  if (authLoading || (!isNewHotel && hotelLoading)) {
    return <LoadingScreen />;
  }

  // Check if user is authenticated and is admin
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            You don't have permission to access this page.
          </p>
          <Button asChild>
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Error state when editing existing hotel
  if (!isNewHotel && hotelError) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Hotel Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The hotel you're trying to edit doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/admin">Back to Admin Dashboard</a>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Admin Dashboard
          </button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isNewHotel ? "Add New Hotel" : "Edit Hotel"}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Hotel Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Hotel Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="building_number">Building Number</Label>
                  <Input
                    id="building_number"
                    value={formData.address.building_number}
                    onChange={(e) => handleChange(e, "building_number")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => handleChange(e, "street")}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.address.district}
                    onChange={(e) => handleChange(e, "district")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    value={formData.address.province}
                    onChange={(e) => handleChange(e, "province")}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalcode">Postal Code</Label>
                  <Input
                    id="postalcode"
                    value={formData.address.postalcode}
                    onChange={(e) => handleChange(e, "postalcode")}
                    maxLength={5}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Postal code must be exactly 5 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tel">Telephone</Label>
                  <Input
                    id="tel"
                    name="tel"
                    value={formData.tel}
                    onChange={handleChange}
                    maxLength={12}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: 10-12 digits with no spaces or special characters
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isNewHotel
                    ? "Creating..."
                    : "Updating..."
                  : isNewHotel
                  ? "Create Hotel"
                  : "Update Hotel"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
};

export default EditHotelPage;
