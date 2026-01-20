"use client";
import React from "react";

const DescriptionGridSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse">
            {/* Title Skeleton */}
            <div className="h-8 w-44 bg-gray-300 rounded mb-6"></div>

            {/* Paragraph Skeleton */}
            <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-11/12 bg-gray-200 rounded"></div>
                <div className="h-4 w-10/12 bg-gray-200 rounded"></div>
                <div className="h-4 w-9/12 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};

export default DescriptionGridSkeleton;
