import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StudentResult {
  student_id: string;
  name: string;
  batch: string | null;
  status: string | null;
  fee_amount: number | null;
  fee_paid: number | null;
  enrollment_date: string | null;
}

const PublicStudentSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<StudentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a student ID or name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('student_id, name, batch, status, fee_amount, fee_paid, enrollment_date')
        .or(`student_id.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`)
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "Not Found",
            description: "No student found with this ID or name",
            variant: "destructive",
          });
          setSearchResult(null);
        } else {
          throw error;
        }
      } else {
        setSearchResult(data);
        toast({
          title: "Success",
          description: "Student found!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to search for student",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!searchResult) return;
    
    const message = `Student Details:\nID: ${searchResult.student_id}\nName: ${searchResult.name}\nBatch: ${searchResult.batch || 'N/A'}\nStatus: ${searchResult.status || 'N/A'}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Search Your Student ID
          </h2>
          <p className="text-muted-foreground text-lg">
            Enter your student ID or name to view your details
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Enter Student ID or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {searchResult && (
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-2xl font-bold">{searchResult.name}</h3>
                    <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-mono">
                      {searchResult.student_id}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Batch</p>
                      <p className="font-medium">{searchResult.batch || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className={`font-medium ${searchResult.status === 'active' ? 'text-success' : 'text-warning'}`}>
                        {searchResult.status || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Enrollment Date</p>
                      <p className="font-medium">
                        {searchResult.enrollment_date 
                          ? new Date(searchResult.enrollment_date).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    {searchResult.fee_amount && (
                      <div>
                        <p className="text-sm text-muted-foreground">Fee Status</p>
                        <p className="font-medium">
                          ₹{searchResult.fee_paid || 0} / ₹{searchResult.fee_amount}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleWhatsAppShare}
                    className="w-full mt-4"
                    variant="outline"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Share via WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PublicStudentSearch;