import React, { useState } from "react";
import { base44 } from "../API/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../Componentes/UI/input";
import { Button } from "../Componentes/UI/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Componentes/UI/tabs";
import { Lock, ArrowLeft, ChartBar as BarChart3, Settings, Download, Vote } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


import SlateManager from "../Componentes/Administração/SlateManager";
import VoteCharts from "../Componentes/Administração/VoteCharts";
import AdminStats from "../Componentes/Administração/AdminStats";
import DataExport from "../Componentes/Administração/DataExport";
import EngagementDashboard from "../Componentes/Administração/EngagementDashboard";
import TimelineChart from "../Componentes/Administração/TimelineChart";
import NotificationManager from "../Componentes/Administração/NotificationManager";
import AuditLogViewer from "../Componentes/Administração/AuditLogViewer";


const ADMIN_KEY = "puccetti2026";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { data: slates = [] } = useQuery({
    queryKey: ["slates"],
    queryFn: () => base44.entities.Slate.list(),
    enabled: authenticated
  });

  const { data: votes = [] } = useQuery({
    queryKey: ["votes"],
    queryFn: () => base44.entities.Vote.list("-created_date", 5000),
    enabled: authenticated,
    refetchInterval: 5000
  });

  const { data: voters = [] } = useQuery({
    queryKey: ["voters"],
    queryFn: () => base44.entities.Voter.list("-created_date", 5000),
    enabled: authenticated,
    refetchInterval: 5000
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Chave de acesso incorreta!");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 max-w-sm w-full glow-blue relative z-10"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-secondary/20 mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-7 h-7 text-secondary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground mt-1">Acesso restrito à comissão eleitoral</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Chave de acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50 h-11"
              />
            </div>
            {error && <p className="text-destructive text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full h-11 bg-secondary hover:bg-secondary/90 font-semibold">
              Acessar
            </Button>
          </form>

          <div className="text-center mt-4">
            <Link to="/Voting" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3 h-3 inline mr-1" />
              Voltar à Votação
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Vote className="w-6 h-6 text-primary" />
              Painel de Gestão
            </h1>
            <p className="text-sm text-muted-foreground">EMEF Ricardo Puccetti — Administração</p>
          </div>
          <Link to="/Voting">
            <Button variant="outline" size="sm" className="border-border/50">
              <ArrowLeft className="w-4 h-4 mr-1" /> Votação
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <AdminStats voters={voters} votes={votes} slates={slates} />

        {/* Engagement */}
        <EngagementDashboard voters={voters} totalStudents={500} />

        {/* Tabs */}
        <Tabs defaultValue="charts" className="mt-4">
          <TabsList className="glass w-full grid grid-cols-4 h-11">
            <TabsTrigger value="charts" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Gráficos</span>
            </TabsTrigger>
            <TabsTrigger value="slates" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm">
              <Settings className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Chapas</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm">
              <Download className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Exportar</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm">
              <Lock className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="mt-4 space-y-4">
            <VoteCharts votes={votes} slates={slates} />
            <TimelineChart votes={votes} />
          </TabsContent>

          <TabsContent value="slates" className="mt-4">
            <SlateManager slates={slates} />
          </TabsContent>

          <TabsContent value="export" className="mt-4 space-y-4">
            <div className="glass rounded-xl p-5">
              <DataExport voters={voters} votes={votes} slates={slates} />
            </div>
            <NotificationManager votes={votes} voters={voters} />
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <AuditLogViewer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}