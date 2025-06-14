
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types"; 

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  date: string;
}

export const PaymentHistory = ({ userId }: { userId: string }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data, error } = await supabase
          .from("payments")
          .select("*")
          .eq("user_id", userId)
          .order("date", { ascending: false });

        if (error) {
          throw error;
        }

        setPayments(data || []);
      } catch (error: any) {
        console.error("Error fetching payment history:", error);
        toast({
          title: "Error",
          description: "Could not load payment history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPayments();
    }
  }, [userId]);

  if (loading) {
    return <div className="py-8 text-center">Loading payment history...</div>;
  }

  if (payments.length === 0) {
    return <div className="py-8 text-center">No payment history found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
            <TableCell>₹{payment.amount}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  payment.status === "completed"
                    ? "bg-green-100/10 text-green-500"
                    : payment.status === "pending"
                    ? "bg-yellow-100/10 text-yellow-500"
                    : "bg-red-100/10 text-red-500"
                }`}
              >
                {payment.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
