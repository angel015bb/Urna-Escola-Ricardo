import React from "react";
import { motion } from "framer-motion";
import { Button } from "../UI/button";
import { PartyPopper, RotateCcw } from "lucide-react";

export default function VoteSuccess({ onNewVote }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-10 text-center glow-emerald max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-primary/20 mx-auto mb-6 flex items-center justify-center"
      >
        <PartyPopper className="w-10 h-10 text-primary" />
      </motion.div>

      <h2 className="text-2xl font-bold text-foreground mb-2">Voto Registrado!</h2>
      <p className="text-muted-foreground mb-8">
        Seu voto foi computado com sucesso. Obrigado por participar do processo democrático!
      </p>

      <Button
        onClick={onNewVote}
        variant="outline"
        className="h-11 px-6 border-border/50"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Novo Eleitor
      </Button>
    </motion.div>
  );
}