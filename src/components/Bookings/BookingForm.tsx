
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingFormData } from "@/types";
import { toast } from "sonner";

interface BookingFormProps {
  hotelId: string;
  onSubmit: (data: BookingFormData) => Promise<void>;
  isLoading: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ hotelId, onSubmit, isLoading }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const today = new Date();
  // Maximum date is 3 months from today
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Please select both check-in and check-out dates");
      return;
    }

    if (startDate >= endDate) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 3) {
      toast.error("Maximum booking duration is 3 nights");
      return;
    }

    const bookingData: BookingFormData = {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      hotel: hotelId,
    };

    onSubmit(bookingData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Check-in Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Check-in Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) => date < today || date > maxDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Check-out Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) =>
                  date < (startDate || today) || date > maxDate
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Note: Maximum booking duration is 3 nights
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : "Reserve Now"}
      </Button>
    </form>
  );
};

export default BookingForm;
