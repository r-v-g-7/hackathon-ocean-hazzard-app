import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

// Component to pan/zoom map to new center
function ChangeMapView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 10); // Zoom level 10, adjust as needed
        }
    }, [center, map]);
    return null;
}

export default function LocationCoordinates() {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [input, setInput] = useState("");
    const [inputLocation, setInputLocation] = useState(null);

    // Detect Current Location using Geolocation API
    const detectCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCurrentLocation(coords);
                    setInputLocation(null); // Clear any previous searched location
                },
                (error) => {
                    console.error("Error detecting location:", error);
                    alert("Unable to fetch your location.");
                }
            );
        } else {
            alert("Geolocation not supported in your browser.");
        }
    };

    // Convert input location to coordinates using Nominatim API
    const detectInputLocation = async () => {
        if (!input.trim()) return;
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
            );
            const data = await res.json();
            if (data.length > 0) {
                const coords = {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                };
                setInputLocation(coords);
                setCurrentLocation(null); // Clear current location marker
            } else {
                alert("Location not found!");
            }
        } catch (err) {
            console.error("Error fetching input location:", err);
            alert("Error fetching location, please try again.");
        }
    };

    // Determine which location to show on map
    const locationToShow = currentLocation || inputLocation;

    return (
        <div style={{ display: "flex", height: "90vh" }}>
            {/* Left side controls */}
            <div style={{ width: "300px", padding: "1rem", background: "#f9f9f9" }}>
                <h2>🌍 Location Coordinates</h2>

                <button onClick={detectCurrentLocation} style={{ marginBottom: "10px", width: "100%" }}>
                    Detect My Current Location
                </button>

                {currentLocation && (
                    <p>
                        📍 Current: {currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}
                    </p>
                )}

                <div style={{ marginTop: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Enter a city/place"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={{ marginRight: "10px", width: "70%" }}
                    />
                    <button onClick={detectInputLocation}>Find Location</button>
                </div>

                {inputLocation && (
                    <p>
                        🗺 Input: {inputLocation.lat.toFixed(5)}, {inputLocation.lng.toFixed(5)}
                    </p>
                )}
            </div>

            {/* Map side */}
            <div style={{ flex: 1 }}>
                <MapContainer
                    center={locationToShow || { lat: 20, lng: 78 }} // Default center (India)
                    zoom={5}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locationToShow && (
                        <>
                            <Marker position={[locationToShow.lat, locationToShow.lng]} />
                            <ChangeMapView center={[locationToShow.lat, locationToShow.lng]} />
                        </>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
