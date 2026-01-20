"use client";
import React from "react";

interface SocialLinksGridSkeletonProps {
    rows?: number;
}

const SocialLinksGridSkeleton: React.FC<SocialLinksGridSkeletonProps> = ({
    rows = 3,
}) => {
    return (
        <div className="animate-pulse">
            {/* Title Skeleton */}
            <div className="h-8 w-48 bg-gray-300 rounded mb-6"></div>

            {/* Social Links Skeleton */}
            <ul className="space-y-3">
                {Array.from({ length: rows }).map((_, index) => (
                    <li key={index} className="flex items-center gap-2">
                        {/* Icon */}
                        <div className="w-5 h-5 bg-gray-300 rounded"></div>

                        {/* Text */}
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SocialLinksGridSkeleton;
