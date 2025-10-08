import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
}

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Error fetching events:", error);
      return;
    }

    setEvents(data || []);
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check limit of 6 events
      if (!editingEvent && events.length >= 6) {
        toast({
          title: "Limit Reached",
          description: "You can only add up to 6 events",
          variant: "destructive",
        });
        return;
      }

      if (editingEvent) {
        const { error } = await supabase
          .from("events")
          .update(formData)
          .eq("id", editingEvent.id);

        if (error) throw error;
        toast({ title: "Success", description: "Event updated successfully" });
      } else {
        const { error } = await supabase
          .from("events")
          .insert([{ ...formData, user_id: user.id }]);

        if (error) throw error;
        toast({ title: "Success", description: "Event added successfully" });
      }

      setIsDialogOpen(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Event deleted successfully" });
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
    });
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      image_url: event.image_url || "",
    });
    setIsDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Events (Max 6)</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingEvent(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2" disabled={events.length >= 6 && !editingEvent}>
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Event Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Textarea
                  placeholder="Event Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
                <Input
                  placeholder="Image URL (optional)"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
                <Button onClick={handleSubmit} className="w-full">
                  {editingEvent ? "Update" : "Add"} Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 col-span-full">
                No events added yet. Click "Add Event" to create one.
              </p>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="relative border border-border rounded-lg overflow-hidden group"
                >
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => openEditDialog(event)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-muted flex items-center justify-center">
                      <span className="text-4xl">📅</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">{event.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {event.description}
                    </p>
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

export default EventsSection;