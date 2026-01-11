"use client";

import React from "react";

export default function MapViewSkeleton() {
  return (
    <div className="mx-auto my-5 font-sans">

      <div className="h-8 w-52 bg-indigo-200/60 rounded mb-6 border-b-2 border-transparent"></div>
      <div className="animate-pulse">
        {/* Map container skeleton */}
        <div className="h-[450px] w-full rounded-lg bg-gray-200 border border-gray-300 shadow-inner"></div>
      </div>
    </div>
  );
}
