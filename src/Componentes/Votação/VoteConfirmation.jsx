import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../UI/button";
import { CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle } from "lucide-react";

export default function VoteConfirmation({ open, slate, onConfirm, onCancel, isLoading }) {
  if (!open) return null;
  const isNull = slate?.id === "null";

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
          className="glass-strong rounded-2xl max-w-md w-full p-6 text-center"
        >
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isNull ? "bg-destructive/20" : "bg-primary/20"
          }`}>
            {isNull ? (
              <AlertTriangle className="w-8 h-8 text-destructive" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-primary" />
            )}
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">Confirmar Voto</h2>
          <p className="text-muted-foreground mb-6">
            {isNull
              ? "Você está prestes a votar NULO. Deseja confirmar?"
              : <>Você está votando na chapa <span className="text-foreground font-semibold">"{slate?.name}"</span>. Deseja confirmar?</>
            }
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 h-11 border-border/50"
            >
              Corrigir
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 h-11 font-semibold ${
                isNull ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isLoading ? "Registrando..." : "CONFIRMA"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}