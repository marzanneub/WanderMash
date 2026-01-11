"use client";
import React, {useState, useEffect} from "react";

interface TimeSlot {
    open: string;
    close: string;
}

interface OpeningHours {
    saturday: TimeSlot;
    sunday: TimeSlot;
    monday: TimeSlot;
    tuesday: TimeSlot;
    wednesday: TimeSlot;
    thursday: TimeSlot;
    friday: TimeSlot;
}


const to12HourFormat = (timeStr: string | undefined): string => {
    if (!timeStr || timeStr.trim() === "") {
        return "--:-- --";
    }
    
    const [hourStr, minute] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour ? hour : 12;

    const displayHour = hour < 10 ? `0${hour}` : hour;
        
    return `${displayHour}:${minute} ${ampm}`;
};

const TimeTable: React.FC<OpeningHours> = (props) => {
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-6 border-b-2 border-indigo-300 pb-2 text-indigo-900">Opening Hours</h3>
            <table className="w-full text-left text-indigo-900 border border-gray-300 rounded-lg shadow-sm">
                <tbody>
                    <tr className="bg-indigo-50/50">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100">Day</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 text-center">Opening Time</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 text-center">Closing Time</th>
                </tr>
                {days.map((day) => {
                    const dayKey = day.toLowerCase() as keyof OpeningHours;

                    return (
                        <tr className="hover:bg-indigo-50/30 transition-colors group" key={day}>
                            <td className="px-6 py-4 text-sm font-semibold text-indigo-900">{day}</td>
                            <td className="px-6 py-4 text-sm text-center">
                                {/* <input type="time" value={user.openingHours[dayKey].open} disabled/> */}
                                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md font-mono text-xs border border-indigo-100">
                                    {to12HourFormat(props[dayKey].open)}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-center">
                                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md font-mono text-xs border border-indigo-100">
                                    {to12HourFormat(props[dayKey].close)}
                                </span>
                            </td>
                        </tr>
                    );
                                            
                })}
                </tbody>
            </table>
        </div>
    )
}

export default TimeTable;