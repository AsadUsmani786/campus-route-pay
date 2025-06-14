import { useEffect, useState, useRef } from "react";
import { MapPin, Bus } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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
const startStopIcon = new L.DivIcon({
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

const destinationStopIcon = new L.DivIcon({
  html: `
    <div style="
      background: #ef4444;
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

const BusMap = () => {
  // Fixed coordinates for the locations
  const centralCampus = [23.413359, 85.441085] as [number, number];
  const initialBusLocation = [23.391768, 85.382955] as [number, number];
  const northCampus = [23.370177, 85.324825] as [number, number];
  
  // Mock bus location data - in a real app, this would come from your backend
  const [busLocation, setBusLocation] = useState(initialBusLocation);
  
  // Route stops
  const stops = [
    { position: centralCampus, name: "Central Campus", type: "start" },
    { position: initialBusLocation, name: "Main Road Junction", type: "current" },
    { position: northCampus, name: "North Campus", type: "destination" }
  ];

  // Polyline path connecting all stops
  const routePath = [centralCampus, initialBusLocation, northCampus];

  useEffect(() => {
    // Simulate bus movement along the route every 5 seconds
    const moveBus = () => {
      setBusLocation(prev => {
        // Simple simulation: move slightly towards North Campus
        const [lat, lng] = prev;
        const [targetLat, targetLng] = northCampus;
        
        // Move 10% of the remaining distance towards destination
        const newLat = lat + (targetLat - lat) * 0.1;
        const newLng = lng + (targetLng - lng) * 0.1;
        
        return [newLat, newLng];
      });
    };

    const interval = setInterval(moveBus, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-4">
      {/* Leaflet Map */}
      <div className="relative h-96 w-full overflow-hidden rounded-lg my-5">
        <MapContainer
          center={[23.391768, 85.382955]}
          zoom={13}
          className="h-full w-full rounded-lg"
          style={{
            background: '#1f2937',
            filter: 'hue-rotate(180deg) invert(1)',
          }}
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Route polyline */}
          <Polyline
            positions={routePath}
            color="#3b82f6"
            weight={4}
            opacity={0.8}
          />
          
          {/* Bus marker (current location) */}
          <Marker position={busLocation} icon={busIcon}>
            <Popup>
              <div>
                <h3 className="font-semibold">Bus Location</h3>
                <p className="text-sm">Currently moving towards North Campus</p>
                <p className="text-xs text-muted-foreground">ETA: ~15 minutes</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Stop markers */}
          <Marker position={centralCampus} icon={startStopIcon}>
            <Popup>
              <div>
                <h3 className="font-semibold">Central Campus</h3>
                <p className="text-sm">Starting Point</p>
              </div>
            </Popup>
          </Marker>
          
          <Marker position={northCampus} icon={destinationStopIcon}>
            <Popup>
              <div>
                <h3 className="font-semibold">North Campus</h3>
                <p className="text-sm">Destination</p>
              </div>
            </Popup>
          </Marker>
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
      
      <div className="bg-card/30 p-4 rounded-md">
        <h4 className="font-semibold mb-2">Live Bus Status</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current Position:</span>
            <span>{busLocation[0].toFixed(4)}, {busLocation[1].toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Status:</span>
            <span className="text-green-500">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusMap;
