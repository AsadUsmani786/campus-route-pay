
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BusFront } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <BusFront className="h-16 w-16 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Page not found</p>
      <Button onClick={() => navigate("/")}>Go back home</Button>
    </div>
  );
};

export default NotFound;
