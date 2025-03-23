
import React from "react";
import { format } from "date-fns";
import { Booking, Hotel } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  isLoading?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel, isLoading = false }) => {
  // Format dates
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Get hotel from booking
  const hotel = booking.hotel as Hotel;

  // Calculate duration
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? "night" : "nights"}`;
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(booking._id);
    }
  };

  return (
    <Card className="overflow-hidden hover-lift shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Hotel Image/Placeholder */}
          <div className="w-full md:w-1/4 aspect-video md:aspect-square bg-blue-50 rounded-md flex items-center justify-center">
            <span className="text-3xl font-medium text-primary/30">
              {hotel.name.charAt(0)}
            </span>
          </div>

          <div className="w-full md:w-3/4 space-y-3">
            <div>
              <h3 className="text-lg font-semibold mb-1">{hotel.name}</h3>
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span className="line-clamp-1">
                  {`${hotel.address.building_number} ${hotel.address.street}, ${hotel.address.district}`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="flex items-start gap-2">
                <Calendar size={16} className="mt-0.5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Check-in</p>
                  <p className="text-sm font-medium">{formatDate(booking.start_date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar size={16} className="mt-0.5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Check-out</p>
                  <p className="text-sm font-medium">{formatDate(booking.end_date)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Badge variant="outline" className="text-xs">
                {calculateDuration(booking.start_date, booking.end_date)}
              </Badge>
              <div className="text-xs text-muted-foreground">
                Booked on {formatDate(booking.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {onCancel && (
        <CardFooter className="p-5 pt-0">
          <Button 
            variant="destructive" 
            className="w-full" 
            size="sm" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            {isLoading ? "Canceling..." : "Cancel Reservation"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BookingCard;
