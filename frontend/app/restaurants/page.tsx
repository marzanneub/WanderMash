"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import SidebarRestaurant from "@/components/navigation/sidebarRestaurant";

interface User {
    logo: string;
    dp: string;
    phone: string;
    images: string[];
}

const RestaurantsPage: React.FC = () => {

    return (
        <div>

        </div>
    )
}

export default RestaurantsPage;