import React from "react";
import { Button } from "../UI/button";
import { ScrollArea } from "../UI/scroll-area";
import { ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TermsModal({ open, onAccept, onDecline }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-strong rounded-2xl max-w-lg w-full p-6 glow-blue"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Termo de Compromisso</h2>
          </div>

          <ScrollArea className="h-64 mb-6 pr-4">
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p className="font-semibold text-foreground">ESTATUTO ELEITORAL — EMEF RICARDO PUCCETTI</p>
              
              <p><strong>Art. 1º</strong> — O presente processo eleitoral tem como objetivo promover a participação democrática dos alunos na escolha de seus representantes estudantis.</p>
              
              <p><strong>Art. 2º</strong> — O voto é secreto e individual. Cada aluno tem direito a um único voto.</p>
              
              <p><strong>Art. 3º</strong> — É proibida qualquer forma de coação, pressão ou influência sobre o voto de outro eleitor.</p>
              
              <p><strong>Art. 4º</strong> — O aluno que tentar votar mais de uma vez será impedido pelo sistema e poderá sofrer sanções disciplinares.</p>
              
              <p><strong>Art. 5º</strong> — O resultado da eleição será divulgado oficialmente pela comissão eleitoral após a apuração dos votos.</p>
              
              <p><strong>Art. 6º</strong> — Ao prosseguir, o eleitor declara estar ciente das regras do processo eleitoral e se compromete a respeitá-las.</p>
              
              <p><strong>Art. 7º</strong> — A comissão eleitoral se reserva ao direito de anular votos em caso de irregularidades comprovadas.</p>
              
              <p><strong>Art. 8º</strong> — O sigilo do voto é garantido pelo sistema eletrônico, que não permite associar o voto ao eleitor após a confirmação.</p>
            </div>
          </ScrollArea>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onDecline}
              className="flex-1 h-11 border-border/50"
            >
              Recusar
            </Button>
            <Button
              onClick={onAccept}
              className="flex-1 h-11 bg-primary hover:bg-primary/90 font-semibold"
            >
              Li e Aceito
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}