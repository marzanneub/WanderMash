"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
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
import ServicesGrid from "@/components/data-display/services-grid";
import ServicesGridSkeleton from "@/components/data-display/services-grid-skeleton";
import CuisinesGrid from "@/components/data-display/cuisines-grid";
import CuisinesGridSkeleton from "@/components/data-display/cuisines-grid-skeleton";
import FoodCardSwiperSkeleton from "@/components/ui/food-card-swiper-skeleton";
import FoodCardSwiper from "@/components/ui/food-card-swiper";
import MapViewSkeleton from "@/components/maps/map-view-skeleton";
import MapView from "@/components/maps/map-view";


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


interface MenuItems {
    _id: string;
    name: string;
    price: string;
    description: string;
    category: string;
    image: string;
    isAvailable: boolean;
}

interface Restaurant {
    name: string;
    logo: string;
    images: string[];
    email: string;
    registrationId: string;
    phone: string;
    approved: boolean;
    address: string;
    district: string;
    upazila: string;
    postalCode: number;
    description: string;
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
    };
    facilities?: string[];
    cuisines?: string[];
    openingHours: OpeningHours;
    location: Location;
    menuItems: MenuItems[];
}

const RestaurantPreviewPage: React.FC = () => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
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
        fetch(`/api/get-restaurant-info?id=${id}`) 
            .then(res => res.json())
            .then(data => {
                setRestaurant(data.restaurant);
                setLoading(false);
            }
        );
    }, []);

/////////////////////////////////////////////
    const contactInformation = [
        { label: "Email", value: restaurant?.email },
        { label: "Phone Number", value: restaurant?.phone },
    ];

    const location = [
        { label: "Address", value: restaurant?.address },
        { label: "District", value: restaurant?.district },
        { label: "Upazila", value: restaurant?.upazila },
        { label: "Postal Code", value: restaurant?.postalCode },
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
                                <FoodCardSwiperSkeleton />
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
            {restaurant!==null && (
                <div>
                    <h1 className="text-4xl font-bold text-indigo-900 mb-10">{restaurant.name}</h1>
                    <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col md:flex-row gap-14">
                        <div className="md:w-2/2 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
                                <Carousel items={restaurant.images || []} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
                                <DescriptionGrid description={restaurant.description} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <CuisinesGrid title="Cuisines" items={restaurant.cuisines || []} />
                                <ServicesGrid title="Facilities & Services" items={restaurant.facilities || []} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <SocialLinksGrid {...restaurant.socialLinks}/>
                                <InfoGrid title="Contact Information" items={contactInformation} />
                                <InfoGrid title="Location" items={location} />
                            </div>
                            <div>
                                <FoodCardSwiper title="Food Menu" items={restaurant.menuItems || []}/>
                            </div>
                            {(restaurant.location.latitude && restaurant.location.longitude) && (
                                <MapView 
                                    latitude={restaurant.location.latitude} 
                                    longitude={restaurant.location.longitude} 
                                />
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <TimeTable {...restaurant.openingHours} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </main>
        </div>
    )
}

export default RestaurantPreviewPage;