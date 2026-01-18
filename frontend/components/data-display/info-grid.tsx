import React from "react";

interface InfoItem {
    label: string;
    value: string | number | boolean | undefined;
}

interface InfoGridProps {
    title: string;
    items: InfoItem[];
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

const InfoGrid: React.FC<InfoGridProps> = ({ title, items }) => {
    return (
        <div>
            <h3 className="text-2xl font-semibold mb-6 border-b-2 border-indigo-300 pb-2 text-indigo-900">
                {title}
            </h3>
            {items.map((item, index) => (

                <div 
                    key={index} 
                    className="mb-2"
                >
                <span className="font-semibold">{item.label}: </span>
                {/* {item.value || <span className="text-slate-400 italic">Not provided</span>} */}
                {((item.label === "CheckIn" || item.label === "CheckOut") && typeof item.value === "string") && (
                    to12HourFormat(item.value) || <span className="text-slate-400 italic">Not provided</span>
                )}

                {(!(item.label === "CheckIn" || item.label === "CheckOut") && typeof item.value === "string") && (
                    item.value || <span className="text-slate-400 italic">Not provided</span>
                )}
                {(typeof item.value === "number") && (
                    item.value || <span className="text-slate-400 italic">Not provided</span>
                )}
                {(typeof item.value === "boolean") && ((item.value===true && (<span className="text-green-600 font-bold">Yes</span>)) || (item.value===false && (<span className="text-red-600 font-bold">No</span>)))}
                </div>
            ))}
        </div>
    );
};

export default InfoGrid;