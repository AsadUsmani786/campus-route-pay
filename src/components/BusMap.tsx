
import { useEffect, useState, useRef } from "react";
import { MapPin, Bus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BusMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState("firayalal");
  const [busLocation, setBusLocation] = useState([23.391768, 85.382955] as [number, number]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  // Fixed coordinates for the locations
  const bitMesra = [23.413359, 85.441085] as [number, number];
  const initialBusLocation = [23.391768, 85.382955] as [number, number];
  
  // Destination options with coordinates
  const destinations = {
    firayalal: { name: "Firayalal", coords: [23.370177, 85.324825] as [number, number] },
    doranda: { name: "Doranda", coords: [23.344167, 85.309722] as [number, number] },
    sujataChowk: { name: "Sujata Chowk", coords: [23.354722, 85.335278] as [number, number] }
  };

  const currentDestination = destinations[selectedDestination as keyof typeof destinations];

  useEffect(() => {
    const initializeMap = async () => {
      try {
        console.log('Initializing map...');
        
        // Import Leaflet
        const L = await import('leaflet');
        console.log('Leaflet loaded');

        // Ensure the map container exists and has proper dimensions
        if (!mapRef.current) {
          console.error('Map container not found');
          return;
        }

        // Clear any existing map instance (for hot reloading)
        if (mapInstanceRef.current) {
          console.log('Removing existing map instance');
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Clear any leaflet ID on the container (for hot reloading)
        if ((mapRef.current as any)._leaflet_id) {
          delete (mapRef.current as any)._leaflet_id;
        }

        console.log('Creating new map instance');

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Initialize the map
        mapInstanceRef.current = L.map(mapRef.current).setView([23.391768, 85.382955], 13);
        console.log('Map created successfully');

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current);

        updateMapForDestination(L);

        console.log('Map initialization complete');
        setMapLoaded(true);
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(initializeMap, 100);
    
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const updateMapForDestination = async (L: any) => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers and polyline
    markersRef.current.forEach(marker => mapInstanceRef.current.removeLayer(marker));
    if (polylineRef.current) {
      mapInstanceRef.current.removeLayer(polylineRef.current);
    }
    markersRef.current = [];

    // Add route polyline
    const routePath = [bitMesra, initialBusLocation, currentDestination.coords];
    polylineRef.current = L.polyline(routePath, {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.8
    }).addTo(mapInstanceRef.current);

    // Add start marker (Bit Mesra)
    const startMarker = L.marker(bitMesra)
      .addTo(mapInstanceRef.current)
      .bindPopup('<div><h3>Bit Mesra</h3><p>Starting Point</p></div>');
    markersRef.current.push(startMarker);

    // Add destination marker
    const destMarker = L.marker(currentDestination.coords)
      .addTo(mapInstanceRef.current)
      .bindPopup(`<div><h3>${currentDestination.name}</h3><p>Destination</p></div>`);
    markersRef.current.push(destMarker);

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
    const busMarker = L.marker(busLocation, { icon: busIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`<div><h3>Bus Location</h3><p>Currently moving towards ${currentDestination.name}</p><p>ETA: ~15 minutes</p></div>`);
    markersRef.current.push(busMarker);

    // Reset bus location to initial position
    setBusLocation(initialBusLocation);
  };

  // Update map when destination changes
  useEffect(() => {
    if (!mapLoaded) return;
    
    const updateMap = async () => {
      const L = await import('leaflet');
      updateMapForDestination(L);
    };
    
    updateMap();
  }, [selectedDestination, mapLoaded]);

  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    console.log('Setting up bus movement simulation');
    
    // Simulate bus movement
    const moveBus = () => {
      setBusLocation(prev => {
        const [lat, lng] = prev;
        const [targetLat, targetLng] = currentDestination.coords;
        
        // Move 5% of the remaining distance towards destination
        const newLat = lat + (targetLat - lat) * 0.05;
        const newLng = lng + (targetLng - lng) * 0.05;
        
        return [newLat, newLng];
      });
    };

    const interval = setInterval(moveBus, 5000);
    return () => clearInterval(interval);
  }, [mapLoaded, currentDestination]);

  // Update bus marker position when busLocation changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    console.log('Updating bus marker position');
    
    // Find and update the bus marker
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer.options && layer.options.icon && layer.options.icon.options.className === 'custom-bus-icon') {
        layer.setLatLng(busLocation);
      }
    });
  }, [busLocation, mapLoaded]);

  return (
    <div className="space-y-4">
      {/* Destination Selector */}
      <div className="bg-card/30 p-4 rounded-md">
        <h4 className="font-semibold mb-2">Select Destination</h4>
        <Select value={selectedDestination} onValueChange={setSelectedDestination}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose your destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="firayalal">Firayalal</SelectItem>
            <SelectItem value="doranda">Doranda</SelectItem>
            <SelectItem value="sujataChowk">Sujata Chowk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leaflet Map */}
      <div 
        ref={mapRef}
        className="relative w-full overflow-hidden rounded-lg my-5 bg-gray-100"
        style={{ 
          height: '400px',
          minHeight: '400px'
        }}
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/30 rounded-lg">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center bg-card/30 p-3 rounded-md">
          <MapPin className="h-5 w-5 text-primary mr-2" />
          <div>
            <p className="text-xs text-muted-foreground">Starting point</p>
            <p className="text-sm">Bit Mesra</p>
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
            <p className="text-sm">{currentDestination.name}</p>
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
            <span>Route:</span>
            <span>Bit Mesra → {currentDestination.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Status:</span>
            <span className="text-green-500">{mapLoaded ? 'Active' : 'Loading...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusMap;
