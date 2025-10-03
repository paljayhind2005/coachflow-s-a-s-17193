import { useState, useEffect } from "react";
import { MessageCircle, Users, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WhatsAppSettings = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappGroupLink, setWhatsappGroupLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('whatsapp_number, whatsapp_group_link')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setWhatsappNumber(data.whatsapp_number || "");
        setWhatsappGroupLink(data.whatsapp_group_link || "");
      }
    } catch (error: any) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({
          whatsapp_number: whatsappNumber || null,
          whatsapp_group_link: whatsappGroupLink || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "WhatsApp settings updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendStudentIdViaWhatsApp = (studentId: string, studentName: string) => {
    if (!whatsappNumber) {
      toast({
        title: "Error",
        description: "Please configure your WhatsApp number first",
        variant: "destructive",
      });
      return;
    }

    const message = `Hello! Your unique student ID is: ${studentId}\n\nStudent Name: ${studentName}\n\nPlease keep this ID safe for future reference.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">WhatsApp Integration</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              WhatsApp Number
            </CardTitle>
            <CardDescription>
              Configure your coaching institute's WhatsApp number for sending student IDs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp Number (with country code)</Label>
              <Input
                id="whatsapp_number"
                placeholder="+919876543210"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Include country code (e.g., +91 for India)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              WhatsApp Community
            </CardTitle>
            <CardDescription>
              Share your WhatsApp group link with students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp_group">WhatsApp Group Link</Label>
              <Input
                id="whatsapp_group"
                placeholder="https://chat.whatsapp.com/..."
                value={whatsappGroupLink}
                onChange={(e) => setWhatsappGroupLink(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Students can join your coaching community
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>

        {whatsappGroupLink && (
          <Button
            variant="outline"
            onClick={() => window.open(whatsappGroupLink, '_blank')}
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Open Community Link
          </Button>
        )}
      </div>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">How to use WhatsApp Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-2">
            <span className="font-semibold min-w-[20px]">1.</span>
            <p>Configure your WhatsApp number above to enable automatic student ID sharing</p>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold min-w-[20px]">2.</span>
            <p>When you add a new student, you can send their unique ID via WhatsApp</p>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold min-w-[20px]">3.</span>
            <p>Share the WhatsApp group link with students to create a community</p>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold min-w-[20px]">4.</span>
            <p>Students can search their ID on the home page using the public search</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppSettings;