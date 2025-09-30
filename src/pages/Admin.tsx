import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard, 
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Dashboard from "@/components/dashboard/Dashboard";
import StudentsManagement from "@/components/admin/StudentsManagement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUserEmail(session.user.email || "");
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "batches", label: "Batches", icon: BookOpen },
    { id: "fees", label: "Fee Management", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "students":
        return <StudentsManagement />;
      case "batches":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Batch Management</h2>
            <p className="text-muted-foreground">Batch management features coming soon...</p>
          </div>
        );
      case "fees":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Fee Management</h2>
            <p className="text-muted-foreground">Fee management features coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-muted-foreground">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-medium transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:static lg:inset-0`}
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">OkFees</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
          
          <motion.button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted mt-4 border-t border-border pt-6"
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </nav>
      </motion.div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <motion.header
          className="bg-card border-b border-border px-6 py-4 shadow-soft"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="relative max-w-48 lg:max-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">3</span>
                </div>
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {userEmail.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main
          className="flex-1 p-4 sm:p-6 bg-muted/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {renderContent()}
        </motion.main>
      </div>
    </div>
  );
};

export default Admin;