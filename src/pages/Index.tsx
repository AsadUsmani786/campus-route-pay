
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusFront } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        navigate("/dashboard");
      } else {
        navigate("/auth/signin");
      }
    };
    
    checkUserSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="animate-pulse">
        <BusFront className="h-20 w-20 text-primary" />
      </div>
      <h1 className="text-3xl font-bold mt-4">RideBIT</h1>
      <p className="text-muted-foreground mt-2">College Transport System</p>
    </div>
  );
};

export default Index;
