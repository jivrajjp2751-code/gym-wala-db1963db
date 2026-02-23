import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Dumbbell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import gymBg from "@/assets/gym-bg.jpg";

const GymComingSoon = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Countdown to a future date (30 days from now as placeholder)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  const countdownItems = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${gymBg})` }} />
        <div className="absolute inset-0 bg-background/25" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Dumbbell className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse-glow" />
            <h1 className="font-display text-5xl sm:text-7xl text-primary text-glow mb-4">
              Gym — Coming Soon
            </h1>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              A state-of-the-art gym by Vikram Jadhav is under construction. Get ready to transform your fitness journey.
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4 sm:gap-6 mb-12"
          >
            {countdownItems.map((item) => (
              <div key={item.label} className="glass rounded-lg p-4 min-w-[70px]">
                <div className="font-display text-3xl sm:text-4xl text-primary">{String(item.value).padStart(2, "0")}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Notify form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {submitted ? (
              <div className="glass rounded-lg p-6 inline-flex items-center gap-3 text-primary">
                <Bell className="w-5 h-5" />
                <span>You'll be notified when we launch!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
                <Button variant="hero" type="submit">
                  <Mail className="w-4 h-4 mr-2" /> Notify Me
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GymComingSoon;
