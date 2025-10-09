import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
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

export default function NotificationDropdown() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setAnnouncements(data);
      setUnreadCount(data.length);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">{unreadCount}</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-xs text-muted-foreground">
            {unreadCount} new announcements
          </p>
        </div>
        <ScrollArea className="h-[400px]">
          {announcements.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No announcements yet
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {announcement.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {announcement.content}
                      </p>
                      {announcement.batch && (
                        <span className="inline-block mt-1.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {announcement.batch}
                        </span>
                      )}
                      {announcement.media_url && announcement.media_type === "image" && (
                        <img
                          src={announcement.media_url}
                          alt={announcement.title}
                          className="mt-2 rounded max-h-32 w-full object-cover"
                        />
                      )}
                      {announcement.media_url && announcement.media_type === "video" && (
                        <video
                          src={announcement.media_url}
                          controls
                          className="mt-2 rounded max-h-32 w-full"
                        />
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(announcement.created_at), "PPp")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
