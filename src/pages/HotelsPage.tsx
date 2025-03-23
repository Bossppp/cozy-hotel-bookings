
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageLayout from "@/components/Layout/PageLayout";
import HotelList from "@/components/Hotels/HotelList";
import SearchInput from "@/components/UI/SearchInput";
import { useHotels } from "@/hooks/useHotels";

const HotelsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get("search") || "";
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  
  // Use the useHotels hook instead of direct API call
  const { hotels, isLoading, refetch } = useHotels();

  // Filter hotels based on search term
  const filteredHotels = hotels.filter((hotel) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      hotel.name.toLowerCase().includes(searchLower) ||
      hotel.address.district.toLowerCase().includes(searchLower) ||
      hotel.address.province.toLowerCase().includes(searchLower)
    );
  });

  // Update search term when the URL changes
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setSearchTerm(searchFromUrl);
  }, [location.search]);

  // Handle search form submission
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    // Update URL with search query
    const newSearchParams = new URLSearchParams(location.search);
    if (query) {
      newSearchParams.set("search", query);
    } else {
      newSearchParams.delete("search");
    }
    window.history.pushState(
      {},
      "",
      `${location.pathname}?${newSearchParams.toString()}`
    );
  };

  return (
    <PageLayout>
      {/* Search Header */}
      <section className="relative bg-gradient-to-b from-blue-50 to-transparent py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-8">Find Your Perfect Hotel</h1>
          <div className="max-w-2xl mx-auto">
            <SearchInput 
              onSearch={handleSearch} 
              placeholder="Search by hotel name, district, or province..."
            />
          </div>
        </div>
      </section>

      {/* Hotels List */}
      <section className="section-container">
        {searchTerm && (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-1">
              {filteredHotels?.length 
                ? `Search results for "${searchTerm}"`
                : `No results found for "${searchTerm}"`
              }
            </h2>
            <button 
              onClick={() => handleSearch("")}
              className="text-primary text-sm hover:underline focus:outline-none"
            >
              Clear search
            </button>
          </div>
        )}

        <HotelList 
          hotels={filteredHotels || []} 
          isLoading={isLoading} 
        />
      </section>
    </PageLayout>
  );
};

export default HotelsPage;
