"use client";
import React, {useEffect, useState} from "react";
import HomepageCards from "../cards/homepage-cards";
import HomepageCardsSkeleton from "../cards/homepage-cards-skeleton";

interface Hotel {
    _id: string;
    name: string;
    description: string;
    dp: string;
    upazila: string;
    district: string;
}

const PopularHotels: React.FC = () => {
    const [items, setItems] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/popular-hotels`
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

    return (
        <div className="container mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold text-center mb-14 tracking-tight text-indigo-900">Popular Hotels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                {
                    loading? Array.from({ length: 4 }).map((_, i) => (
                        <HomepageCardsSkeleton key={i}/>
                    )) : (
                        items.map((item) => (
                            <a href={`/hotels/preview?id=${item._id}`} key={item._id}>
                                <HomepageCards
                                    _id={item._id}
                                    name={item.name}
                                    description={item.description}
                                    dp={item.dp}
                                    upazila={item.upazila}
                                    district={item.district}
                                />
                            </a>
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default PopularHotels;