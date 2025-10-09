import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudentPayment {
  student_id: string;
  student_name: string;
  fee_amount: number;
  fee_paid: number;
  pending_amount: number;
}

export default function PendingPaymentsSection() {
  const [pendingPayments, setPendingPayments] = useState<StudentPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: students, error } = await supabase
        .from("students")
        .select("id, student_id, name, fee_amount, fee_paid")
        .eq("user_id", user.id)
        .eq("status", "active");

      if (error) throw error;

      if (students) {
        const pending = students
          .filter((student) => {
            const feeAmount = Number(student.fee_amount) || 0;
            const feePaid = Number(student.fee_paid) || 0;
            return feeAmount > feePaid;
          })
          .map((student) => ({
            student_id: student.student_id || student.id,
            student_name: student.name,
            fee_amount: Number(student.fee_amount) || 0,
            fee_paid: Number(student.fee_paid) || 0,
            pending_amount: (Number(student.fee_amount) || 0) - (Number(student.fee_paid) || 0),
          }))
          .sort((a, b) => b.pending_amount - a.pending_amount)
          .slice(0, 10);

        setPendingPayments(pending);
      }
    } catch (error) {
      console.error("Error fetching pending payments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  if (pendingPayments.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
          <AlertCircle className="h-5 w-5" />
          Pending Payments ({pendingPayments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingPayments.map((payment) => (
            <div
              key={payment.student_id}
              className="flex items-center justify-between p-3 bg-background rounded-lg border"
            >
              <div className="flex-1">
                <p className="font-medium">{payment.student_name}</p>
                <p className="text-sm text-muted-foreground">ID: {payment.student_id}</p>
              </div>
              <div className="text-right">
                <Badge variant="destructive" className="font-mono">
                  ₹{payment.pending_amount.toFixed(2)}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Paid: ₹{payment.fee_paid.toFixed(2)} / ₹{payment.fee_amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
