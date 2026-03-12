import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Target } from "lucide-react";

export default function EngagementDashboard({ voters, totalStudents = 500 }) {
  const participated = voters?.length || 0;
  const percentage = Math.round((participated / totalStudents) * 100);
  const remaining = totalStudents - participated;

  return (
    <div className="glass rounded-xl p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Engajamento da Eleição
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          <span>Tempo real</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{participated}</div>
          <div className="text-xs text-muted-foreground">Votaram</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{percentage}%</div>
          <div className="text-xs text-muted-foreground">Participação</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-muted-foreground">{remaining}</div>
          <div className="text-xs text-muted-foreground">Faltam</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
        />
      </div>

      <div className="flex items-center justify-between mt-3 text-xs">
        <span className="text-muted-foreground">Meta: {totalStudents} alunos</span>
        {percentage >= 80 && (
          <span className="flex items-center gap-1 text-primary font-medium">
            <Target className="w-3 h-3" />
            Meta atingida!
          </span>
        )}
      </div>
    </div>
  );
}