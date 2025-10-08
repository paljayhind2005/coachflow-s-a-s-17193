import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Edit, Save, Phone, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InstituteInfo {
  id: string;
  name: string;
  location: string;
  description: string;
  teacher_names: string;
  map_link: string;
  hero_image_url: string;
}

interface Props {
  instituteInfo: InstituteInfo | null;
  onUpdate: () => void;
}

const InstituteHeader = ({ instituteInfo, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: instituteInfo?.name || "",
    location: instituteInfo?.location || "",
    description: instituteInfo?.description || "",
    teacher_names: instituteInfo?.teacher_names || "",
    map_link: instituteInfo?.map_link || "",
    hero_image_url: instituteInfo?.hero_image_url || "",
  });
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("institute_info")
        .update(formData)
        .eq("id", instituteInfo?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Institute information updated successfully",
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating institute info:", error);
      toast({
        title: "Error",
        description: "Failed to update institute information",
        variant: "destructive",
      });
    }
  };

  if (!instituteInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden bg-gradient-card shadow-elegant">
        <div className="bg-gradient-primary p-6 text-center relative">
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-4 right-4"
            onClick={() => isEditing ? handleSave() : setIsEditing(!isEditing)}
          >
            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? "Save" : "Edit"}
          </Button>

          {isEditing ? (
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-center text-2xl font-bold bg-white/20 text-white border-white/30 mb-4"
              placeholder="Institute Name"
            />
          ) : (
            <h1 className="text-3xl font-bold text-white mb-2">{instituteInfo.name}</h1>
          )}

          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-white/90" />
            {isEditing ? (
              <div className="flex-1 max-w-2xl">
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-white/20 text-white border-white/30 text-sm"
                  placeholder="Location"
                />
              </div>
            ) : (
              <p className="text-white/90 text-sm">{instituteInfo.location}</p>
            )}
          </div>

          {isEditing && (
            <Input
              value={formData.map_link}
              onChange={(e) => setFormData({ ...formData, map_link: e.target.value })}
              className="bg-white/20 text-white border-white/30 mb-4"
              placeholder="Google Maps Link"
            />
          )}

          <div className="flex gap-4 justify-center">
            <Button variant="secondary" size="sm" className="gap-2">
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              SMS
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Teacher Names:</h3>
            {isEditing ? (
              <Input
                value={formData.teacher_names}
                onChange={(e) => setFormData({ ...formData, teacher_names: e.target.value })}
                placeholder="Comma-separated teacher names"
              />
            ) : (
              <p className="text-muted-foreground">{instituteInfo.teacher_names}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Description:</h3>
            {isEditing ? (
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={8}
                placeholder="Institute description"
              />
            ) : (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {instituteInfo.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InstituteHeader;