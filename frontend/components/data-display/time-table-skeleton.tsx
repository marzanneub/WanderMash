"use client";
import React from "react";

const TimeTableSkeleton: React.FC = () => {
    const days = 7;

    return (
        <div className="animate-pulse">
            {/* Title Skeleton */}
            <div className="h-8 w-56 bg-indigo-200/60 rounded mb-6"></div>

            {/* Table Skeleton */}
            <div className="w-full border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <tbody>
                        {/* Header */}
                        <tr className="bg-indigo-50/50">
                            <td className="px-6 py-4 border-b border-indigo-100">
                                <div className="h-3 w-16 bg-indigo-300/60 rounded"></div>
                            </td>
                            <td className="px-6 py-4 border-b border-indigo-100 text-center">
                                <div className="h-3 w-24 bg-indigo-300/60 rounded mx-auto"></div>
                            </td>
                            <td className="px-6 py-4 border-b border-indigo-100 text-center">
                                <div className="h-3 w-24 bg-indigo-300/60 rounded mx-auto"></div>
                            </td>
                        </tr>

                        {/* Rows */}
                        {Array.from({ length: days }).map((_, index) => (
                            <tr key={index} className="border-b last:border-b-0">
                                <td className="px-6 py-4">
                                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-block h-6 w-20 bg-indigo-200/60 rounded-md"></div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-block h-6 w-20 bg-indigo-200/60 rounded-md"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TimeTableSkeleton;
