import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface LiveClass {
  id: string;
  class_name: string;
  subject: string;
  start_date: string;
  timing: string;
  fee: number;
  teacher_name: string;
  teacher_image_url: string | null;
}

const LiveClassesSection = () => {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<LiveClass | null>(null);
  const [formData, setFormData] = useState({
    class_name: "",
    subject: "",
    start_date: "",
    timing: "",
    fee: 0,
    teacher_name: "",
    teacher_image_url: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("live_classes")
      .select("*")
      .eq("user_id", user.id)
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Error fetching live classes:", error);
      return;
    }

    setClasses(data || []);
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editingClass) {
        const { error } = await supabase
          .from("live_classes")
          .update(formData)
          .eq("id", editingClass.id);

        if (error) throw error;
        toast({ title: "Success", description: "Class updated successfully" });
      } else {
        const { error } = await supabase
          .from("live_classes")
          .insert([{ ...formData, user_id: user.id }]);

        if (error) throw error;
        toast({ title: "Success", description: "Class added successfully" });
      }

      setIsDialogOpen(false);
      setEditingClass(null);
      resetForm();
      fetchClasses();
    } catch (error) {
      console.error("Error saving class:", error);
      toast({
        title: "Error",
        description: "Failed to save class",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("live_classes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Class deleted successfully" });
      fetchClasses();
    } catch (error) {
      console.error("Error deleting class:", error);
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      class_name: "",
      subject: "",
      start_date: "",
      timing: "",
      fee: 0,
      teacher_name: "",
      teacher_image_url: "",
    });
  };

  const openEditDialog = (classItem: LiveClass) => {
    setEditingClass(classItem);
    setFormData({
      class_name: classItem.class_name,
      subject: classItem.subject,
      start_date: classItem.start_date,
      timing: classItem.timing,
      fee: classItem.fee,
      teacher_name: classItem.teacher_name,
      teacher_image_url: classItem.teacher_image_url || "",
    });
    setIsDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live Classes</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingClass(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingClass ? "Edit Class" : "Add New Class"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Class Name (e.g., 12th)"
                  value={formData.class_name}
                  onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                />
                <Input
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
                <Input
                  placeholder="Timing (e.g., 5:00 PM - 6:30 PM)"
                  value={formData.timing}
                  onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Fee"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                />
                <Input
                  placeholder="Teacher Name"
                  value={formData.teacher_name}
                  onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                />
                <Input
                  placeholder="Teacher Image URL (optional)"
                  value={formData.teacher_image_url}
                  onChange={(e) => setFormData({ ...formData, teacher_image_url: e.target.value })}
                />
                <Button onClick={handleSubmit} className="w-full">
                  {editingClass ? "Update" : "Add"} Class
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No live classes. Click "Add Class" to create one.
              </p>
            ) : (
              classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="p-4 border border-border rounded-lg flex items-start gap-4"
                >
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    {classItem.teacher_image_url ? (
                      <img
                        src={classItem.teacher_image_url}
                        alt={classItem.teacher_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-2xl text-muted-foreground">👤</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Class: {classItem.class_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Start Date:</strong> {format(new Date(classItem.start_date), "do MMMM yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Timing:</strong> {classItem.timing}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Subject:</strong> {classItem.subject}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Fee:</strong> ₹{classItem.fee}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Teacher Name:</strong> {classItem.teacher_name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(classItem)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(classItem.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LiveClassesSection;