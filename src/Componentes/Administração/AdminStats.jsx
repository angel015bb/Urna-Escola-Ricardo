import React from "react";
import { Users, Vote, BarChart3, Ban } from "lucide-react";
import { motion } from "framer-motion";

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-xl p-5"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminStats({ voters, votes, slates }) {
  const totalVoters = voters?.length || 0;
  const totalVotes = votes?.length || 0;
  const nullVotes = votes?.filter((v) => v.is_null_vote)?.length || 0;
  const totalSlates = slates?.filter((s) => s.is_active !== false)?.length || 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard icon={Users} label="Eleitores Registrados" value={totalVoters} color="bg-primary/20 text-primary" delay={0} />
      <StatCard icon={Vote} label="Votos Computados" value={totalVotes} color="bg-secondary/20 text-secondary" delay={0.1} />
      <StatCard icon={BarChart3} label="Chapas Ativas" value={totalSlates} color="bg-chart-4/20 text-chart-4" delay={0.2} />
      <StatCard icon={Ban} label="Votos Nulos" value={nullVotes} color="bg-destructive/20 text-destructive" delay={0.3} />
    </div>
  );
}