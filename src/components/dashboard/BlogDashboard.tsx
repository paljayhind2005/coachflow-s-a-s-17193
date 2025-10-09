import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import InstituteHeader from "./blog-sections/InstituteHeader";
import PendingPaymentsSection from "./blog-sections/PendingPaymentsSection";
import UpcomingClassesSection from "./blog-sections/UpcomingClassesSection";
import LiveClassesSection from "./blog-sections/LiveClassesSection";
import TopperStudentsSection from "./blog-sections/TopperStudentsSection";
import StudentSummarySection from "./blog-sections/StudentSummarySection";
import EventsSection from "./blog-sections/EventsSection";

interface InstituteInfo {
  id: string;
  name: string;
  location: string;
  description: string;
  teacher_names: string;
  map_link: string;
  hero_image_url: string;
}

const BlogDashboard = () => {
  const [instituteInfo, setInstituteInfo] = useState<InstituteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInstituteInfo();
  }, []);

  const fetchInstituteInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("institute_info")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setInstituteInfo(data);
      } else {
        // Create default institute info
        const { data: newData, error: insertError } = await supabase
          .from("institute_info")
          .insert([{
            user_id: user.id,
            name: "Kartik Classes01",
            location: "Rajendra Nagar SD Pataudi, Farux, Bhiwani, India, Pin Code: 800004",
            description: "Founded with a mission to deliver quality education, our tuition offers personalized guidance that nurtures the academic potential of every student. We emphasize strong academic foundations and conceptual clarity. With a team of highly qualified teachers and small batch sizes, we ensure each student receives individual attention. Studies easy to understand. Our classrooms are equipped with updated technology and we continuously update our curriculum to match board and competitive exam patterns. Over the years, we have proudly nurtured many toppers and successful achievers. We foster a learning environment that encourages every student to reach their full potential, helping them grow into responsible individuals. We believe in continuous improvement in parent-student learning journeys. We motivate our students to maintain academic rigor. We invite every parent and student to be a part of this transformational learning journey.",
            teacher_names: "Mr. GUDDU, Ms.PRAKASH SHARMA, Mr. Arun",
            map_link: "https://maps.google.com",
            hero_image_url: ""
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        setInstituteInfo(newData);
      }
    } catch (error) {
      console.error("Error fetching institute info:", error);
      toast({
        title: "Error",
        description: "Failed to load institute information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Institute Header */}
      <InstituteHeader 
        instituteInfo={instituteInfo} 
        onUpdate={fetchInstituteInfo}
      />

      {/* Pending Payments Section */}
      <PendingPaymentsSection />

      {/* Upcoming Classes Section */}
      <UpcomingClassesSection />

      {/* Live Classes Section */}
      <LiveClassesSection />

      {/* Topper Students Section */}
      <TopperStudentsSection />

      {/* Student Summary Section */}
      <StudentSummarySection />

      {/* Events Section */}
      <EventsSection />
    </div>
  );
};

export default BlogDashboard;