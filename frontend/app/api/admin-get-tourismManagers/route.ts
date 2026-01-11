import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {

    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();

    const res = await fetch(`http://localhost:4000/admin/get-tourismManagers`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": allCookies,
        },
        credentials: "include",
    });
    const data = await res.json();
    return NextResponse.json({ items: data.items });
}