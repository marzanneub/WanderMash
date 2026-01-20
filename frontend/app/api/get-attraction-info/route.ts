import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    
    const id = searchParams.get("id");

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/get-attraction-info?id=${id}`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    return NextResponse.json({ attraction: data.attraction });
}