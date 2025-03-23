
import React from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/Layout/PageLayout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </PageLayout>
  );
};

export default NotFound;
