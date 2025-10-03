import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StudentSearch from "./StudentSearch";
import { MessageCircle } from "lucide-react";

interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  batch: string | null;
  fee_amount: number | null;
  fee_paid: number | null;
  status: string | null;
  enrollment_date: string | null;
}

const StudentsManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    batch: "",
    fee_amount: "",
    fee_paid: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from('students').insert({
        user_id: user.id,
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        batch: formData.batch || null,
        fee_amount: formData.fee_amount ? parseFloat(formData.fee_amount) : null,
        fee_paid: formData.fee_paid ? parseFloat(formData.fee_paid) : 0,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student added successfully with a unique ID",
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchStudents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          batch: formData.batch || null,
          fee_amount: formData.fee_amount ? parseFloat(formData.fee_amount) : null,
          fee_paid: formData.fee_paid ? parseFloat(formData.fee_paid) : 0,
        })
        .eq('id', currentStudent.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student updated successfully",
      });

      setIsEditDialogOpen(false);
      resetForm();
      fetchStudents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update student",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const { error } = await supabase.from('students').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student deleted successfully",
      });

      fetchStudents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (student: Student) => {
    setCurrentStudent(student);
    setFormData({
      name: student.name,
      email: student.email || "",
      phone: student.phone || "",
      batch: student.batch || "",
      fee_amount: student.fee_amount?.toString() || "",
      fee_paid: student.fee_paid?.toString() || "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      batch: "",
      fee_amount: "",
      fee_paid: "",
    });
    setCurrentStudent(null);
  };

  const handleSendWhatsApp = async (student: Student) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('whatsapp_number')
        .eq('id', user.id)
        .single();

      if (!profile?.whatsapp_number) {
        toast({
          title: "WhatsApp Not Configured",
          description: "Please configure your WhatsApp number in Settings",
          variant: "destructive",
        });
        return;
      }

      const message = `Hello! Your unique student ID is: ${student.student_id}\n\nStudent Name: ${student.name}\n\nPlease keep this ID safe for future reference.`;
      const whatsappUrl = `https://wa.me/${profile.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      toast({
        title: "WhatsApp Opened",
        description: "Student ID message ready to send",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to open WhatsApp",
        variant: "destructive",
      });
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.batch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="list" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Students Management</h2>
          <TabsList>
            <TabsTrigger value="list">All Students</TabsTrigger>
            <TabsTrigger value="search">Search Student</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="search" className="space-y-6">
          <StudentSearch />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <div className="flex items-center justify-between">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Enter student details below. A unique ID will be generated automatically.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch</Label>
                    <Input
                      id="batch"
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fee_amount">Fee Amount</Label>
                      <Input
                        id="fee_amount"
                        type="number"
                        step="0.01"
                        value={formData.fee_amount}
                        onChange={(e) => setFormData({ ...formData, fee_amount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fee_paid">Fee Paid</Label>
                      <Input
                        id="fee_paid"
                        type="number"
                        step="0.01"
                        value={formData.fee_paid}
                        onChange={(e) => setFormData({ ...formData, fee_paid: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Student"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, batch or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-4">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-mono">
                            {student.student_id}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {student.email && <p>Email: {student.email}</p>}
                          {student.phone && <p>Phone: {student.phone}</p>}
                          {student.batch && <p>Batch: {student.batch}</p>}
                          {student.fee_amount && (
                            <p>
                              Fee: ₹{student.fee_paid || 0} / ₹{student.fee_amount}
                              <span className={`ml-2 ${(student.fee_paid || 0) >= student.fee_amount ? 'text-success' : 'text-warning'}`}>
                                ({Math.round(((student.fee_paid || 0) / student.fee_amount) * 100)}% paid)
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleSendWhatsApp(student)}
                          title="Send ID via WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => openEditDialog(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {filteredStudents.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No students found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update student details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditStudent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-batch">Batch</Label>
              <Input
                id="edit-batch"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-fee-amount">Fee Amount</Label>
                <Input
                  id="edit-fee-amount"
                  type="number"
                  step="0.01"
                  value={formData.fee_amount}
                  onChange={(e) => setFormData({ ...formData, fee_amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fee-paid">Fee Paid</Label>
                <Input
                  id="edit-fee-paid"
                  type="number"
                  step="0.01"
                  value={formData.fee_paid}
                  onChange={(e) => setFormData({ ...formData, fee_paid: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Student"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsManagement;