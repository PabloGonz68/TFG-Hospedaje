import { motion } from "motion/react";

interface GlowAvatarProps {
    src: string;
    alt: string;
}

export function GlowAvatar({ src, alt }: GlowAvatarProps) {
    return (
        <div className="relative inline-block rounded-full p-[3px]">
            {/* Anillo de brillo profesional */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    border: "2px solid transparent",
                    background:
                        `conic-gradient(
              from 0deg,
              #f7e8b5 0%,
              #d4af37 25%,
              #f7e8b5 50%,
              #d4af37 75%,
              #f7e8b5 100%
            )`,
                    boxShadow:
                        `0 0 8px 3px rgba(212, 175, 55, 0.6), /* halo dorado suave */
             0 0 15px 6px rgba(247, 232, 181, 0.3)`,
                    WebkitMask:
                        "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 3px))",
                    mask:
                        "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 3px))",
                    filter: "drop-shadow(0 0 5px rgba(212, 175, 55, 0.7))",
                }}
            />
            {/* Imagen del avatar */}
            <img
                src={src}
                alt={alt}
                className="relative rounded-full w-full h-full object-cover aspect-square"
            />
        </div>
    );
}
