"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import SidebarTourismManager from "@/components/navigation/sidebarTourismManager";
import { 
    FaSquareFacebook,
    FaSquareInstagram,
    FaSquareTwitter,
} from "react-icons/fa6";
import { districtUpazilas } from "@/data/locations/districtUpazilas";
import { attractionFacilities, attractionViews } from "@/data/attractions";

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

const mapStyles = `
  .leaflet-container {
    height: 100%;
    width: full;
    z-index: 1;
  }
`;

interface Attraction {
    name: string;
    email?: string;
    phone?: string;
    category?: string;
    description: string;
    district: string;
    upazila: string;
    address: string;
    location: Location;
    socialLinks?: SocialLinks;
    views?: string[];
    facilities?: string[];
    openingHours: OpeningHours;
    approved: boolean;
}

const TourismManagerEditAttractionsPage: React.FC = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const id: string|null  = searchParams.get("_id");

    const [attraction, setAttraction] = useState<Attraction | null>(null);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [district, setDistrict] = useState("")
    const [upazila, setUpazila] = useState("")
    const [address, setAddress] = useState("")
    const [location, setLocation] = useState<Location>({latitude: null, longitude: null});
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({
        facebook: "",
        instagram: "",
        twitter: "",
    })
    const [views, setViews] = useState<string[]>([])
    const [facilities, setFacilities] = useState<string[]>([])
    const [openingHours, setOpeningHours] = useState<OpeningHours>({
        saturday: { open: "", close: "" },
        sunday: { open: "", close: "" },
        monday: { open: "", close: "" },
        tuesday: { open: "", close: "" },
        wednesday: { open: "", close: "" },
        thursday: { open: "", close: "" },
        friday: { open: "", close: "" },
    });
    const [approved, setApproved] = useState(false)
    const [changeLocation, setChangeLocation] = useState(0);
    const [ClientMap, setClientMap] = useState<React.ReactElement | null>(null);

    const [loading, setLoading] = useState(true);
    
    const districts = Object.keys(districtUpazilas);
    const categories = Object.keys(attractionFacilities);

    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        phone?: string;
        category?: string;
        description?: string;
        district?: string;
        upazila?: string;
        address?: string;
        location?: string;
        socialLinks?: string;
        views?: string;
        facilities?: string;
        cuisines?: string;
        loading?: string;
        approved?: string;
        errormessage?: string;
    }>({});


    const warnmessage = searchParams.get("warnmessage");
    const successmessage = searchParams.get("successmessage");
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
        fetch(`/api/get-attraction-info?id=${id}`)
            .then(res => res.json())
            .then(data => {
                setAttraction(data.attraction);
                setName(data.attraction.name);
                setEmail(data.attraction.email);
                setPhone(data.attraction.phone);
                setCategory(data.attraction.category);
                setDescription(data.attraction.description);
                setDistrict(data.attraction.district);
                setUpazila(data.attraction.upazila);
                setAddress(data.attraction.address);
                setLocation(data.attraction.location);
                setSocialLinks({
                    facebook: data.attraction.socialLinks?.facebook || "",
                    instagram: data.attraction.socialLinks?.instagram || "",
                    twitter: data.attraction.socialLinks?.twitter || ""
                });
                setFacilities(data.attraction.facilities);
                setViews(data.attraction.views);
                setOpeningHours(data.attraction.openingHours);
                setApproved(data.attraction.approved);
                setChangeLocation(changeLocation+1);

                setLoading(false);
            }
            );
    }, []);

