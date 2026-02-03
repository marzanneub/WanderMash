"use client";
import React, {useState, useEffect, useMemo} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { TbChevronLeft } from "react-icons/tb";
import { RoomCard } from "@/components/cards/room-card";

interface User {
    name: string;
    email: string;
    profilePicture: string;
    phone: string;
    bio: string;
}

interface Capacity {
    adults: number;
    children: number;
}

interface BedConfig {
    singleBeds: number;
    doubleBeds: number;
    extraBedsAvailable: boolean;
}

interface Rooms {
    _id?: string;
    roomNumber: number;
    isAvailable: boolean;
    unavailableDates: Date[];
}

interface RoomTypes {
    _id: string;
    title: string;
    pricePerNight: number;
    dp: string;
    capacity: Capacity;
    bedConfig: BedConfig;
    roomSize: string;
    furnishings: string[];
    amenities: string[];
    description: string;
    images: string[];
    rooms: Rooms[];
}

const getDateString = (date: Date) => date.toISOString().split("T")[0];

const GeneralUserbookHotelPage: React.FC = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const id: string|null  = searchParams.get("_id");

    const [user, setUser] = useState(null);
    const [roomTypes, setRoomTypes] = useState<RoomTypes[]>([]);
    const [filteredRoomTypes, setFilteredRoomTypes] = useState<RoomTypes[]>([]);
    
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const [search, setSearch] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [errors, setErrors] = useState<{
        checkIn?: string;
        checkOut?: string;
        errormessage?: string;
    }>({});

    useEffect(() => {
        fetch('/api/get-user-info-for-profile') 
        .then(res => res.json())
        .then(data => {
            setUser(data.user);
            }
        );
    }, []);

    useEffect(() => {
        fetch(`/api/get-hotel-rooms?id=${id}`)
            .then(res => res.json())
            .then(data => {
                setRoomTypes(data.roomTypes || []);
                setLoading(false);
            }
        );
    }, [id]);
    
    const today = getDateString(new Date());
    const minCheckOutDate = useMemo(() => {
        const date = new Date(checkIn || today);
        date.setDate(date.getDate() + 1);
        return getDateString(date);
    }, [checkIn]);

    const getRoomTypes = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if (!checkIn) {
            newErrors.checkIn = "Check-in date is required";
        }

        if (!checkOut) {
            newErrors.checkOut = "Check-out date is required";
        }

        setErrors(newErrors);
        
        if (Object.keys(newErrors).length !== 0) return;
        if (!id) return;

        
        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const results = roomTypes.filter((type) => {
            const fit = type.capacity.adults >= adults && type.capacity.children >= children;
            if (!fit) return false;

            return type.rooms.some((room) => {
                if (!room.isAvailable) return false;

                const overlap = room.unavailableDates.some((dateVal) => {
                    const unavailableDate = new Date(dateVal);
                    return unavailableDate >= start && unavailableDate < end;
                });

                return !overlap;
            });
        });

        setFilteredRoomTypes(results);
        setSearch(true);

    }
    //////////////////Room booking//////////////////
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [totalAmount, setTotalAmount] = useState(10000000000000000);

    const bookRoom = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/generalUser/bookHotel`, {
            method: "POST",
            headers: {
                    "Content-Type": "application/json",
            },
            body: JSON.stringify({ hotelID: id, selectedRoomType, totalAmount, checkIn, checkOut, accountNumber }),
            credentials: "include",
        });
            
        const data = await res.json();
        if(!res.ok){
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
        else{
            // toast.success(data.successmessage, {
            //     position: "top-center",
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: false,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "colored",
            // });
            router.push(`bookings?successmessage=${data.successmessage}`);
            return;
        }
    }
    ////////////////////////////////////////////////
    
    //////////////////For payment//////////////////
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [step, setStep] = useState(1);

    const bkashPink = "#E2136E";
    const bkashDarkPink = "#B11155";

    const [errorsPayment, setErrorsPayment] = useState<{
        accountNumber?: string;
        pinNumber?: string;
        errormessage?: string;
    }>({});
    
    const calculateTotalAmount = (pricePerNight: number) => {
        if (!checkIn || !checkOut) return 0;

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const diffInTime = end.getTime() - start.getTime();
        
        const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

        const nights = diffInDays > 0 ? diffInDays : 1;
        
        setTotalAmount(nights * pricePerNight);
    };
    
    const [accountNumber, setAccountNumber] = useState("");
    const handleInputAccountNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const onlyNums = val.replace(/[^0-9]/g, "");
        
        const maxLength = 11;
        if (onlyNums.length <= maxLength) {
            setAccountNumber(onlyNums);
        }
    };
    const [pinNumber, setPinNumber] = useState("");
    const handleInputPinNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const onlyNums = val.replace(/[^0-9]/g, "");
        
        const maxLength = 6;
        if (onlyNums.length <= maxLength) {
            setPinNumber(onlyNums);
        }
    };
    
    const handleNext = async () => {

        if (step < 2) {
            const newErrors: typeof errorsPayment = {};

            if(accountNumber === "") {
                newErrors.accountNumber = "Account Number is required";
            }

            setErrorsPayment(newErrors);
            if (Object.keys(newErrors).length !== 0) return;

            setStep(step + 1);
        }
        else {
            const newErrors: typeof errorsPayment = {};

            if(pinNumber === "") {
                newErrors.pinNumber = "Pin Number is required";
            }

            setErrorsPayment(newErrors);
            if (Object.keys(newErrors).length !== 0) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/generalUser/bkashPayment`, {
                method: "POST",
                headers: {
                        "Content-Type": "application/json",
                },
                body: JSON.stringify({ hotelID: id, selectedRoomType, totalAmount, checkIn, checkOut, accountNumber, pinNumber }),
                credentials: "include",
            });

            const data = await res.json();
            if(res.ok){
                // toast.success(data.successmessage, {
                //     position: "top-center",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: false,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //     theme: "colored",
                // });

                bookRoom();

                setPaymentOpen(false);
                setStep(1);
                setAccountNumber("");
                setPinNumber("");

                return;
            }
            else{
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

                // setPaymentOpen(false);
                setStep(1);
                setAccountNumber("");
                setPinNumber("");

                return;
            }
        }
    };
    
    ///////////////////////////////////////////////
    
    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <div className="flex items-center gap-4 mb-10">
                <button onClick={() => router.back()}
                    className="p-2 bg-white rounded-full shadow-sm text-gray-300 hover:bg-gray-100 hover:text-black transition flex-shrink-0 cursor-pointer">
                    <TbChevronLeft size={24} />
                </button>
                <h1 className="text-4xl font-bold text-indigo-900">Book Hotel</h1>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 uppercase mb-1">Check-In</label>
                        <input 
                        type="date" 
                        min={today}
                        // value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                        />
                        {errors.checkIn && (
                            <p className="mt-1 text-sm text-red-600">{errors.checkIn}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 uppercase mb-1">Check-Out</label>
                        <input 
                        type="date" 
                        min={minCheckOutDate}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                        />
                        {errors.checkOut && (
                            <p className="mt-1 text-sm text-red-600">{errors.checkOut}</p>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">Adults Capacity</label>
                        <div className="flex items-center justify-between border border-gray-300 rounded-lg p-1 bg-gray-50">
                        <button
                            type="button"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                        >
                            –
                        </button>
                        <span className="text-lg font-semibold text-slate-800">{adults}</span>
                        <button
                            type="button"
                            onClick={() => setAdults(adults + 1)}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                        >
                            +
                        </button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">Children Capacity</label>
                        <div className="flex items-center justify-between border border-gray-300 rounded-lg p-1 bg-gray-50">
                        <button
                            type="button"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                        >
                            –
                        </button>
                        <span className="text-lg font-semibold text-slate-800">{children}</span>
                        <button
                            type="button"
                            onClick={() => setChildren(children + 1)}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                        >
                            +
                        </button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={getRoomTypes}
                            className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold border rounded-md shadow-md transition cursor-pointer">
                            Search
                        </button>
                    </div>
                </div>

                {!search ? (<div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center shadow-sm">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                        Ready to find your stay?
                    </h3>
                    <p className="text-slate-500 mt-4 max-w-sm mx-auto text-sm leading-relaxed">
                        Enter your dates and guest details above to explore our luxury rooms and suites.
                    </p>
                </div>) : filteredRoomTypes.length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                    {filteredRoomTypes.map((type) => (
                        <div key={type._id}>
                            <RoomCard item={type}>
                                <button
                                onClick={() => {
                                    setPaymentOpen(true);
                                    setSelectedRoomType(type._id);
                                    calculateTotalAmount(type.pricePerNight);
                                }}
                                className="mt-6 w-full md:w-max px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors cursor-pointer">
                                    Book Now
                                </button>
                            </RoomCard>
                        </div>
                    ))}
                </div>
                ) : (<div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center shadow-sm">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                        No Rooms Match Your Search
                    </h3>
                    
                    <p className="text-slate-500 mt-4 max-w-sm mx-auto text-sm leading-relaxed">
                        We couldn&apos;t find any rooms that fit your guest count and dates.
                        Try **reducing the number of guests** or **checking different dates** to see more availability.
                    </p>
                </div>)
                }
                
                {paymentOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="max-w-[360px] bg-white rounded-t-lg shadow-2xl overflow-hidden relative">

                    <div style={{ backgroundColor: bkashPink }} className="p-5 text-white flex flex-col items-center">
                    <div className="bg-white px-4 py-1 rounded flex items-center justify-center mb-3">
                        <span style={{ color: bkashPink }} className="font-black italic text-xl underline decoration-2 tracking-tighter">bKash (replica)</span>
                    </div>
                    <p className="text-xs opacity-80 uppercase tracking-widest">Merchant: WanderMash</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs opacity-80">Amount:</span>
                        <span className="text-lg font-bold">৳ {totalAmount}</span>
                    </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="text-center space-y-1">
                            <h3 style={{ color: bkashPink }} className="font-bold text-sm">
                            {step === 1 && "Your bKash Account Number"}
                            {step === 2 && "Enter Your bKash PIN"}
                            </h3>
                        </div>

                        <div className="relative">
                            {step === 1 && (<input 
                            type="text"
                            placeholder="e.g 01XXXXXXXXX"
                            value={accountNumber}
                            onChange={handleInputAccountNumber}
                            className={`w-full border-b-2 border-gray-300 outline-none py-2 text-center text-xl font-medium transition-colors
                                tracking-[0.2em] placeholder:tracking-normal placeholder:text-gray-300 placeholder:text-base`}
                            style={{ caretColor: bkashPink }}
                            onFocus={(e) => e.target.style.borderBottomColor = bkashPink}
                            onBlur={(e) => e.target.style.borderBottomColor = "#D1D5DB"}
                            autoFocus
                            />)}
                            {errorsPayment.accountNumber && (
                                <p className="mt-1 text-sm text-red-600">{errorsPayment.accountNumber}</p>
                            )}
                            {step === 2 && (<input 
                            type="password"
                            placeholder="****"
                            value={pinNumber}
                            onChange={handleInputPinNumber}
                            className={`w-full border-b-2 border-gray-300 outline-none py-2 text-center text-xl font-medium transition-colors
                                tracking-[0.8em] placeholder:tracking-normal placeholder:text-gray-300 placeholder:text-base`}
                            style={{ caretColor: bkashPink }}
                            onFocus={(e) => e.target.style.borderBottomColor = bkashPink}
                            onBlur={(e) => e.target.style.borderBottomColor = "#D1D5DB"}
                            autoFocus
                            />)}
                            {errorsPayment.pinNumber && (
                                <p className="mt-1 text-sm text-red-600">{errorsPayment.pinNumber}</p>
                            )}
                        </div>

                        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                            By clicking on <b>{step === 2 ? "CONFIRM" : "PROCEED"}</b>, you are agreeing to our 
                            <span className="underline ml-1 cursor-pointer">terms & conditions</span>
                        </p>
                    </div>

                    <div className="flex border-t border-gray-100">
                    <button 
                        onClick={() => {
                            setPaymentOpen(false);
                            setStep(1);
                            setAccountNumber("");
                            setPinNumber("");
                            setErrorsPayment({});
                        }}
                        className="w-1/2 py-4 bg-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-400 uppercase transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                    <button 
                        onClick={handleNext}
                        style={{ backgroundColor: bkashPink }}
                        className="w-1/2 py-4 text-white font-bold text-sm uppercase transition-colors opacity-90 hover:opacity-100 cursor-pointer"
                    >
                        {step === 2 ? "Confirm" : "Proceed"}
                    </button>
                    </div>

                    <div style={{ backgroundColor: bkashDarkPink }} className="py-2 flex items-center justify-center gap-2 text-white text-opacity-90">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-xs font-bold tracking-tighter">16247</span>
                    </div>


                </div>
                </div>
                )}

                

            </main>
        </div>
    )
}

export default GeneralUserbookHotelPage;