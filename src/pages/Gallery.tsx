import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import turfBg from "@/assets/turf-bg.jpg";
import poolBg from "@/assets/pool-bg.jpg";
import cafeBg from "@/assets/cafe-bg.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import gymBg from "@/assets/gym-bg.jpg";

const categories = ["All", "Turf", "Pool", "Café", "Events"];

const galleryImages = [
  { src: turfBg, category: "Turf", title: "Night Turf Session" },
  { src: poolBg, category: "Pool", title: "Indoor Pool" },
  { src: cafeBg, category: "Café", title: "Fitness Café" },
  { src: heroBg, category: "Events", title: "Championship Night" },
  { src: gymBg, category: "Events", title: "Gym Preview" },
  { src: turfBg, category: "Turf", title: "Football Match" },
  { src: poolBg, category: "Pool", title: "Swimming Coaching" },
  { src: cafeBg, category: "Café", title: "Smoothie Bar" },
];

const Gallery = () => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? galleryImages : galleryImages.filter((i) => i.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gallery - Look Inside our Facilities"
        description="See pictures of our premium sports turf, world-class swimming pool, and fitness café. Take a virtual tour of the ultimate sports destination."
        keywords="Sports Facility Gallery, Turf Photos, Swimming Pool Photos, Vikram Jadhav Images"
      />
      <Navbar />

      <section className="pt-24 section-padding">
        <div className="container mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl text-center text-primary text-glow mb-10"
          >
            Gallery
          </motion.h1>

          {/* Filters */}
          <div className="flex justify-center flex-wrap gap-3 mb-10">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${filter === c
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((img, i) => (
              <motion.div
                key={`${img.title}-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="relative group rounded-lg overflow-hidden aspect-video"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-colors flex items-end">
                  <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-xs text-primary font-medium">{img.category}</span>
                    <h3 className="text-foreground font-display text-lg">{img.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
