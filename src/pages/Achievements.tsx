import { motion } from "framer-motion";
import { Trophy, Flag, Dumbbell, Users, Star, Award, Heart, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import vikramPhoto from "@/assets/vikram-jadhav.jpeg";

const achievements = [
  { icon: Trophy, title: "Mr. India 2019", desc: "Won the prestigious Mr. India bodybuilding championship, proving world-class physique and discipline.", year: "2019" },
  { icon: Flag, title: "Official Fit India Ambassador", desc: "Appointed by the Government of India to promote fitness and healthy lifestyle across the nation.", year: "2020" },
  { icon: Star, title: "Youth Icon of Maharashtra", desc: "Honored as Youth Icon of Maharashtra for inspiring youth toward fitness and sports.", year: "2022" },
  { icon: Award, title: "Youth Icon of India", desc: "Recognized nationally as Youth Icon of India for impact in fitness, discipline, and transformation coaching.", year: "2023" },
  { icon: Dumbbell, title: "Celebrity & International Fitness Coach", desc: "Coached celebrity clients and trained athletes internationally with proven transformation programs.", year: "2018–Present" },
  { icon: Users, title: "Founder – VJ Army", desc: "Built a community of thousands of fitness enthusiasts, athletes, and sports lovers under the VJ Army brand.", year: "2021" },
  { icon: Award, title: "State-Level Champion", desc: "Multiple state-level bodybuilding championships across Maharashtra before the national title.", year: "2015–2018" },
];

const aboutPoints = [
  { icon: Heart, title: "Passion for Fitness", desc: "Vikram's journey began with a deep love for sports and fitness from a young age in Aurangabad, Maharashtra." },
  { icon: Target, title: "Vision & Mission", desc: "To build a world-class sports & wellness destination accessible to everyone — from beginners to professional athletes." },
  { icon: Users, title: "Community Builder", desc: "Through VJ Army, Vikram has created a thriving community that promotes discipline, health, and sportsmanship." },
];

const Achievements = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* About Section */}
    <section className="pt-24 section-padding">
      <div className="container mx-auto max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl text-center text-primary text-glow mb-4"
        >
          About Vikram Jadhav
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto"
        >
          From a small-town dreamer to Mr. India — the story of grit, discipline, and an unbreakable will.
        </motion.p>

        <div className="flex flex-col lg:flex-row items-center gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="shrink-0"
          >
            <div className="w-64 h-72 sm:w-72 sm:h-80 rounded-2xl overflow-hidden neon-border">
              <img src={vikramPhoto} alt="Vikram Jadhav" className="w-full h-full object-cover object-top" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="font-display text-3xl text-foreground mb-4">The Man Behind VJ Army</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vikram Jadhav is a nationally acclaimed bodybuilder, fitness coach, and entrepreneur from Aurangabad (Chhatrapati Sambhajinagar), Maharashtra. After winning the coveted <span className="text-primary font-semibold">Mr. India 2019</span> title, he dedicated his life to building a premium sports and wellness ecosystem for his community.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              As an <span className="text-primary font-semibold">Official Fit India Ambassador</span>, Vikram actively promotes fitness across the nation. His vision materialized as VJ Army — a state-of-the-art facility featuring sports turfs, a swimming pool, a café, and an upcoming world-class gym.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {aboutPoints.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-lg p-4"
                >
                  <p.icon className="w-5 h-5 text-accent mb-2" />
                  <h4 className="font-display text-sm text-foreground mb-1">{p.title}</h4>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Achievements Timeline */}
    <section className="section-padding bg-card">
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl text-center text-primary text-glow mb-4"
        >
          Achievements
        </motion.h2>
        <p className="text-center text-muted-foreground mb-14">
          Milestones in Vikram's journey of excellence.
        </p>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-8">
            {achievements.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 md:ml-6"
              >
                <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/30 items-center justify-center -ml-6 z-10">
                  <a.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="glass rounded-lg p-6 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-1 rounded">{a.year}</span>
                    <h3 className="font-display text-xl text-foreground">{a.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Achievements;
