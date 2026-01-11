import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    
    const id = searchParams.get("id");

    const res = await fetch(`http://localhost:4000/get-restaurant-info?id=${id}`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    return NextResponse.json({ restaurant: data.restaurant });
}