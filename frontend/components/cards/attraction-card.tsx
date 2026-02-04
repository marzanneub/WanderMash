import React from "react";

interface TopAttractions {
    _id: string;
    name: string;
    description: string;
    dp: string;
    area: string;
    district: string;
}

const AttractionCard: React.FC<TopAttractions> = (props) => {

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl">
            
            <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/images/${props.dp}`}
                className="w-full object-cover rounded-t-xl h-56"
            />
            <div className="p-6 flex flex-col justify-between h-[150px]">
                <div>
                <h3 className="text-2xl font-semibold mb-2 text-indigo-900 line-clamp-1">{props.name}</h3>
                <p className="text-indigo-600 text-sm mb-2 truncate">{props.area}, {props.district}</p>
                <p className="text-gray-600 truncate line-clamp-3">{props.description}</p>
                </div>
            </div>
        </div>
    )
}

export default AttractionCard;