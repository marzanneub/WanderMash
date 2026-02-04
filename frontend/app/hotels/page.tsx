"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import { districtAreas } from "@/data/locations/districtAreas";
import AttractionCard from "@/components/cards/attraction-card";
import AttractionCardSkeleton from "@/components/cards/attraction-card-skeleton";

interface Hotel {
    _id: string;
    name: string;
    description: string;
    dp: string;
    area: string;
    district: string;
}


const Hotels: React.FC = () => {
    const [items, setItems] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/get-hotels`
                );

                const data = await res.json();
                // console.log(data);
                setItems(data.items);
            } catch (err) {
                console.error("Fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

//////////////for filter//////////////
    const [district, setDistrict] = useState("");
    const [area, setArea] = useState("");

    const districts = Object.keys(districtAreas);

//////////////////////////////////////

    return (
        <div className="container mx-auto px-6 py-20">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Select District</label>
                    <select
                    id="district"
                    name="district"
                    onChange={(e) => {
                        setDistrict(e.target.value);
                        setArea("");
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">-- all --</option>
                        {districts.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Select Area</label>
                    <select
                    id="area"
                    name="area"
                    onChange={(e) => setArea(e.target.value)}
                    disabled={!district}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">
                            -- all --
                        </option>

                        {district &&
                            districtAreas[district]?.map((u) => (
                            <option key={u} value={u}>
                                {u}
                            </option>
                        ))}

                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">


                {
                    loading? Array.from({ length: 12 }).map((_, i) => (
                        <AttractionCardSkeleton key={i}/>
                    )) : (items
                        .filter((item) => !district.length || item.district === district)
                        .filter((item) => !area.length || item.area === area)
                        .map((item) => (
                            <Link href={`/hotels/preview?id=${item._id}`} key={item._id}>
                                <AttractionCard
                                    _id={item._id}
                                    name={item.name}
                                    description={item.description}
                                    dp={item.dp}
                                    area={item.area}
                                    district={item.district}
                                />
                            </Link>
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default Hotels;