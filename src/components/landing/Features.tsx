import { motion } from "framer-motion";
import { 
  Users, 
  CreditCard, 
  BarChart3, 
  Bell, 
  Shield, 
  Smartphone,
  Clock,
  FileText
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Comprehensive student profiles with batch assignments, contact details, and academic tracking.",
      color: "bg-primary"
    },
    {
      icon: CreditCard,
      title: "Fee Management",
      description: "Track payments, generate receipts, and manage dues with automated reminders.",
      color: "bg-success"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights into revenue, student performance, and institute growth metrics.",
      color: "bg-warning"
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Automated alerts for fee dues, batch schedules, and important deadlines.",
      color: "bg-accent"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-grade security with data encryption and regular backups for peace of mind.",
      color: "bg-primary-dark"
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Access your institute data anywhere, anytime with our fully responsive design.",
      color: "bg-success"
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Monitor class schedules, attendance, and optimize your institute's operations.",
      color: "bg-warning"
    },
    {
      icon: FileText,
      title: "Report Generation",
      description: "Generate detailed reports for students, fees, and performance analytics instantly.",
      color: "bg-accent"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful features designed specifically for coaching institutes to streamline operations and accelerate growth.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "var(--shadow-medium)"
              }}
              className="bg-gradient-card p-6 sm:p-8 rounded-2xl border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-soft`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-hero p-6 sm:p-8 rounded-2xl shadow-strong">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to transform your institute?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Join thousands of coaching institutes already using our platform to grow their business.
            </p>
            <motion.button
              className="bg-white text-primary px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-medium hover:shadow-strong transition-all duration-300 text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;