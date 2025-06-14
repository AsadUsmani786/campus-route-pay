
import { useEffect, useState, useRef } from "react";
import { MapPin, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="relative h-96 w-full overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <Bus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Bus Tracking</h3>
          <p className="text-sm text-muted-foreground">Map functionality temporarily disabled</p>
          <p className="text-xs text-muted-foreground mt-1">Bus location updates every 5 seconds</p>
        </div>
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
            <span>{busLocation.lat.toFixed(4)}, {busLocation.lng.toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Heading:</span>
            <span>{Math.round(busLocation.heading)}°</span>
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
