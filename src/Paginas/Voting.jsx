import React, { useState, useEffect } from "react";
import { base44 } from "../API/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Vote, Shield, Lock } from "lucide-react";
import { Button } from "../Componentes/UI/button.jsx";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import VoterRegistrationForm from "../Componentes/voting/VoterRegistrationForm.jsx";
import TermsModal from "../Componentes/voting/TermsModal.jsx";
import SlateCard from "../Componentes/voting/SlateCard.jsx";
import VoteConfirmation from "../Componentes/voting/VoteConfirmation.jsx";
import VoteReceipt from "../Componentes/voting/VoteReceipt.jsx";
import Screensaver from "../Componentes/voting/Screensaver.jsx";

const STEPS = {
  REGISTER: "register",
  TERMS: "terms",
  BALLOT: "ballot",
  CONFIRM: "confirm",
  RECEIPT: "receipt"
};

const IDLE_TIMEOUT = 120000; // 2 minutes

export default function Voting() {
  const [step, setStep] = useState(STEPS.REGISTER);
  const [voter, setVoter] = useState(null);
  const [voterId, setVoterId] = useState(null);
  const [selectedSlate, setSelectedSlate] = useState(null);
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const queryClient = useQueryClient();

  // Screensaver logic
  React.useEffect(() => {
    const checkIdle = setInterval(() => {
      if (Date.now() - lastActivity > IDLE_TIMEOUT && step === STEPS.REGISTER) {
        setShowScreensaver(true);
      }
    }, 5000);

    const handleActivity = () => {
      setLastActivity(Date.now());
      setShowScreensaver(false);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      clearInterval(checkIdle);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [lastActivity, step]);

  const { data: slates = [] } = useQuery({
    queryKey: ["slates"],
    queryFn: () => base44.entities.Slate.filter({ is_active: true })
  });

  const registerMutation = useMutation({
    mutationFn: async (voterData) => {
      // Check if RA already voted
      const existing = await base44.entities.Voter.filter({ ra: voterData.ra });
      if (existing.length > 0) {
        throw new Error("RA_EXISTS");
      }
      // Check if name already voted
      const existingName = await base44.entities.Voter.filter({ name: voterData.name });
      if (existingName.length > 0) {
        throw new Error("NAME_EXISTS");
      }
      return base44.entities.Voter.create(voterData);
    },
    onSuccess: (result, voterData) => {
      setVoter(voterData);
      setVoterId(result.id);
      setStep(STEPS.TERMS);
    },
    onError: (error) => {
      if (error.message === "RA_EXISTS") {
        toast.error("Este RA já foi utilizado para votar!");
      } else if (error.message === "NAME_EXISTS") {
        toast.error("Este nome já foi utilizado para votar!");
      } else {
        toast.error("Erro ao registrar. Tente novamente.");
      }
    }
  });

  const voteMutation = useMutation({
    mutationFn: async () => {
      const isNull = selectedSlate.id === "null";
      await base44.entities.Vote.create({
        voter_id: voterId,
        slate_id: isNull ? "" : selectedSlate.id,
        is_null_vote: isNull,
        voter_series: voter.series,
        voter_class: voter.class_group,
        voter_gender: voter.gender,
        voter_ethnicity: voter.ethnicity
      });
      await base44.entities.Voter.update(voterId, { has_voted: true });
      
      // Audit log
      await base44.entities.AuditLog.create({
        action: "Voto registrado",
        details: `RA: ${voter.ra} - ${voter.series} Turma ${voter.class_group}`,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes"] });
      setStep(STEPS.RECEIPT);
    }
  });

  const resetVoting = () => {
    setStep(STEPS.REGISTER);
    setVoter(null);
    setVoterId(null);
    setSelectedSlate(null);
  };

  const ballotSlates = [
    ...slates,
    { id: "null", name: "VOTO NULO", description: "Anular meu voto" }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Vote className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Sistema Eleitoral Pro V24
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            EMEF Ricardo Puccetti — Eleição Estudantil 2026
          </p>
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Voto secreto e seguro</span>
          </div>
        </motion.div>

        {/* Step indicator */}
        {step !== STEPS.SUCCESS && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {["Cadastro", "Termos", "Votação"].map((label, i) => {
              const stepOrder = [STEPS.REGISTER, STEPS.TERMS, STEPS.BALLOT];
              const currentIndex = stepOrder.indexOf(step);
              const isActive = i <= (step === STEPS.CONFIRM ? 2 : currentIndex);
              return (
                <React.Fragment key={label}>
                  <div className={`flex items-center gap-1.5 ${isActive ? "text-primary" : "text-muted-foreground/40"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-xs font-medium hidden sm:inline">{label}</span>
                  </div>
                  {i < 2 && (
                    <div className={`w-8 h-0.5 ${isActive && i < currentIndex ? "bg-primary" : "bg-muted"}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === STEPS.REGISTER && (
            <VoterRegistrationForm
              key="register"
              onSubmit={(data) => registerMutation.mutate(data)}
              isLoading={registerMutation.isPending}
            />
          )}

          {step === STEPS.BALLOT && (
            <motion.div
              key="ballot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Cédula de Votação</h2>
                <p className="text-sm text-muted-foreground mt-1">Selecione uma chapa e confirme seu voto</p>
              </div>

              <div className="space-y-3">
                {ballotSlates.map((slate, index) => (
                  <SlateCard
                    key={slate.id}
                    slate={slate}
                    index={index}
                    isSelected={selectedSlate?.id === slate.id}
                    onSelect={setSelectedSlate}
                  />
                ))}
              </div>

              <Button
                onClick={() => setStep(STEPS.CONFIRM)}
                disabled={!selectedSlate}
                className="w-full h-12 mt-4 bg-primary hover:bg-primary/90 text-base font-semibold"
              >
                Confirmar Voto
              </Button>
            </motion.div>
          )}

          {step === STEPS.RECEIPT && voter && (
            <VoteReceipt key="receipt" voter={voter} onContinue={resetVoting} />
          )}
        </AnimatePresence>

        {/* Terms Modal */}
        <TermsModal
          open={step === STEPS.TERMS}
          onAccept={() => setStep(STEPS.BALLOT)}
          onDecline={() => {
            // Delete registered voter if they decline
            if (voterId) {
              base44.entities.Voter.delete(voterId);
            }
            resetVoting();
          }}
        />

        {/* Vote Confirmation */}
        <VoteConfirmation
          open={step === STEPS.CONFIRM}
          slate={selectedSlate}
          onConfirm={() => voteMutation.mutate()}
          onCancel={() => setStep(STEPS.BALLOT)}
          isLoading={voteMutation.isPending}
        />

        {/* Admin link */}
        <div className="text-center mt-10">
          <Link to="/Admin" className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors">
            <Lock className="w-3 h-3 inline mr-1" />
            Painel Administrativo
          </Link>
        </div>
      </div>

      {/* Screensaver */}
      <Screensaver
        active={showScreensaver}
        onDismiss={() => {
          setShowScreensaver(false);
          setLastActivity(Date.now());
        }}
      />
    </div>
  );
}