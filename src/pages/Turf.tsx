import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import turfBg from "@/assets/turf-bg.jpg";
import { format, addDays, isSameDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const sports = ["Football", "Cricket", "Badminton", "Tennis"];

const timeSlots = [
  "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM",
];

const Turf = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState(sports[0]);
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBoostedSlots] = useState<string[]>([]);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");

  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  useEffect(() => {
    fetchBookedSlots();
  }, [selectedDate]);

  const fetchBookedSlots = async () => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const { data } = await supabase
      .from("turf_bookings")
      .select("time_slot")
      .eq("booking_date", dateKey);
    if (data) setBoostedSlots(data.map((d) => d.time_slot));
  };

  const handleBook = async () => {
    if (!selectedSlot || !bookingName) return;
    setLoading(true);
    const { error } = await supabase.from("turf_bookings").insert({
      name: bookingName,
      phone: bookingPhone || null,
      sport: selectedSport,
      booking_date: format(selectedDate, "yyyy-MM-dd"),
      time_slot: selectedSlot,
    });
    setLoading(false);
    if (!error) {
      setBooked(true);
      fetchBookedSlots();
      setTimeout(() => {
        setBooked(false);
        setSelectedSlot(null);
        setBookingName("");
        setBookingPhone("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${turfBg})` }} />
        <div className="absolute inset-0 bg-background/25" />
        <div className="relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl sm:text-6xl text-primary text-glow">
            Sports Turf
          </motion.h1>
          <p className="text-muted-foreground mt-2">Book your slot. Play your game.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          {/* Sport Selection */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <h3 className="font-display text-2xl text-foreground mb-4">Select Sport</h3>
            <div className="flex flex-wrap gap-3">
              {sports.map((s) => (
                <Button key={s} variant={selectedSport === s ? "hero" : "secondary"} size="sm" onClick={() => setSelectedSport(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Date Selection */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mb-8">
            <h3 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Select Date
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {days.map((d) => (
                <button
                  key={d.toISOString()}
                  onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                  className={`flex flex-col items-center px-4 py-3 rounded-lg border transition-all min-w-[70px] ${
                    isSameDay(d, selectedDate) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="text-xs font-medium">{format(d, "EEE")}</span>
                  <span className="text-lg font-semibold">{format(d, "dd")}</span>
                  <span className="text-xs">{format(d, "MMM")}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Time Slots */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mb-8">
            <h3 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Available Slots
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {timeSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 px-2 rounded-lg text-sm font-medium border transition-all ${
                      isBooked
                        ? "border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed line-through"
                        : isSelected
                        ? "border-primary bg-primary/20 text-primary neon-border"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Booking Form */}
          {selectedSlot && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-6 mb-6">
              <h3 className="font-display text-xl text-foreground mb-3">Booking Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input placeholder="Your Name *" value={bookingName} onChange={(e) => setBookingName(e.target.value)} className="bg-card border-border text-foreground placeholder:text-muted-foreground" required />
                <Input type="tel" placeholder="Phone Number" value={bookingPhone} onChange={(e) => setBookingPhone(e.target.value)} className="bg-card border-border text-foreground placeholder:text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div><span className="text-muted-foreground">Sport:</span> <span className="text-foreground font-medium">{selectedSport}</span></div>
                <div><span className="text-muted-foreground">Date:</span> <span className="text-foreground font-medium">{format(selectedDate, "dd MMM yyyy")}</span></div>
                <div><span className="text-muted-foreground">Time:</span> <span className="text-primary font-medium">{selectedSlot}</span></div>
                <div><span className="text-muted-foreground">Duration:</span> <span className="text-foreground font-medium">1 Hour</span></div>
              </div>
              <Button variant="hero" size="lg" onClick={handleBook} className="w-full" disabled={!bookingName || loading}>
                {booked ? (
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Booked Successfully!</span>
                ) : loading ? "Booking..." : "Confirm & Book"}
              </Button>
            </motion.div>
          )}

          {/* Turf Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-lg p-6">
            <h3 className="font-display text-2xl text-foreground mb-4">Turf Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <h4 className="text-foreground font-medium mb-2">Sports Supported</h4>
                <ul className="space-y-1">
                  <li>⚽ Football (5v5, 7v7)</li>
                  <li>🏏 Cricket (Box Cricket)</li>
                  <li>🏸 Badminton</li>
                  <li>🎾 Tennis</li>
                </ul>
              </div>
              <div>
                <h4 className="text-foreground font-medium mb-2">Timings & Rules</h4>
                <ul className="space-y-1">
                  <li>🕐 6:00 AM – 10:00 PM daily</li>
                  <li>👟 Sports shoes mandatory</li>
                  <li>🚫 No food/drinks on turf</li>
                  <li>📞 Cancel 2 hrs before for full refund</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Turf;
