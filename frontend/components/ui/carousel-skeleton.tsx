"use client";
import React from "react";

const CarouselSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-56 sm:h-90 xl:h-100 2xl:h-120 overflow-hidden rounded-2xl shadow-lg bg-gray-200 animate-pulse">
      
      {/* Image placeholder */}
      <div className="absolute inset-0 bg-gray-300" />

      {/* Left Arrow */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <div className="w-10 h-10 rounded-full bg-gray-400" />
      </div>

      {/* Right Arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
        <div className="w-10 h-10 rounded-full bg-gray-400" />
      </div>
    </div>
  );
};

export default CarouselSkeleton;
