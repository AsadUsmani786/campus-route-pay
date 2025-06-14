
import { useEffect, useState, useRef } from "react";
import { MapPin, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bus icon
const busIcon = new L.DivIcon({
  html: `
    <div style="
      background: #3b82f6;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </div>
  `,
  className: 'custom-bus-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Custom stop icons
const currentStopIcon = new L.DivIcon({
  html: `
    <div style="
      background: #10b981;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    "></div>
  `,
  className: 'custom-stop-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const stopIcon = new L.DivIcon({
  html: `
    <div style="
      background: #6b7280;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    "></div>
  `,
  className: 'custom-stop-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Component to handle map center updates
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

const BusMap = () => {
  // Mock bus location data - in a real app, this would come from your backend
  const [busLocation, setBusLocation] = useState({
    lng: -74.006,
    lat: 40.7128, // New York coordinates as example
    heading: 45
  });

  // Route stops
  const stops = [
    { lng: -74.010, lat: 40.715, name: "Central Campus" },
    { lng: -74.006, lat: 40.7128, name: "Main Road Junction" },
    { lng: -74.002, lat: 40.710, name: "North Campus" }
  ];

  useEffect(() => {
    // Simulate bus movement
    const moveBus = () => {
      setBusLocation(prev => ({
        ...prev,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        heading: prev.heading + (Math.random() - 0.5) * 10
      }));
    };

    const interval = setInterval(moveBus, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-4">
      <div className="relative h-96 w-full overflow-hidden rounded-lg">
        <MapContainer
          center={[busLocation.lat, busLocation.lng]}
          zoom={14}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={[busLocation.lat, busLocation.lng]} />
          
          {/* Bus marker */}
          <Marker 
            position={[busLocation.lat, busLocation.lng]} 
            icon={busIcon}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">Bus Location</h3>
                <p className="text-sm">Currently at Main Road Junction</p>
                <p className="text-xs text-muted-foreground">ETA: ~15 minutes</p>
              </div>
            </Popup>
          </Marker>

          {/* Route stops */}
          {stops.map((stop, index) => (
            <Marker
              key={index}
              position={[stop.lat, stop.lng]}
              icon={index === 1 ? currentStopIcon : stopIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold">{stop.name}</h3>
                  {index === 1 && <p className="text-sm text-green-600">Current Stop</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center bg-card/30 p-3 rounded-md">
          <MapPin className="h-5 w-5 text-primary mr-2" />
          <div>
            <p className="text-xs text-muted-foreground">Starting point</p>
            <p className="text-sm">Central Campus</p>
          </div>
        </div>
        <div className="flex items-center bg-primary/20 p-3 rounded-md">
          <Bus className="h-5 w-5 text-primary mr-2" />
          <div>
            <p className="text-xs text-muted-foreground">Current location</p>
            <p className="text-sm">Main Road Junction</p>
            <p className="text-xs text-muted-foreground">ETA: ~15 minutes</p>
          </div>
        </div>
        <div className="flex items-center bg-card/30 p-3 rounded-md">
          <MapPin className="h-5 w-5 text-primary mr-2" />
          <div>
            <p className="text-xs text-muted-foreground">Destination</p>
            <p className="text-sm">North Campus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusMap;