////////////////////for map////////////////////
    const LoadMap = async () => {
        const L = await import('leaflet');
        const { MapContainer, TileLayer, Marker, useMapEvents } = await import('react-leaflet');

        await import('leaflet/dist/leaflet.css');

        const DefaultIcon = L.icon({
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });

        const MapEvents = () => {
            useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setLocation({ latitude: lat, longitude: lng });
            },
            });
            return null;
        };

        const STADIA_API_KEY = "NONE";
        const tileUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`;

        setClientMap(
            <MapContainer 
            center={(location.latitude && location.longitude) ? [location.latitude, location.longitude] : [23.8103, 90.4125]}
            zoom={16} 
                    scrollWheelZoom={true}
            >
            <TileLayer
                url={tileUrl}
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            />
            <MapEvents />
            {(location.latitude && location.longitude) && (<Marker position={[location.latitude, location.longitude]} icon={DefaultIcon} />)}
            </MapContainer>
        );
    };

    useEffect(() => { 
        if(changeLocation>0) LoadMap();
    }, [changeLocation]);
//////////////////////////////////////////////////


/////////////////for facilities/////////////////
    const handleFacilitiesCheckboxChange = (option: string) => {
        if (facilities.includes(option)) {
            // REMOVE: Filter out the item to create a new array
            setFacilities(facilities.filter(item => item !== option));
        } else {
            // ADD: Spread existing items and add the new one
            setFacilities([...facilities, option]);
        }
    };

/////////////////////////////////////////////////

///////////////////for views/////////////////////
    const handleViewsCheckboxChange = (option: string) => {
        if (views.includes(option)) {
            // REMOVE: Filter out the item to create a new array
            setViews(views.filter(item => item !== option));
        } else {
            // ADD: Spread existing items and add the new one
            setViews([...views, option]);
        }
    };


/////////////////////////////////////////////////

/////////////////for openingHours////////////////
    const handleOpeningHoursChange = (day: keyof OpeningHours, field: "open" | "close", value: string) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };    

/////////////////////////////////////////////////

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if(!name) {
            newErrors.name = "Name is required";
        }

        if(!phone) {
            newErrors.phone = "Phone number is required";
        } else if(phone.startsWith("880")) {
            setPhone(`+${phone}`);
        } else if(phone.startsWith("0")) {
            setPhone(`+880${phone.slice(1)}`);
        } else if(!phone.startsWith("+880")) {
            setPhone(`+880${phone}`);
        }

        console.log(phone)

        if(!category) {
            newErrors.category = "category is required";
        }

        if(!district) {
            newErrors.district = "District is required";
        }

        if(!upazila) {
            newErrors.upazila = "Upazila is required";
        }
        if(!address) {
            newErrors.address = "Address is required";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length !== 0) return;
        if (!id) return;

        const formData = new FormData();
        
        formData.append("id", id);
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("district", district);
        formData.append("upazila", upazila);
        formData.append("address", address);
        formData.append("location", JSON.stringify(location));
        formData.append("socialLinks", JSON.stringify(socialLinks));
        formData.append("views", JSON.stringify(views));
        formData.append("facilities", JSON.stringify(facilities));
        formData.append("openingHours", JSON.stringify(openingHours));
        


        const res = await fetch("http://localhost:4000/tourismManager/editAttraction", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
            toast.error(data.errormessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        
        router.push("/tourismManager/attractions?successmessage=Successfully updated");
    }

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarTourismManager pagetype="Attractions" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Edit Attraction</h1>

                {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-8 space-y-8 animate-pulse">

                        {/* Basic info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                <div className="h-11 w-full bg-gray-100 rounded-md"></div>
                            </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-11 w-full bg-gray-100 rounded-md"></div>
                        </div>

                        {/* Address */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[...Array(2)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                <div className="h-11 w-full bg-gray-100 rounded-md"></div>
                            </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-11 w-full bg-gray-100 rounded-md"></div>
                        </div>

                        {/* Map Skeleton */}
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-[500px] w-full bg-gray-100 rounded-md" ></div>
                        </div>

                        {/* Social links */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-28 bg-gray-200 rounded"></div>
                                <div className="h-11 w-full bg-gray-100 rounded-md"></div>
                            </div>
                            ))}
                        </div>

                        {/* Facilities */}
                        <div className="border border-gray-200 rounded-md p-6 space-y-4">
                            <div className="h-4 w-40 bg-gray-200 rounded"></div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="h-4 w-28 bg-gray-100 rounded"></div>
                            ))}
                            </div>
                        </div>

                        {/* Views */}
                        <div className="border border-gray-200 rounded-md p-6 space-y-4">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="h-4 w-28 bg-gray-100 rounded"></div>
                            ))}
                            </div>
                        </div>

                        {/* Opening hours */}
                        <div className="border border-gray-200 rounded-md p-6 space-y-4">
                            <div className="h-4 w-36 bg-gray-200 rounded"></div>
                            {[...Array(7)].map((_, i) => (
                            <div key={i} className="grid grid-cols-3 gap-4 items-center">
                                <div className="h-4 w-20 bg-gray-100 rounded"></div>
                                <div className="h-9 w-full bg-gray-100 rounded"></div>
                                <div className="h-9 w-full bg-gray-100 rounded"></div>
                            </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between">
                            <div className="h-11 w-28 bg-gray-200 rounded-md"></div>
                            <div className="h-11 w-36 bg-gray-300 rounded-md"></div>
                        </div>
                    </div>
                )}

                {attraction !==null && (
                    <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Attraction name <span className="text-red-500">*</span></label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    // required
                                    placeholder="Attraction Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                                <select
                                    value={category} 
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                        setFacilities([]);
                                        setViews([]);
                                    }}
                                    className="w-full h-12 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="" disabled selected>-- select category --</option>
                                        {categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    // required
                                    placeholder="you@example.com"
                                    value={email}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-500 cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    // required
                                    placeholder="01XXX XXX XXX"
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^[0-9+]*$/.test(val)) {
                                            setPhone(val);
                                        };
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                // required
                                placeholder="Describe the attraction, its vibe, and specialties…"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>
                        {/* Address */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Select District <span className="text-red-500">*</span></label>
                                <select
                                    id="district"
                                    name="district"
                                    value={district || ""}
                                    onChange={(e) => {
                                        setDistrict(e.target.value);
                                        setUpazila("");
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="" disabled selected>Select district</option>
                                    {districts.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                                {errors.district && (
                                    <p className="mt-1 text-sm text-red-600">{errors.district}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="upazila" className="block text-sm font-medium text-gray-700 mb-1">Select Upazila <span className="text-red-500">*</span></label>
                                <select
                                    id="upazila"
                                    name="upazila"
                                    value={upazila || ""}
                                    onChange={(e) => setUpazila(e.target.value)}
                                    disabled={!district}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="" disabled>
                                        {district ? "-- select upazila --" : "-- select district first --"}
                                    </option>
                                    {district && districtUpazilas[district]?.map((u) => (
                                        <option key={u} value={u}>
                                            {u}
                                        </option>
                                    ))}
                                </select>
                                {errors.upazila && (
                                    <p className="mt-1 text-sm text-red-600">{errors.upazila}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Full Address <span className="text-red-500">*</span></label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                 placeholder="e.g., Building 123, Road 45, Dhanmondi, Dhaka"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location </label>
                            <div style={{ maxWidth: 'full', margin: '0 auto', fontFamily: 'system-ui' }}>
                            <style>{mapStyles}</style>

                            <div style={{ 
                                display: 'flex',
                                flexDirection: 'column', // Stack vertically
                                gap: '2rem', 
                                maxWidth: 'full',
                                margin: '0 auto'
                            }}>
                                {/* Map Display Section */}
                                <section style={{ height: '500px', width: 'full', borderRadius: '8px', overflow: 'hidden' }} onClick={() => setChangeLocation(changeLocation+1)}>
                                {ClientMap ? ClientMap : (
                                    <div style={{ height: '100%', width: 'full', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                                        Loading Map...
                                    </div>
                                )}
                                </section>
                            </div>
                            </div>

                            {errors.location && (
                                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="facebook" className="flex items-center gap-1 block text-sm font-medium text-gray-700 mb-1"><FaSquareFacebook /> Facebook </label>
                                <div className="flex rounded-md shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 overflow-hidden">
                                {/* <div className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"> */}
                                <span className="flex items-center px-3 bg-gray-100 text-gray-500 text-sm border-r border-gray-300 select-none">
                                    https://facebook.com/
                                </span>
                                <input
                                    id="facebook"
                                    name="facebook"
                                    type="text"
                                    // required
                                    placeholder="    pagename"
                                    value={socialLinks?.facebook}
                                    onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                                    className="w-full py-3"
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="instagram" className="flex items-center gap-1 block text-sm font-medium text-gray-700 mb-1"><FaSquareInstagram /> Instagram </label>
                                <div className="flex rounded-md shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 overflow-hidden">
                                <span className="flex items-center px-3 bg-gray-100 text-gray-500 text-sm border-r border-gray-300 select-none">
                                    https://instagram.com/
                                </span>
                                <input
                                    id="instagram"
                                    name="instagram"
                                    type="text"
                                    // required
                                    placeholder="    pagename"
                                    value={socialLinks?.instagram}
                                    onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                                    className="w-full py-3"
                                />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="twitter" className="flex items-center gap-1 block text-sm font-medium text-gray-700 mb-1"><FaSquareTwitter /> Twitter </label>
                                <div className="flex rounded-md shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 overflow-hidden">
                                <span className="flex items-center px-3 bg-gray-100 text-gray-500 text-sm border-r border-gray-300 select-none">
                                    https://twitter.com/
                                </span>
                                <input
                                    id="twitter"
                                    name="twitter"
                                    type="text"
                                    // required
                                    placeholder="    pagename"
                                    value={socialLinks?.twitter}
                                    onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                                     className="w-full py-3"
                                />
                                </div>
                            </div>
                        </div>

                        {/* facilities & Services */}
                        <fieldset className="border border-gray-300 rounded-md p-6">
                            <legend className="text-indigo-900 font-semibold">Facilities & Services</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-2 text-indigo-900 text-sm">
                                {category && attractionFacilities[category]?.map((option) => (
                                    <label
                                        key={option}
                                        className="inline-flex items-center space-x-2 cursor-pointer hover:text-indigo-600 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={facilities.includes(option)}
                                            onChange={() => handleFacilitiesCheckboxChange(option)}
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        {/* Views */}
                        <fieldset className="border border-gray-300 rounded-md p-6">
                            <legend className="text-indigo-900 font-semibold">Views</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-2 text-indigo-900 text-sm">
                                {category && attractionViews[category]?.map((option) => (
                                    <label
                                        key={option}
                                        className="inline-flex items-center space-x-2 cursor-pointer hover:text-indigo-600 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={views.includes(option)}
                                            onChange={() => handleViewsCheckboxChange(option)}
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className="border border-gray-300 rounded-md p-6">
                            <legend className="text-indigo-900 font-semibold px-2">Opening Hours</legend>
                            <div className="space-y-4">
                                {(Object.keys(openingHours) as Array<keyof OpeningHours>).map((day) => (
                                    <div key={day} className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 border-b border-gray-50 pb-2">
                                        <span className="capitalize font-medium text-gray-700">{day}</span>
                                        <div className="flex items-center space-x-2">
                                            <label className="text-xs text-gray-400 w-10">Open</label>
                                            <input
                                                type="time"
                                                value={openingHours[day].open}
                                                onChange={(e) => handleOpeningHoursChange(day, "open", e.target.value)}
                                                className="px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <label className="text-xs text-gray-400 w-10">Close</label>
                                            <input
                                                type="time"
                                                value={openingHours[day].close}
                                                onChange={(e) => handleOpeningHoursChange(day, "close", e.target.value)}
                                                className="px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </fieldset>

                        <div className="flex justify-between items-center">
                            <Link href={`/tourismManager/attractions?warnmessage=${"Nothing Changed"}`}>
                                <button className="px-4 py-3 text-indigo-600 hover:bg-gray-100 font-semibold rounded-md shadow-md transition cursor-pointer">
                                    Cancel
                                </button>
                            </Link>

                            <button type="submit"
                                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold border rounded-md shadow-md transition cursor-pointer">
                                Save Changes
                            </button>
                        </div>

                        </form>
                    </div>
                )}

            </main>

        </div>
    )
}

export default TourismManagerEditAttractionsPage;