import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();

    const res = await fetch("http://localhost:4000/get-user-info", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": allCookies,
        },
        credentials: "include",
    });
    const data = await res.json();
    if(data && data.user.role === "admin") {
        return NextResponse.json({ role: "admin", dp: data.user.profilePicture });
    }
    else if(data && data.user.role === "generalUser") {
        return NextResponse.json({ role: "generalUser", dp: data.user.profilePicture });
    }
    else if(data && data.user.role === "restaurant") {
        return NextResponse.json({ role: "restaurant", dp: data.user.logo });
    }
    return NextResponse.json({ role: "None", dp: "" });
}