import React, { useState } from "react";
import { base44 } from "../../API/client";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { Label } from "../UI/label";
import { Bell, Mail, Send } from "lucide-react";
import { toast } from "sonner";

export default function NotificationManager({ votes, voters }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const sendReport = async () => {
    if (!email) {
      toast.error("Digite um email válido");
      return;
    }

    setSending(true);
    try {
      const report = `
📊 RELATÓRIO ELEITORAL - EMEF Ricardo Puccetti

🗳️ Total de Votos: ${votes.length}
👥 Eleitores Registrados: ${voters.length}
❌ Votos Nulos: ${votes.filter(v => v.is_null_vote).length}
📈 Taxa de Participação: ${Math.round((votes.length / (voters.length || 1)) * 100)}%

⏰ Gerado em: ${new Date().toLocaleString("pt-BR")}

Sistema Eleitoral Pro V24
      `.trim();

      await base44.integrations.Core.SendEmail({
        to: email,
        subject: "📊 Relatório Eleitoral - EMEF Ricardo Puccetti",
        body: report
      });

      toast.success("Relatório enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar relatório");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="glass rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-bold text-foreground">Notificações</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Receba relatórios em tempo real por email
      </p>

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Email para Notificações</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="comissao@escola.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-muted/50 border-border/50 h-10"
            />
          </div>
          <Button
            onClick={sendReport}
            disabled={sending || !email}
            className="bg-secondary hover:bg-secondary/90 h-10 px-4"
          >
            <Send className="w-4 h-4 mr-2" />
            {sending ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </div>

      <div className="pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          💡 Configure o envio automático a cada hora através do painel de integrações
        </p>
      </div>
    </div>
  );
}