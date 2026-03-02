import { useState, useRef, useEffect } from "react";
import { Instagram } from "lucide-react";

interface InstagramMenuProps {
    showLabels?: boolean;
}

const accounts = [
    { handle: "@vikram_official", url: "https://www.instagram.com/vikram_official" },
    { handle: "@vj_sportsclub_mh20", url: "https://www.instagram.com/vj_sportsclub_mh20" },
];

const InstagramMenu = ({ showLabels = false }: InstagramMenuProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative inline-block">
            <button
                onClick={() => setOpen((v) => !v)}
                className={
                    showLabels
                        ? "inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm"
                        : "text-muted-foreground hover:text-primary transition-colors"
                }
                aria-label="Instagram"
            >
                <Instagram className="w-5 h-5" />
                {showLabels && <span>Instagram</span>}
            </button>

            {open && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {accounts.map((a) => (
                        <button
                            key={a.handle}
                            onClick={() => {
                                const w = window.top || window;
                                w.open(a.url, "_blank", "noopener,noreferrer");
                                setOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                            <Instagram className="w-4 h-4 shrink-0" />
                            <span>{a.handle}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstagramMenu;
