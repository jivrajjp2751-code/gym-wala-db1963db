import { motion } from "framer-motion";
import { Coffee, Leaf, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import cafeBg from "@/assets/cafe-bg.jpg";

const menuCategories = [
  {
    title: "Coffee & Tea",
    items: [
      { name: "Espresso", price: "₹99", desc: "Rich single-shot espresso" },
      { name: "Cappuccino", price: "₹149", desc: "Espresso with steamed milk foam" },
      { name: "Cold Coffee", price: "₹129", desc: "Chilled coffee with ice cream" },
      { name: "Masala Chai", price: "₹49", desc: "Traditional Indian spiced tea" },
      { name: "Green Tea", price: "₹79", desc: "Refreshing Japanese green tea" },
    ],
  },
  {
    title: "Shakes & Smoothies",
    items: [
      { name: "Mango Shake", price: "₹149", desc: "Fresh mango, milk, sugar" },
      { name: "Oreo Shake", price: "₹169", desc: "Oreo cookies, vanilla ice cream, milk" },
      { name: "Banana Smoothie", price: "₹129", desc: "Banana, yogurt, honey" },
      { name: "Mixed Fruit Juice", price: "₹139", desc: "Seasonal fresh fruits blend" },
    ],
  },
  {
    title: "Snacks & Meals",
    items: [
      { name: "Veg Sandwich", price: "₹99", desc: "Grilled veggies, cheese, toast" },
      { name: "Chicken Wrap", price: "₹179", desc: "Grilled chicken, veggies, mayo wrap" },
      { name: "Paneer Tikka", price: "₹199", desc: "Spiced paneer, grilled with veggies" },
      { name: "French Fries", price: "₹99", desc: "Crispy golden fries with ketchup" },
      { name: "Pasta", price: "₹169", desc: "Penne in creamy white/red sauce" },
    ],
  },
  {
    title: "Desserts",
    items: [
      { name: "Brownie", price: "₹129", desc: "Warm chocolate brownie with ice cream" },
      { name: "Waffle", price: "₹149", desc: "Belgian waffle with maple syrup" },
      { name: "Ice Cream Sundae", price: "₹139", desc: "Vanilla, chocolate, strawberry" },
    ],
  },
];

const Cafe = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="relative h-[50vh] flex items-center justify-center">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cafeBg})` }} />
      <div className="absolute inset-0 bg-background/25" />
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl sm:text-6xl text-primary text-glow"
        >
          Café
        </motion.h1>
        <p className="text-muted-foreground mt-2">Relax. Refresh. Recharge.</p>
      </div>
    </section>

    {/* Menu */}
    <section className="section-padding">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <Coffee className="w-6 h-6 text-primary" />
          <h2 className="font-display text-4xl text-foreground">Our Menu</h2>
          <Leaf className="w-6 h-6 text-primary" />
        </div>

        <div className="space-y-10">
          {menuCategories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.1 }}
            >
              <h3 className="font-display text-2xl text-accent mb-4">{cat.title}</h3>
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <div key={item.name} className="glass rounded-lg p-4 flex justify-between items-start">
                    <div>
                      <h4 className="text-foreground font-medium">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <span className="text-primary font-semibold whitespace-nowrap ml-4">{item.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Café gallery placeholder */}
        <div className="mt-16 text-center">
          <div className="glass rounded-lg p-10">
            <UtensilsCrossed className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-display text-2xl text-foreground mb-2">Visit Us Today</h3>
            <p className="text-muted-foreground text-sm">Open daily from 7:00 AM to 10:00 PM</p>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Cafe;
