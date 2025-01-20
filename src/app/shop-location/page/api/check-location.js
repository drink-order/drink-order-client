// pages/api/check-location.js

import haversine from "../../utils/haversine";


export default function handler(req, res) {
    if (req.method === 'POST') {
        const { latitude, longitude } = req.body;
        const shopLatitude = 11.55858; // Example shop latitude
        const shopLongitude = 104.88663; // Example shop longitude
        const allowedRadius = 1; // 1 km

        const distance = haversine(shopLatitude, shopLongitude, latitude, longitude);

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and longitude are required.' });
          }

        if (distance <= allowedRadius) {
            res.status(200).json({ status: 'success', message: 'Welcome! You can place an order.' });
        } else {
            res.status(200).json({ status: 'error', message: 'You are too far from the shop to place an order.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
