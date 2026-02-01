"use client";
import React, {useState, useEffect} from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import SidebarHotel from "@/components/navigation/sidebarHotel";
import InfoGrid from "@/components/data-display/info-grid";
import InfoGridSkeleton from "@/components/data-display/info-grid-skeleton";
import DescriptionGrid from "@/components/data-display/description-grid";
import DescriptionGridSkeleton from "@/components/data-display/description-grid-skeleton";
import SocialLinksGrid from "@/components/data-display/social-links-grid";
import SocialLinksGridSkeleton from "@/components/data-display/social-links-grid-skeleton";
import ServicesGrid from "@/components/data-display/hotel-services-grid";
import ServicesGridSkeleton from "@/components/data-display/services-grid-skeleton";
import CuisinesGrid from "@/components/data-display/cuisines-grid";
import CuisinesGridSkeleton from "@/components/data-display/cuisines-grid-skeleton";
import MapViewSkeleton from "@/components/maps/map-view-skeleton";
import MapView from "@/components/maps/map-view";

interface SocialLinks {
    facebook: string;
    instagram: string;
    twitter: string;
}

interface Location {
    latitude: number|null;
    longitude: number|null;
}

interface Policies {
    checkIn: string;
    checkOut: string;
    cancellation: string;
}

interface User {
    name: string;
    logo: string;
    email: string;
    registrationId: string;
    phone: string;
    approved: boolean;
    address: string;
    district: string;
    area: string;
    postalCode: number;
    description: string;
    socialLinks?: SocialLinks;
    facilities?: string[];
    views?: string[];
    policies: Policies;
    location: Location;
}

const HotelProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
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
    }, []);

    useEffect(() => {
        fetch('/api/get-user-info-for-profile') 
            .then(res => res.json())
            .then(data => {
                setUser(data.user);
                setLoading(false);
            }
         );
    }, []);

/////////////////////////////////////////////
    const contactInformation = [
        { label: "Email", value: user?.email },
        { label: "Phone Number", value: user?.phone },
        { label: "Approved", value: user?.approved },
    ];

    const location = [
        { label: "Address", value: user?.address },
        { label: "District", value: user?.district },
        { label: "Area", value: user?.area },
        { label: "Postal Code", value: user?.postalCode },
    ];

    const policies = [
        { label: "CheckIn", value: user?.policies.checkIn },
        { label: "CheckOut", value: user?.policies.checkOut },
        { label: "Cancellation", value: user?.policies.cancellation },
    ];
/////////////////////////////////////////////



    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarHotel  pagetype="Profile"/>

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Profile</h1>

                {loading && (
                <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col md:flex-row gap-14">
                    <div className="md:w-1/4 flex flex-col items-center border-gray-300 pr-10 md:sticky md:top-[128px] md:h-[calc(100vh-128px)] md:z-40">
                        <div className="w-48 h-48 bg-gray-300 rounded-lg mb-8 shadow-lg"></div>
                        <div className="h-6 w-40 bg-gray-300 rounded mb-3"></div>
                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    </div>

                    <div className="md:w-2/3 space-y-12 ">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <InfoGridSkeleton />
                            <InfoGridSkeleton />

                            <div className="md:col-span-2"><DescriptionGridSkeleton /></div>

                            <SocialLinksGridSkeleton />
                            <ServicesGridSkeleton />

                            <CuisinesGridSkeleton />
                            <InfoGridSkeleton />
                            <div className="md:col-span-2">
                                <MapViewSkeleton />
                            </div>

                        </div>
                    </div>

                </div>
                )}

                {user!==null && (
                <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col md:flex-row gap-14">
                    <div className="md:w-1/4 flex flex-col items-center border-gray-300 pr-10 md:sticky md:top-[128px] md:h-[calc(100vh-128px)] md:z-40">
                        <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/images/${user.logo}`}
                            className="w-48 h-48 object-cover rounded-lg mb-8 shadow-lg"
                        />
                        <h2 className="text-2xl font-semibold text-indigo-900 mb-2">{user.name} </h2>
                        <p className="text-indigo-700 mb-8 tracking-wider font-medium">Reg. ID: {user.registrationId} </p>
                    </div>

                    {/* section className="md:w-2/3 space-y-12 text-indigo-900" */}
                    <div className="md:w-2/3 space-y-12 ">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* <InfoGrid title="Contact Information" items={contactInformation} /> */}
                            <InfoGrid title="Contact Information" items={contactInformation} />
                            <InfoGrid title="Location" items={location} />

                            <div className="md:col-span-2"><DescriptionGrid description={user.description} /></div>
                            
                            <div>
                                <SocialLinksGrid {...user.socialLinks}/>
                            </div>

                            <div>
                                <ServicesGrid title="Facilities & Services" items={user.facilities || []} />
                            </div>

                            {/* <div className="md:col-span-2"> */}
                            <div>
                                <CuisinesGrid title="Views" items={user.views || []} />
                            </div>
                            <div>
                                <InfoGrid title="Policies" items={policies} />
                            </div>

                            {(user.location.latitude && user.location.longitude) && (<div className="md:col-span-2">
                                <MapView 
                                    latitude={user.location.latitude} 
                                    longitude={user.location.longitude} 
                                />
                            </div>)}

                            {/* <div className="md:col-span-2">
                                <TimeTable {...user.openingHours} />
                            </div> */}

                        </div>
                    </div>

                </div>
                )}

            </main>
        </div>
    )
}

export default HotelProfilePage;