import { NextResponse } from 'next/server';
import haversine from '../../utils/haversine';

export async function POST(req) {
    const { latitude, longitude } = await req.json();

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return NextResponse.json({ message: 'Latitude and longitude must be numbers.' }, { status: 400 });
    }

    console.log(`User location: Latitude ${latitude}, Longitude ${longitude}`);

    const shopLatitude = 11.5539968; // Example shop latitude
    const shopLongitude = 104.9034752; // Example shop longitude
    const allowedRadius = 1; // 1 km
    
    const distance = haversine(shopLatitude, shopLongitude, latitude, longitude);

    if (distance <= allowedRadius) {
        return NextResponse.json({ status: 'success', message: 'Welcome! You can place an order.' }, { status: 200 });
    } else {
        return NextResponse.json({ status: 'error', message: 'You are too far from the shop to place an order.' }, { status: 200 });
    }
}