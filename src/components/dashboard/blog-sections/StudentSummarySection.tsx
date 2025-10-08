import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StudentSummarySection = () => {
  const [summary, setSummary] = useState("");
  const [summaryId, setSummaryId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("student_summary")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching summary:", error);
      return;
    }

    if (data) {
      setSummary(data.summary);
      setSummaryId(data.id);
      setEditText(data.summary);
    } else {
      // Create default summary
      const defaultSummary = "Our students come from varied backgrounds but share a thirst for excellence. They participate actively in class discussions, show consistent academic growth, and perform well in board and competitive exams. Many of them have secured top ranks and scholarships, making our institute proud. With continuous support and guidance, we help them achieve their goals and prepare them for a bright academic future.";
      
      const { data: newData, error: insertError } = await supabase
        .from("student_summary")
        .insert([{
          user_id: user.id,
          summary: defaultSummary
        }])
        .select()
        .single();

      if (insertError) {
        console.error("Error creating summary:", insertError);
        return;
      }

      setSummary(defaultSummary);
      setSummaryId(newData.id);
      setEditText(defaultSummary);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("student_summary")
        .update({ summary: editText })
        .eq("id", summaryId);

      if (error) throw error;

      setSummary(editText);
      setIsEditing(false);
      toast({ title: "Success", description: "Summary updated successfully" });
    } catch (error) {
      console.error("Error updating summary:", error);
      toast({
        title: "Error",
        description: "Failed to update summary",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Student Summary</CardTitle>
          <Button
            size="sm"
            variant={isEditing ? "default" : "outline"}
            className="gap-2"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={6}
              className="w-full"
              placeholder="Enter student summary..."
            />
          ) : (
            <p className="text-muted-foreground leading-relaxed">
              {summary || "No summary available. Click 'Edit' to add one."}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentSummarySection;