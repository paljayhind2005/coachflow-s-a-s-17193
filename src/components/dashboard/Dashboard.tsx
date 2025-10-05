import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Users, 
  IndianRupee, 
  AlertCircle, 
  TrendingUp,
  Calendar,
  BookOpen,
  CreditCard,
  Megaphone,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
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

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    if (data) {
      setAnnouncements(data);
    }
  };

  // Mock data - In real app, this would come from API
  const stats = [
    {
      title: "Total Students",
      value: "248",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "bg-primary"
    },
    {
      title: "Monthly Revenue",
      value: "₹1,24,500",
      change: "+8%",
      changeType: "positive", 
      icon: IndianRupee,
      color: "bg-success"
    },
    {
      title: "Pending Dues",
      value: "₹18,750",
      change: "-5%",
      changeType: "negative",
      icon: AlertCircle,
      color: "bg-warning"
    },
    {
      title: "Active Batches",
      value: "12",
      change: "+2",
      changeType: "positive",
      icon: BookOpen,
      color: "bg-accent"
    }
  ];

  const revenueData = [
    { month: "Jan", revenue: 85000, students: 220 },
    { month: "Feb", revenue: 92000, students: 235 },
    { month: "Mar", revenue: 98000, students: 242 },
    { month: "Apr", revenue: 110000, students: 248 },
    { month: "May", revenue: 124500, students: 248 },
  ];

  const batchData = [
    { name: "Math JEE", students: 45, revenue: 45000 },
    { name: "Physics NEET", students: 38, revenue: 38000 },
    { name: "Chemistry JEE", students: 42, revenue: 42000 },
    { name: "Biology NEET", students: 35, revenue: 35000 },
    { name: "Math Class XII", students: 28, revenue: 28000 },
  ];

  const upcomingDues = [
    { name: "Rahul Sharma", batch: "Math JEE", amount: 2500, dueDate: "2024-01-15", urgent: true },
    { name: "Priya Patel", batch: "Physics NEET", amount: 3000, dueDate: "2024-01-16", urgent: true },
    { name: "Arun Kumar", batch: "Chemistry JEE", amount: 2800, dueDate: "2024-01-18", urgent: false },
    { name: "Sneha Gupta", batch: "Biology NEET", amount: 3200, dueDate: "2024-01-20", urgent: false },
  ];

  const latestAnnouncement = announcements[0];

  return (
    <div className="space-y-8">
      {/* Announcement Bar */}
      {latestAnnouncement && showAnnouncementBar && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-primary rounded-xl shadow-elegant overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="bg-white/20 p-2.5 rounded-lg flex-shrink-0">
                <Megaphone className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                  {latestAnnouncement.title}
                </h3>
                <p className="text-white/90 text-xs sm:text-sm line-clamp-1">
                  {latestAnnouncement.content}
                </p>
                {latestAnnouncement.batch && (
                  <span className="inline-block mt-1.5 text-xs bg-white/20 text-white px-2 py-0.5 rounded">
                    Batch: {latestAnnouncement.batch}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 flex-shrink-0"
              onClick={() => setShowAnnouncementBar(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at your institute today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className={`h-4 w-4 mr-1 ${
                        stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
                      }`} />
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs sm:text-sm font-medium ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl shadow-soft`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gradient-card border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-foreground">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Batch Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-gradient-card border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-foreground">Batch Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={batchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="students" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-card border-border/50 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Latest Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    className="p-4 bg-background/50 rounded-xl border border-border/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-foreground">{announcement.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(announcement.created_at), "MMM dd")}
                      </span>
                    </div>
                    {announcement.batch && (
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {announcement.batch}
                      </Badge>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {announcement.content}
                    </p>
                    {announcement.media_url && announcement.media_type === "image" && (
                      <div className="mt-3">
                        <img
                          src={announcement.media_url}
                          alt={announcement.title}
                          className="rounded-lg max-w-full h-auto max-h-48 object-cover"
                        />
                      </div>
                    )}
                    {announcement.media_url && announcement.media_type === "video" && (
                      <div className="mt-3">
                        <video
                          controls
                          className="rounded-lg max-w-full h-auto max-h-48"
                          src={announcement.media_url}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upcoming Dues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="bg-gradient-card border-border/50 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Upcoming Due Payments
            </CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDues.map((due, index) => (
                <motion.div
                  key={due.name}
                  className="flex items-center justify-between p-3 sm:p-4 bg-background/50 rounded-xl border border-border/30 gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm sm:text-base truncate">{due.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{due.batch}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-foreground text-sm sm:text-base">₹{due.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-1 sm:gap-2 justify-end">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      <span className="text-xs sm:text-sm text-muted-foreground">{due.dueDate}</span>
                      {due.urgent && (
                        <Badge variant="destructive" className="text-xs ml-1 sm:ml-2">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;