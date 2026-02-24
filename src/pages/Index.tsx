import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Flag, Dumbbell, Users, Instagram, ChevronDown, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import heroBg from "@/assets/hero-bg.jpg";
import turfBg from "@/assets/turf-bg.jpg";
import poolBg from "@/assets/pool-bg.jpg";
import cafeBg from "@/assets/cafe-bg.jpg";
import gymBg from "@/assets/gym-bg.jpg";
import vikramPhoto from "@/assets/vikram-jadhav.jpeg";

const achievements = [
  { icon: Trophy, label: "Mr. India 2019 🏆" },
  { icon: Star, label: "Youth Icon of Maharashtra 2022" },
  { icon: Award, label: "Youth Icon of India 2023" },
  { icon: Flag, label: "Official Fit India Ambassador 🇮🇳" },
  { icon: Dumbbell, label: "Celebrity & International Fitness Coach" },
];

const facilities = [
  { title: "Sports Turf", desc: "Book premium turf slots for Football, Cricket & more.", img: turfBg, to: "/turf", cta: "Book Turf" },
  { title: "Swimming Pool", desc: "World-class swimming pool with coaching for all ages.", img: poolBg, to: "/swimming-pool", cta: "View Pool" },
  { title: "Café", desc: "Relax with great food, coffee & refreshments after your game.", img: cafeBg, to: "/cafe", cta: "Visit Café" },
  { title: "Gym — Coming Soon", desc: "A state-of-the-art gym is on its way. Stay tuned!", img: gymBg, to: "/gym", cta: "Coming Soon" },
];


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Vikram Jadhav - Sports Turf, Swimming Pool & Café"
        description="Experience premium sports at Vikram Jadhav's destination. Quality sports turf, world-class swimming pool, and gourmet café. Led by Mr. India 2019."
        keywords="Vikram Jadhav, Sports Turf, Swimming Pool, Cafe, Fitness, Mr India 2019"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        {/* Lighter overlay so the hero stays crisp */}
        <div className="absolute inset-0 bg-background/35" />
        <div className="relative z-10 w-full px-4 py-32">
          <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="shrink-0"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden neon-border"
              >
                <img src={vikramPhoto} alt="Vikram Jadhav - Mr. India 2019" className="w-full h-full object-cover object-top" />
              </motion.div>
            </motion.div>

            <div className="text-center lg:text-left">
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-wide text-glow text-primary mb-2">
                <motion.span animate={{ textShadow: ["0 0 20px hsl(var(--primary) / 0.3)", "0 0 40px hsl(var(--primary) / 0.6)", "0 0 20px hsl(var(--primary) / 0.3)"] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>Vikram Jadhav</motion.span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="font-display text-2xl sm:text-3xl text-foreground mb-2">
                Play. Swim. Fuel Your Fitness.
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="text-lg text-muted-foreground mb-6">
                A premium sports destination led by Mr. India 2019.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                {achievements.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-foreground"
                  >
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}>
                      <a.icon className="w-4 h-4 text-accent" />
                    </motion.div>
                    <span>{a.label}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="flex flex-wrap justify-center lg:justify-start gap-3">
                <Button variant="hero" size="lg" asChild><Link to="/turf">Book Turf</Link></Button>
                <Button variant="hero" size="lg" asChild><Link to="/swimming-pool">View Swimming Pool</Link></Button>
                <Button variant="hero" size="lg" asChild><Link to="/cafe">Visit Café</Link></Button>
                <Button variant="hero" size="lg" asChild><Link to="/gym">Gym Coming Soon</Link></Button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={() => { const w = window.top || window; w.open("https://www.instagram.com/vikram_official", "_blank", "noopener,noreferrer"); }}
                  className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm"
                >
                  <Instagram className="w-5 h-5" /> @vikram_official
                </button>
                <button
                  onClick={() => { const w = window.top || window; w.open("https://wa.me/917020818586", "_blank", "noopener,noreferrer"); }}
                  className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  WhatsApp
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="w-8 h-8 text-primary" />
          </motion.div>
        </motion.div>
      </section>


      {/* Facilities - Scroll Storytelling */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl text-center mb-4 text-foreground"
          >
            Our Facilities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-muted-foreground mb-14 max-w-xl mx-auto"
          >
            Everything you need for sports, fitness & wellness under one roof.
          </motion.p>

          <div className="space-y-8">
            {facilities.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                className="relative rounded-xl overflow-hidden group h-80"
              >
                <motion.div
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 6 + i * 2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${f.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
                <div className="relative z-10 h-full flex flex-col justify-center p-8 max-w-lg">
                  <h3 className="font-display text-4xl text-white mb-3" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>{f.title}</h3>
                  <p className="text-white/85 mb-6" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{f.desc}</p>
                  <Button variant="hero" size="lg" asChild className="w-fit">
                    <Link to={f.to}>{f.cta}</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Motivational Quote */}
      <section className="section-padding text-center bg-card overflow-hidden">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.blockquote
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="font-display text-3xl sm:text-5xl text-primary text-glow leading-tight"
            >
              "Champions are not born. They are made through discipline, sweat, and an unbreakable will."
            </motion.blockquote>
            <p className="mt-6 text-muted-foreground text-lg">— Vikram Jadhav</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
