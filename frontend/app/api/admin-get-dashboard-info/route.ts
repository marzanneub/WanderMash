import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {

    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/admin/get-dashboard-info`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": allCookies,
        },
        credentials: "include",
    });
    const data = await res.json();
    return NextResponse.json({ attractions: data.attractions, generalUsers: data.generalUsers, hotels: data.hotels, restaurants: data.restaurants, tourismManagers: data.tourismManagers, hotelBookings: data.hotelBookings });
}