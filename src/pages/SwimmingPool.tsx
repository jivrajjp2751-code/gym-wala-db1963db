import { motion } from "framer-motion";
import { Waves, Clock, Shield, Users, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import poolBg from "@/assets/pool-bg.jpg";

const features = [
  { icon: Waves, title: "Olympic-Standard Pool", desc: "25m heated pool with crystal-clear filtered water." },
  { icon: Shield, title: "Safety & Hygiene", desc: "UV-treated water, lifeguards on duty, regular sanitation." },
  { icon: Users, title: "Coaching Available", desc: "Certified coaches for beginners, intermediate & advanced swimmers." },
  { icon: Clock, title: "Flexible Timings", desc: "Open 6 AM – 9 PM, 7 days a week." },
];

const ageCategories = [
  { age: "Kids (5–12 yrs)", timing: "7:00 AM – 9:00 AM", note: "With parental supervision" },
  { age: "Teens (13–17 yrs)", timing: "9:00 AM – 11:00 AM", note: "Group coaching available" },
  { age: "Adults (18+)", timing: "6:00 AM – 9:00 PM", note: "All sessions open" },
  { age: "Ladies Only", timing: "3:00 PM – 5:00 PM", note: "Female coach available" },
];

const SwimmingPool = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="relative h-[50vh] flex items-center justify-center">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${poolBg})` }} />
      <div className="absolute inset-0 bg-background/25" />
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl sm:text-6xl text-primary text-glow"
        >
          Swimming Pool
        </motion.h1>
        <p className="text-muted-foreground mt-2">Dive into wellness. Every stroke counts.</p>
      </div>
    </section>

    {/* Features */}
    <section className="section-padding">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-lg p-6"
            >
              <f.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-display text-xl text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Age categories */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-lg p-6 mb-16"
        >
          <h2 className="font-display text-3xl text-foreground mb-6">Timings by Age</h2>
          <div className="space-y-4">
            {ageCategories.map((c) => (
              <div key={c.age} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <span className="font-medium text-foreground">{c.age}</span>
                  <span className="text-xs text-muted-foreground ml-2">({c.note})</span>
                </div>
                <span className="text-primary font-medium text-sm">{c.timing}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="font-display text-2xl text-foreground mb-4">Interested? Get in touch!</h3>
          <Button variant="hero" size="lg" asChild>
            <a href="/contact">
              <Phone className="w-4 h-4 mr-2" /> Contact Us
            </a>
          </Button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default SwimmingPool;
