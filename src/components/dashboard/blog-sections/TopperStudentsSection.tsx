import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TopperStudent {
  id: string;
  name: string;
  class: string;
  marks: string;
  image_url: string | null;
}

const TopperStudentsSection = () => {
  const [students, setStudents] = useState<TopperStudent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<TopperStudent | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    marks: "",
    image_url: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("topper_students")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching topper students:", error);
      return;
    }

    setStudents(data || []);
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check limit of 10 students
      if (!editingStudent && students.length >= 10) {
        toast({
          title: "Limit Reached",
          description: "You can only add up to 10 topper students",
          variant: "destructive",
        });
        return;
      }

      if (editingStudent) {
        const { error } = await supabase
          .from("topper_students")
          .update(formData)
          .eq("id", editingStudent.id);

        if (error) throw error;
        toast({ title: "Success", description: "Student updated successfully" });
      } else {
        const { error } = await supabase
          .from("topper_students")
          .insert([{ ...formData, user_id: user.id }]);

        if (error) throw error;
        toast({ title: "Success", description: "Student added successfully" });
      }

      setIsDialogOpen(false);
      setEditingStudent(null);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      toast({
        title: "Error",
        description: "Failed to save student",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("topper_students")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Student deleted successfully" });
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      class: "",
      marks: "",
      image_url: "",
    });
  };

  const openEditDialog = (student: TopperStudent) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      class: student.class,
      marks: student.marks,
      image_url: student.image_url || "",
    });
    setIsDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Topper Students (Max 10)</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingStudent(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2" disabled={students.length >= 10 && !editingStudent}>
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingStudent ? "Edit Student" : "Add Topper Student"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Student Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  placeholder="Class (e.g., 12th)"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                />
                <Input
                  placeholder="Marks (e.g., 95%)"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                />
                <Input
                  placeholder="Image URL (optional)"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
                <Button onClick={handleSubmit} className="w-full">
                  {editingStudent ? "Update" : "Add"} Student
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {students.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 col-span-full">
                No topper students added yet. Click "Add Student" to create one.
              </p>
            ) : (
              students.map((student) => (
                <div
                  key={student.id}
                  className="relative border border-border rounded-lg p-3 text-center group"
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-6 w-6 p-0"
                      onClick={() => openEditDialog(student)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0"
                      onClick={() => handleDelete(student.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="w-20 h-20 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    {student.image_url ? (
                      <img
                        src={student.image_url}
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">🎓</span>
                    )}
                  </div>
                  <div className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded mb-1">
                    {student.marks}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{student.name}</h4>
                  <p className="text-xs text-muted-foreground">Class: {student.class}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TopperStudentsSection;