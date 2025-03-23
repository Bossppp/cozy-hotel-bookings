
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/Layout/PageLayout";
import SearchInput from "@/components/UI/SearchInput";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/hotels?search=${encodeURIComponent(query)}`);
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-background -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Find Your Perfect Stay with Ease
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Discover and book the ideal hotel for your trip. Simple, fast, and hassle-free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/hotels">
                  <Button size="lg" className="group">
                    Browse Hotels
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-16 animate-fade-in animation-delay-300">
              <div className="relative">
                <div className="w-full aspect-[4/3] bg-gradient-to-tr from-blue-100 to-white rounded-xl shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <SearchInput onSearch={handleSearch} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose StayEase</h2>
          <p className="text-muted-foreground">
            Enjoy a seamless booking experience with features designed for your convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Easy Booking Process",
              description: "Book your stay in minutes with our streamlined process.",
              icon: "🔄",
              delay: 1,
            },
            {
              title: "Wide Hotel Selection",
              description: "Browse through our extensive collection of quality hotels.",
              icon: "🏨",
              delay: 2,
            },
            {
              title: "Secure Reservations",
              description: "Your booking details and personal information are always protected.",
              icon: "🔒",
              delay: 3,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`bg-white glass-card rounded-xl p-6 hover-lift animate-slide-up animation-delay-${feature.delay}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50">
        <div className="section-container">
          <div className="bg-white glass-card rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Book Your Next Stay?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who have found their perfect accommodations through StayEase.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/hotels">
                <Button size="lg">Find Hotels</Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HomePage;
