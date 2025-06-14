
import { useEffect, useState } from "react";
import { MapPin, Bus } from "lucide-react";

const BusMap = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading map data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading map...</p>
      </div>
    );
  }
  
  return (
    <div className="relative h-96 w-full bg-black/20 overflow-hidden rounded-b-md">
      {/* This is a mockup of a map. In a real app, you'd integrate with a maps API */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-black/50 flex flex-col items-center justify-center p-4">
          <Bus className="h-12 w-12 text-primary mb-2" />
          <h3 className="text-lg font-medium">Bus Location</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            The bus is currently following its route and will arrive at your stop in approximately 15 minutes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6">
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
      </div>
    </div>
  );
};

export default BusMap;
