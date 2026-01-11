import { ITopAttractions } from "@/types/attraction";
import React from "react";

const HomepageCards: React.FC<ITopAttractions> = (props) => {

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl">
            
                <img
                    src={`http://localhost:4000/images/${props.dp}`}
                    className="w-full object-cover rounded-t-xl h-56"
                />
                <div className="p-6 flex flex-col justify-between h-[150px]">
                    <div>
                    <h3 className="text-2xl font-semibold mb-2 text-indigo-900 line-clamp-1">{props.name}</h3>
                    <p className="text-indigo-600 text-sm mb-2 truncate">{props.upazila}, {props.district}</p>
                    <p className="text-gray-600 truncate line-clamp-3">{props.description}</p>
                    </div>
                </div>


            {/* <article className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-2 hover:shadow-lg transition duration-300">
            <img src={`http://localhost:4002/images/tourismManager/${props.dp}`} />
            <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-indigo-900">{props.name}</h3>
                <p className="text-gray-600">{props.description}</p>
            </div>
            </article> */}
        </div>
    )
}

export default HomepageCards;