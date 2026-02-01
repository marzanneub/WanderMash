"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaUserFriends } from "react-icons/fa";
import { TbArrowsMaximize } from "react-icons/tb";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import SidebarHotel from "@/components/navigation/sidebarHotel";

export interface Rooms {
    _id?: string;
    roomNumber: number;
    isAvailable: boolean;
    unavailableDates: Date[];
}

export interface RoomTypes {
    _id: string;
    title: string;
    rooms: Rooms[];
}

const HotelRoomsPage: React.FC = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const id: string|null  = searchParams.get("_id");

    const [roomTypes, setRoomTypes] = useState<RoomTypes | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [errors, setErrors] = useState<{
        title?: string;
        rooms?: string;
        roomNumber?: string;
        isAvailable?: string;
        unavailableDates?: string;
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

    return (
        <div>

        </div>
    )
}

export default HotelRoomsPage;