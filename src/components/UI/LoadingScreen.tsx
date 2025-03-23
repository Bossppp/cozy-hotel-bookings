
import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 relative">
          <div className="absolute h-12 w-12 rounded-full border-4 border-r-primary/30 border-t-primary/30 border-l-primary border-b-primary animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
