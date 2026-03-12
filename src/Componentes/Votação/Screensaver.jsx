import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vote, Users, Award } from "lucide-react";

const IMAGES = [
  { icon: Vote, title: "Democracia Estudantil", subtitle: "Seu voto faz a diferença" },
  { icon: Users, title: "Participação Cidadã", subtitle: "Eleição transparente e segura" },
  { icon: Award, title: "Grêmio Estudantil", subtitle: "Unidos pela nossa escola" }
];

export default function Screensaver({ active, onDismiss }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  const CurrentIcon = IMAGES[currentIndex].icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
        className="fixed inset-0 z-50 bg-background cursor-pointer flex items-center justify-center"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-32 h-32 rounded-3xl bg-primary/20 mx-auto mb-6 flex items-center justify-center glow-emerald">
              <CurrentIcon className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">
              {IMAGES[currentIndex].title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {IMAGES[currentIndex].subtitle}
            </p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-12"
          >
            <p className="text-sm text-muted-foreground/60">
              Toque na tela para iniciar
            </p>
          </motion.div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40">
            EMEF Ricardo Puccetti — Sistema Eleitoral Pro V24
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}