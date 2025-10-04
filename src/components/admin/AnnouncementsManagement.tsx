import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Image, Video } from "lucide-react";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  batch: string | null;
  created_at: string;
}

export default function AnnouncementsManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "none">("none");
  const [batch, setBatch] = useState("");
  const [batches, setBatches] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("students")
      .select("batch")
      .eq("user_id", user.id);

    if (data) {
      const uniqueBatches = [...new Set(data.map(s => s.batch).filter(Boolean))] as string[];
      setBatches(uniqueBatches);
    }
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive",
      });
    } else {
      setAnnouncements(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("announcements").insert({
      user_id: user.id,
      title,
      content,
      media_url: mediaUrl || null,
      media_type: mediaType,
      batch: batch || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Announcement created successfully",
      });
      setTitle("");
      setContent("");
      setMediaUrl("");
      setMediaType("none");
      setBatch("");
      fetchAnnouncements();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
      fetchAnnouncements();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Announcement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter announcement content"
                required
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="batch">Batch (Optional)</Label>
              <Select value={batch} onValueChange={setBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select batch or leave for all" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Batches</SelectItem>
                  {batches.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mediaType">Media Type</Label>
              <Select value={mediaType} onValueChange={(value) => setMediaType(value as "image" | "video" | "none")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Media</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mediaType !== "none" && (
              <div>
                <Label htmlFor="mediaUrl">Media URL</Label>
                <Input
                  id="mediaUrl"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={`Enter ${mediaType} URL`}
                />
              </div>
            )}

            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Announcements</h3>
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No announcements yet. Create your first one above!
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{announcement.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(announcement.created_at), "PPP")}
                      {announcement.batch && ` • Batch: ${announcement.batch}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <p className="text-sm mb-4 whitespace-pre-wrap">{announcement.content}</p>

                {announcement.media_url && announcement.media_type === "image" && (
                  <div className="mt-4">
                    <img
                      src={announcement.media_url}
                      alt={announcement.title}
                      className="rounded-lg max-w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                )}

                {announcement.media_url && announcement.media_type === "video" && (
                  <div className="mt-4">
                    <video
                      controls
                      className="rounded-lg max-w-full h-auto max-h-96"
                      src={announcement.media_url}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
