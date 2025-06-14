import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { QrCode, CreditCard, MapPin, BusFront, LogOut } from "lucide-react";
import { PaymentHistory } from "@/components/PaymentHistory";
import BusMap from "@/components/BusMap";
import BusTimeTable from "@/components/BusTimeTable";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        navigate("/auth/signin");
      }
    };
    
    checkUser();
  }, [navigate]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth/signin");
  };
  
  const handlePayment = async () => {
    try {
      // In a real app, you would integrate with a payment gateway here
      // For now, we just simulate a successful payment
      
      // Record the payment in your Supabase database
      await supabase
        .from("payments")
        .insert({
          user_id: user?.id,
          amount: 40,
          status: "completed",
          date: new Date().toISOString(),
        });
      
      setShowPaymentConfirmation(true);
      
      toast({
        title: "Payment Successful",
        description: "Your ride has been booked for today!",
      });
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-card/95 backdrop-blur supports-backdrop-blur:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center gap-2">
            <BusFront className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold">RideBIT</h1>
          </div>
          <nav className="flex-1 ml-6">
            <ul className="flex gap-4">
              <li>
                <button 
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "overview" ? "bg-primary/10 text-primary" : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("track")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "track" ? "bg-primary/10 text-primary" : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  Track Bus
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("history")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "history" ? "bg-primary/10 text-primary" : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  Payment History
                </button>
              </li>
            </ul>
          </nav>
          <div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container px-4 py-6">
        {activeTab === "overview" && (
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Welcome, {user?.email?.split('@')[0]}</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-primary/10 bg-card/95 backdrop-blur">
                <CardHeader>
                  <CardTitle>Today's Ride</CardTitle>
                  <CardDescription>Pay for your bus ride today</CardDescription>
                </CardHeader>
                <CardContent>
                  {showPaymentConfirmation ? (
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <QrCode className="h-24 w-24 text-primary" />
                      </div>
                      <p className="mb-4">Payment confirmed! Show this QR code to the driver.</p>
                      <Button variant="outline" onClick={() => setShowPaymentConfirmation(false)}>
                        Close
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-2xl font-bold">₹40</p>
                      <Button onClick={handlePayment} className="w-full">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay for Today's Ride
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-primary/10 bg-card/95 backdrop-blur">
                <CardHeader>
                  <CardTitle>Quick Access</CardTitle>
                  <CardDescription>Useful shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("track")}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Track My Bus
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("history")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    View Payment History
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Add Bus Timetable */}
            <BusTimeTable />
          </div>
        )}
        
        {activeTab === "track" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Track My Bus</h2>
            <Card className="border-primary/10 bg-card/95 backdrop-blur">
              <CardContent className="p-0">
                <BusMap />
              </CardContent>
            </Card>
          </div>
        )}
        
        {activeTab === "history" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
            <Card className="border-primary/10 bg-card/95 backdrop-blur">
              <CardContent>
                <PaymentHistory userId={user?.id} />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
