
import { useEffect, useState, useRef } from "react";
import { MapPin, Bus, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const BusMap = () => {
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const busMarker = useRef<mapboxgl.Marker | null>(null);
  
  // Mock bus location data - in a real app, this would come from your backend
  const [busLocation, setBusLocation] = useState({
    lng: -74.006,
    lat: 40.7128, // New York coordinates as example
    heading: 45
  });

  useEffect(() => {
    // Check if token is stored in localStorage
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
      initializeMap(storedToken);
    } else {
      setShowTokenInput(true);
      setLoading(false);
    }
  }, []);

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Mapbox token",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem('mapbox_token', mapboxToken);
    setShowTokenInput(false);
    setLoading(true);
    initializeMap(mapboxToken);
  };

  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [busLocation.lng, busLocation.lat],
        zoom: 14,
        pitch: 30,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      map.current.on('load', () => {
        // Add bus marker
        const busElement = document.createElement('div');
        busElement.className = 'bus-marker';
        busElement.innerHTML = `
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
            transform: rotate(${busLocation.heading}deg);
          ">
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        `;

        busMarker.current = new mapboxgl.Marker(busElement)
          .setLngLat([busLocation.lng, busLocation.lat])
          .addTo(map.current!);

        // Add route stops
        const stops = [
          { lng: -74.010, lat: 40.715, name: "Central Campus" },
          { lng: -74.006, lat: 40.7128, name: "Main Road Junction" },
          { lng: -74.002, lat: 40.710, name: "North Campus" }
        ];

        stops.forEach((stop, index) => {
          const stopElement = document.createElement('div');
          stopElement.innerHTML = `
            <div style="
              background: ${index === 1 ? '#10b981' : '#6b7280'};
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            "></div>
          `;

          new mapboxgl.Marker(stopElement)
            .setLngLat([stop.lng, stop.lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${stop.name}</h3>`))
            .addTo(map.current!);
        });

        setLoading(false);
      });

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

      return () => {
        clearInterval(interval);
        map.current?.remove();
      };
    } catch (error) {
      console.error('Map initialization error:', error);
      toast({
        title: "Map Error",
        description: "Failed to initialize map. Please check your Mapbox token.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Update bus marker position when location changes
  useEffect(() => {
    if (busMarker.current && map.current) {
      busMarker.current.setLngLat([busLocation.lng, busLocation.lat]);
      map.current.easeTo({
        center: [busLocation.lng, busLocation.lat],
        duration: 1000
      });
    }
  }, [busLocation]);

  if (showTokenInput) {
    return (
      <div className="relative h-96 w-full bg-black/20 overflow-hidden rounded-b-md">
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Setup Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To display the map, please enter your Mapbox public token. 
                You can get one at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbG..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
                <Button onClick={handleTokenSubmit} className="w-full">
                  Initialize Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading map...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="relative h-96 w-full overflow-hidden rounded-lg">
        <div ref={mapContainer} className="absolute inset-0" />
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
            <p className="text-xs text-muted-foregreen">ETA: ~15 minutes</p>
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
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            localStorage.removeItem('mapbox_token');
            setShowTokenInput(true);
            setMapboxToken("");
          }}
        >
          Change Map Token
        </Button>
      </div>
    </div>
  );
};

export default BusMap;
