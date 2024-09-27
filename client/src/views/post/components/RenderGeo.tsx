import React from 'react'

export default function RenderGeo({
    coordinates,
}: {
    coordinates: [number | null, number | null]
}) {
    const mapInfo = {
        latitude: 40.7371776,
        longitude: 31.5850752,
        apiKey: import.meta.env.VITE_APP_MAP_API_KEY,
    }
    return (
        <div>
            <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${coordinates[0]},${coordinates[1]}&zoom=15&size=400x300&key=${mapInfo.apiKey}`}
                alt="Map"
            />
        </div>
    )
}
