"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "./ui/button";

// Fix for default marker icon in Leaflet with Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapPickerProps {
    latitude: number;
    longitude: number;
    onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ onSelect, position }: { onSelect: (lat: number, lng: number) => void, position: { lat: number, lng: number } | null }) {
    const map = useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={customIcon}>
            <Popup>Selected Location</Popup>
        </Marker>
    );
}

export function MapPicker({ latitude, longitude, onLocationSelect }: MapPickerProps) {
    // Default to Lahore if no location set
    const defaultCenter = { lat: 31.5204, lng: 74.3587 };
    const [position, setPosition] = useState<{ lat: number, lng: number } | null>(
        latitude && longitude ? { lat: latitude, lng: longitude } : null
    );

    useEffect(() => {
        if (latitude && longitude) {
            setPosition({ lat: latitude, lng: longitude });
        }
    }, [latitude, longitude]);

    const displayCenter = position || defaultCenter;

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition({ lat: latitude, lng: longitude });
                    onLocationSelect(latitude, longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not fetch location. Please ensure location services are enabled.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    return (
        <div className="space-y-2">
            <div className="h-[350px] w-full rounded-xl overflow-hidden border z-0 relative shadow-md ring-1 ring-border/50">
                <MapContainer
                    center={displayCenter}
                    zoom={15}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                    attributionControl={false}
                    key={`${displayCenter.lat}-${displayCenter.lng}`} // Force re-render on center change if needed
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                        onSelect={(lat, lng) => {
                            setPosition({ lat, lng });
                            onLocationSelect(lat, lng);
                        }}
                        position={position}
                    />
                </MapContainer>

                <div className="absolute top-2 right-2 z-[400]">
                    <Button
                        type="button"
                        size="sm"
                        onClick={handleCurrentLocation}
                        className="shadow-md bg-white text-primary hover:bg-gray-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                    >
                        📍 My Location
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface MapViewerProps {
    latitude: number;
    longitude: number;
    name?: string;
}

export function MapViewer({ latitude, longitude, name }: MapViewerProps) {
    if (!latitude || !longitude) return <div className="h-[300px] flex items-center justify-center bg-muted rounded-xl">Location not available</div>;

    const position = { lat: latitude, lng: longitude };

    return (
        <div className="h-[350px] w-full rounded-xl overflow-hidden border z-0 relative shadow-md ring-1 ring-border/50">
            <MapContainer
                key={`${position.lat}-${position.lng}`}
                center={position}
                zoom={15}
                scrollWheelZoom={true}
                className="h-full w-full"
                attributionControl={false}
                dragging={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={customIcon}>
                    <Popup>{name || "Hostel Location"}</Popup>
                </Marker>
            </MapContainer>
            <div className="absolute bottom-4 right-4 z-[400]">
                <Button
                    size="sm"
                    className="shadow-lg hover:scale-105 transition-transform font-medium"
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank')}
                >
                    Open in Google Maps
                </Button>
            </div>
        </div>
    );
}
