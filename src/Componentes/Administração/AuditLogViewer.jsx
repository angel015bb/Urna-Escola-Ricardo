import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ScrollArea } from "../Componentes/UI/scroll-area";
import { Shield, Clock } from "lucide-react";

export default function AuditLogViewer() {
  const { data: logs = [] } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => base44.entities.AuditLog.list("-created_date", 100),
    refetchInterval: 10000
  });

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-chart-4" />
        <h3 className="text-lg font-bold text-foreground">Logs de Auditoria</h3>
      </div>

      <ScrollArea className="h-64 pr-4">
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-10">
            Nenhuma ação registrada ainda
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-muted/30 rounded-lg p-3 border border-border/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {log.action}
                    </p>
                    {log.details && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {log.details}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    {new Date(log.created_date).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          🔒 Registro criptografado de todas as ações administrativas
        </p>
      </div>
    </div>
  );
}