import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Director, Excel Mathematics Academy",
      location: "Mumbai, India", 
      content: "This platform revolutionized how we manage our 500+ students. Fee tracking is now effortless, and the analytics help us make better decisions. Our revenue increased by 40% in just 6 months!",
      rating: 5,
      image: "/api/placeholder/64/64"
    },
    {
      name: "Priya Sharma",
      role: "Founder, Success Science Institute",
      location: "Delhi, India",
      content: "The student management system is incredibly intuitive. We can track each student's progress, manage batches efficiently, and the automated reminders have reduced payment delays by 80%.",
      rating: 5,
      image: "/api/placeholder/64/64"
    },
    {
      name: "Mohammed Hassan",
      role: "Owner, Career Plus Coaching",
      location: "Bangalore, India",
      content: "As someone who struggled with manual record-keeping, this SaaS solution is a game-changer. The dashboard gives me real-time insights, and I can access everything from my mobile. Highly recommended!",
      rating: 5,
      image: "/api/placeholder/64/64"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            What Our Clients 
            <span className="bg-gradient-success bg-clip-text text-transparent"> Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of satisfied coaching institute owners who have transformed their business with our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-card p-6 sm:p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-medium transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "var(--shadow-medium)"
              }}
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary mb-4 opacity-60" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-primary">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground text-xs sm:text-sm">Happy Institutes</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-success mb-2">10,000+</div>
              <div className="text-muted-foreground text-xs sm:text-sm">Students Managed</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-warning mb-2">₹50Cr+</div>  
              <div className="text-muted-foreground text-xs sm:text-sm">Fees Processed</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-muted-foreground text-xs sm:text-sm">Uptime</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;