
import React from "react";
import { Link } from "react-router-dom";
import { Hotel } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  // Helper to format address
  const formatAddress = (address: Hotel["address"]) => {
    return `${address.building_number} ${address.street}, ${address.district}, ${address.province}, ${address.postalcode}`;
  };

  return (
    <Card className="h-full overflow-hidden hover-lift group bg-card/80 backdrop-blur-sm">
      <CardContent className="p-0">
        {/* Hotel Image */}
        <div className="aspect-[4/3] bg-muted overflow-hidden relative">
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <span className="text-4xl font-medium text-primary/30">
              {hotel.name.charAt(0)}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Hotel Info */}
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>
          
          <div className="flex items-start space-x-2 text-sm text-muted-foreground mb-2">
            <MapPin size={16} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{formatAddress(hotel.address)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone size={16} className="shrink-0" />
            <span>{hotel.tel}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Link to={`/hotels/${hotel._id}`} className="w-full">
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default HotelCard;
