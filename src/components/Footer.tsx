import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-card border-t border-border">
    <div className="container mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-3xl text-primary mb-4">VJ ARMY</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A premium sports & wellness destination led by Mr. India 2019 Vikram Jadhav.
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => { const w = window.top || window; w.open("https://www.instagram.com/vikram_official", "_blank", "noopener,noreferrer"); }}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </button>
            <button
              onClick={() => { const w = window.top || window; w.open("https://wa.me/917020818586", "_blank", "noopener,noreferrer"); }}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl mb-4 text-foreground">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/turf" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sports Turf</Link>
            <Link to="/swimming-pool" className="text-sm text-muted-foreground hover:text-primary transition-colors">Swimming Pool</Link>
            <Link to="/cafe" className="text-sm text-muted-foreground hover:text-primary transition-colors">Café</Link>
            <Link to="/gym" className="text-sm text-muted-foreground hover:text-primary transition-colors">Gym (Coming Soon)</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl mb-4 text-foreground">Explore</h4>
          <div className="flex flex-col gap-2">
            <Link to="/achievements" className="text-sm text-muted-foreground hover:text-primary transition-colors">About & Achievements</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Admin Dashboard</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl mb-4 text-foreground">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
              <span>V9V7+25R, Sector M, N 7, Aurangabad, Chhatrapati Sambhajinagar, Maharashtra 431003</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span>+91 70208 18586</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span>info@vjarmy.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-10 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VJ Army. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
