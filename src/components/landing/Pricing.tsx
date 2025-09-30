import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "Forever",
      description: "Perfect for small coaching institutes",
      features: [
        "Up to 50 students",
        "2 batches",
        "Basic fee tracking",
        "Simple dashboard",
        "Email support"
      ],
      cta: "Start Free",
      popular: false,
      href: "/register"
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "Best for growing coaching institutes",
      features: [
        "Up to 500 students",
        "Unlimited batches",
        "Advanced fee management",
        "Detailed analytics",
        "Payment reminders",
        "Priority support",
        "Export reports"
      ],
      cta: "Start Free Trial",
      popular: true,
      href: "/register"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For large coaching institutes",
      features: [
        "Unlimited students",
        "Unlimited batches",
        "Advanced analytics",
        "Custom integrations",
        "Multi-location support",
        "24/7 phone support",
        "Custom training"
      ],
      cta: "Contact Sales",
      popular: false,
      href: "/register"
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core features with no setup fees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <Card className={`h-full transition-all duration-300 hover:shadow-glow ${
                plan.popular 
                  ? 'border-primary/50 shadow-soft bg-gradient-to-br from-white to-primary/5' 
                  : 'hover:border-primary/30'
              }`}>
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">
                      {plan.price}
                    </span>
                    {plan.period !== "Forever" && (
                      <span className="text-muted-foreground">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  {plan.period === "Forever" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      No credit card required
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0 px-4 sm:px-6">
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-foreground text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full text-sm sm:text-base ${
                      plan.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft'
                        : 'variant-outline'
                    }`}
                    size="lg"
                    asChild
                  >
                    <Link to={plan.href}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4 text-sm sm:text-base text-center px-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-muted-foreground text-center px-4">
            Need a custom solution? 
            <Link to="/register" className="text-primary hover:underline ml-1">
              Contact our sales team
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;