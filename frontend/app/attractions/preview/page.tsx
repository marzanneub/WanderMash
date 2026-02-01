"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { TbChevronLeft } from "react-icons/tb";
import CarouselSkeleton from "@/components/ui/carousel-skeleton";
import Carousel from "@/components/ui/carousel";
import TimeTable from "@/components/data-display/time-table";
import TimeTableSkeleton from "@/components/data-display/time-table-skeleton";
import InfoGrid from "@/components/data-display/info-grid";
import InfoGridSkeleton from "@/components/data-display/info-grid-skeleton";
import DescriptionGrid from "@/components/data-display/description-grid";
import DescriptionGridSkeleton from "@/components/data-display/description-grid-skeleton";
import SocialLinksGrid from "@/components/data-display/social-links-grid";
import SocialLinksGridSkeleton from "@/components/data-display/social-links-grid-skeleton";
import ServicesGrid from "@/components/data-display/attraction-services-grid";
import ServicesGridSkeleton from "@/components/data-display/services-grid-skeleton";
import CuisinesGrid from "@/components/data-display/cuisines-grid";
import CuisinesGridSkeleton from "@/components/data-display/cuisines-grid-skeleton";
import FoodCardSwiperSkeleton from "@/components/ui/food-card-swiper-skeleton";
import FoodCardSwiper from "@/components/ui/food-card-swiper";
import MapViewSkeleton from "@/components/maps/map-view-skeleton";
import MapView from "@/components/maps/map-view";

interface SocialLinks {
    facebook: string;
    instagram: string;
    twitter: string;
}


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

interface Location {
    latitude: number|null;
    longitude: number|null;
}

interface Attraction {
    name: string;
    images: string[];
    email?: string;
    phone?: string;
    category?: string;
    description: string;
    district: string;
    area: string;
    address: string;
    location: Location;
    socialLinks?: SocialLinks;
    views?: string[];
    facilities?: string[];
    openingHours: OpeningHours;
    approved: boolean;
}

const AttractionPreviewPage: React.FC = () => {
    const router = useRouter();
    const [attraction, setAttraction] = useState<Attraction | null>(null);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const id  = searchParams.get("id");
    const warnmessage  = searchParams.get("warnmessage");
    const successmessage  = searchParams.get("successmessage");

    useEffect(() => {
        toast.warn(warnmessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",            
        });
        toast.success(successmessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        fetch(`/api/get-attraction-info?id=${id}`) 
            .then(res => res.json())
            .then(data => {
                setAttraction(data.attraction);
                setLoading(false);
            }
        );
    }, []);


/////////////////////////////////////////////
    const contactInformation = [
        { label: "Email", value: attraction?.email },
        { label: "Phone Number", value: attraction?.phone },
    ];

    const location = [
        { label: "Address", value: attraction?.address },
        { label: "District", value: attraction?.district },
        { label: "Area", value: attraction?.area },
    ];
/////////////////////////////////////////////

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <main className="container mx-auto px-10 py-16 max-w-7xl">
            {loading && (
                <div>
                    <div className="h-10 w-72 bg-gray-200 rounded-md mb-10 animate-pulse" />
                    <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col md:flex-row gap-14">
                        <div className="md:w-2/2 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
                                <CarouselSkeleton />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
                                <DescriptionGridSkeleton />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <CuisinesGridSkeleton />
                                <ServicesGridSkeleton />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <SocialLinksGridSkeleton />
                                <InfoGridSkeleton />
                                <InfoGridSkeleton />
                            </div>
                            <div>
                                <MapViewSkeleton />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <TimeTableSkeleton />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {attraction!==null && (
                <div>
                    <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => router.back()}
                        className="p-2 bg-white rounded-full shadow-sm text-gray-300 hover:bg-gray-100 hover:text-black transition flex-shrink-0 cursor-pointer">
                        <TbChevronLeft size={24} />
                    </button>
                    <h1 className="text-4xl font-bold text-indigo-900">{attraction.name}</h1>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col md:flex-row gap-14">
                        <div className="md:w-2/2 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
                                {attraction.images.length>0 && (<Carousel items={attraction.images} />)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
                                <DescriptionGrid description={attraction.description} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <CuisinesGrid title="Views" items={attraction.views || []} />
                                <ServicesGrid title="Facilities & Services" items={attraction.facilities || []} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <SocialLinksGrid {...attraction.socialLinks}/>
                                <InfoGrid title="Contact Information" items={contactInformation} />
                                <InfoGrid title="Location" items={location} />
                            </div>
                            {(attraction.location.latitude && attraction.location.longitude) && (
                                <MapView 
                                    latitude={attraction.location.latitude} 
                                    longitude={attraction.location.longitude} 
                                />
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <TimeTable {...attraction.openingHours} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </main>
        </div>
    )

}

export default AttractionPreviewPage;