import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
        
    const id = searchParams.get("id");

    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/hotel/get-roomType?id=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": allCookies,
        },
        credentials: "include",
    });
    const data = await res.json();
    return NextResponse.json({ roomType: data.roomType });
}