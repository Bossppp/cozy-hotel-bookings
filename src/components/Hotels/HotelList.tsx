
import React from "react";
import { Hotel } from "@/types";
import HotelCard from "./HotelCard";
import { Skeleton } from "@/components/ui/skeleton";

interface HotelListProps {
  hotels: Hotel[];
  isLoading: boolean;
}

const HotelList: React.FC<HotelListProps> = ({ hotels, isLoading }) => {
  // Display skeletons while loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-full">
            <Skeleton className="aspect-[4/3] w-full rounded-t-lg" />
            <div className="pt-5 px-5">
              <Skeleton className="h-6 w-2/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-5" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No hotels found
  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-foreground mb-2">No hotels found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria.</p>
      </div>
    );
  }

  // Display hotels
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <HotelCard key={hotel._id} hotel={hotel} />
      ))}
    </div>
  );
};

export default HotelList;
