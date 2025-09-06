// src/components/MapView.jsx
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocationCoordinates from "./LocationCoordinates";

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Helper component to fly map to new location
function FlyToLocation({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo([coords.lat, coords.lng], 10, { duration: 2 });
  }
  return null;
}

export default function MapView() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Example hazard data
  const markers = [
    { id: 1, position: [19.076, 72.8777], info: "Oil spill reported near Mumbai" },
    { id: 2, position: [13.0827, 80.2707], info: "Plastic waste spotted near Chennai" },
  ];

  const dangerPolygon = [
    [20.0, 72.5],
    [20.5, 73.0],
    [20.2, 73.5],
    [19.8, 73.2],
  ];

  const dangerCircle = {
    center: [15.2993, 74.124], // Goa
    radius: 50000, // 50 km
    info: "High current zone near Goa",
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar for input */}
      <div style={{ width: "300px", padding: "1rem", background: "#f8f8f8" }}>
        <LocationCoordinates onLocationSelect={setSelectedLocation} />
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[20.5937, 78.9629]} // India center
          zoom={5}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Fly to selected location */}
          <FlyToLocation coords={selectedLocation} />

          {/* Selected Location Marker */}
          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={redIcon}>
              <Popup>📍 Selected Location</Popup>
            </Marker>
          )}

          {/* Example hazard markers */}
          {markers.map((m) => (
            <Marker key={m.id} position={m.position} icon={redIcon}>
              <Popup>{m.info}</Popup>
            </Marker>
          ))}

          {/* Polygon Zone */}
          <Polygon positions={dangerPolygon} color="red" fillOpacity={0.4}>
            <Popup>Hazard Zone: Reported multiple issues</Popup>
          </Polygon>

          {/* Circular Zone */}
          <Circle
            center={dangerCircle.center}
            radius={dangerCircle.radius}
            color="orange"
            fillOpacity={0.3}
          >
            <Popup>{dangerCircle.info}</Popup>
          </Circle>
        </MapContainer>
      </div>
    </div>
  );
}
