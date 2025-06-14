import { useEffect, useState, useRef } from "react";
import { MapPin, Bus } from "lucide-react";

const BusMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [busLocation, setBusLocation] = useState([23.391768, 85.382955] as [number, number]);
  const mapRef = useRef<any>(null);

  // Fixed coordinates for the locations
  const centralCampus = [23.413359, 85.441085] as [number, number];
  const initialBusLocation = [23.391768, 85.382955] as [number, number];
  const northCampus = [23.370177, 85.324825] as [number, number];
  
  // Route stops
  const stops = [
    { position: centralCampus, name: "Central Campus", type: "start" },
    { position: initialBusLocation, name: "Main Road Junction", type: "current" },
    { position: northCampus, name: "North Campus", type: "destination" }
  ];

  useEffect(() => {
    let map: any = null;
    let busMarker: any = null;
    
    const initializeMap = async () => {
      try {
        // Import Leaflet
        const L = await import('leaflet');
        
        // Import CSS
        await import('leaflet/dist/leaflet.css');

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        if (mapRef.current && !map) {
          // Initialize the map
          map = L.map(mapRef.current).setView([23.391768, 85.382955], 13);

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          // Add route polyline
          const routePath = [centralCampus, initialBusLocation, northCampus];
          L.polyline(routePath, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.8
          }).addTo(map);

          // Add start marker (Central Campus)
          L.marker(centralCampus)
            .addTo(map)
            .bindPopup('<div><h3>Central Campus</h3><p>Starting Point</p></div>');

          // Add destination marker (North Campus)
          L.marker(northCampus)
            .addTo(map)
            .bindPopup('<div><h3>North Campus</h3><p>Destination</p></div>');

          // Create custom bus icon
          const busIcon = L.divIcon({
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

          // Add bus marker
          busMarker = L.marker(busLocation, { icon: busIcon })
            .addTo(map)
            .bindPopup('<div><h3>Bus Location</h3><p>Currently moving towards North Campus</p><p>ETA: ~15 minutes</p></div>');

          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    initializeMap();

    return () => {
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded) return;

    // Simulate bus movement
    const moveBus = () => {
      setBusLocation(prev => {
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
  }, [mapLoaded]);

  // Update bus marker position when busLocation changes
  useEffect(() => {
    const updateBusMarker = async () => {
      if (mapLoaded && mapRef.current) {
        const L = await import('leaflet');
        const map = mapRef.current;
        
        // Find and update the bus marker
        map.eachLayer((layer: any) => {
          if (layer.options && layer.options.icon && layer.options.icon.options.className === 'custom-bus-icon') {
            layer.setLatLng(busLocation);
          }
        });
      }
    };

    updateBusMarker();
  }, [busLocation, mapLoaded]);

  if (!mapLoaded) {
    return (
      <div className="space-y-4">
        <div className="relative h-96 w-full overflow-hidden rounded-lg my-5 bg-card/30 flex items-center justify-center">
          <p className="text-muted-foreground">Loading map...</p>
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
  }
  
  return (
    <div className="space-y-4">
      {/* Leaflet Map */}
      <div 
        ref={mapRef}
        className="relative h-96 w-full overflow-hidden rounded-lg my-5"
        style={{ 
          minHeight: '400px',
          background: '#f0f0f0'
        }}
      />
      
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
