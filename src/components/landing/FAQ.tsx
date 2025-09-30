import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How quickly can I set up my institute on the platform?",
      answer: "You can get started in under 10 minutes! Simply sign up, add your institute details, create batches, and start adding students. Our intuitive setup wizard guides you through each step."
    },
    {
      question: "Is my data secure and backed up?",
      answer: "Absolutely! We use bank-grade encryption, secure cloud storage, and perform daily automated backups. Your data is protected with multiple layers of security and is always accessible when you need it."
    },
    {
      question: "Can I manage multiple batches and subjects?",
      answer: "Yes! Create unlimited batches for different subjects, timings, and fee structures. You can easily assign students to batches and track their progress individually or by batch."
    },
    {
      question: "How does the fee management system work?",
      answer: "Record payments instantly, generate receipts, track pending dues, and set up automated reminders. The system calculates outstanding amounts and provides detailed fee history for each student."
    },
    {
      question: "Can I access the platform on my mobile phone?",
      answer: "Yes! Our platform is fully responsive and works seamlessly on all devices - desktop, tablet, and mobile. Access your institute data anytime, anywhere."
    },
    {
      question: "What kind of reports can I generate?",
      answer: "Generate comprehensive reports including student performance, fee collection summaries, batch-wise analytics, revenue trends, and custom reports based on date ranges and specific criteria."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required. Experience the platform risk-free and see how it transforms your institute management."
    },
    {
      question: "Do you provide customer support?",
      answer: "We provide 24/7 customer support via chat, email, and phone. Our dedicated support team helps with setup, training, and any questions you might have. We also offer free onboarding sessions."
    }
  ];

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
            Frequently Asked 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about our platform.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="w-full text-left p-4 sm:p-6 bg-card rounded-2xl border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    {openIndex === index ? (
                      <Minus className="h-5 w-5 text-primary" />
                    ) : (
                      <Plus className="h-5 w-5 text-primary" />
                    )}
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-border/50 mt-4">
                        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-card p-6 sm:p-8 rounded-2xl border border-border/50 shadow-soft max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Our support team is here to help you get started. Contact us for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-primary text-primary-foreground px-4 sm:px-6 py-3 rounded-xl font-semibold shadow-soft hover:shadow-medium transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
              </motion.button>
              <motion.button
                className="border border-border text-foreground px-4 sm:px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;