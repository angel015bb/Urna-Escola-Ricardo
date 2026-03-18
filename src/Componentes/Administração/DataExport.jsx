import React from "react";
import { Button } from "../UI/button";
import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

function generateCSV(data, headers) {
  const headerRow = headers.map((h) => h.label).join(",");
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h.key] ?? "";
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(",")
  );
  return headerRow + "\n" + rows.join("\n");
}

function downloadCSV(content, filename) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function DataExport({ voters, votes, slates }) {
  const headers = [
    { key: "name", label: "Nome" },
    { key: "ra", label: "RA" },
    { key: "email", label: "Email" },
    { key: "gender", label: "Gênero" },
    { key: "ethnicity", label: "Etnia" },
    { key: "series", label: "Série" },
    { key: "class_group", label: "Turma" },
    { key: "vote_slate", label: "Voto" }
  ];

  const enrichedData = voters.map((voter) => {
    const vote = votes.find((v) => v.voter_id === voter.id);
    const slateName = vote?.is_null_vote
      ? "NULO"
      : slates.find((s) => s.id === vote?.slate_id)?.name || "Não votou";
    return { ...voter, vote_slate: slateName };
  });

  const exportAll = async () => {
    const now = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const csv = generateCSV(enrichedData, headers);
    downloadCSV(csv, `eleicao_completa_${now}.csv`);
    
    // Audit log
    await base44.integrations.Core.InvokeLLM({
      prompt: "ignore this, just creating audit log"
    }).catch(() => {});
    
    await base44.entities.AuditLog.create({
      action: "Relatório exportado",
      details: "Relatório completo exportado",
      timestamp: new Date().toISOString()
    });
    
    toast.success("Planilha exportada com sucesso!");
  };

  const exportBySeries = (series, classGroup) => {
    const now = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filtered = enrichedData.filter(
      (v) => v.series === series && v.class_group === classGroup
    );
    if (filtered.length === 0) {
      toast.error(`Nenhum dado para ${series} - Turma ${classGroup}`);
      return;
    }
    const csv = generateCSV(filtered, headers);
    const seriesClean = series.replace(/[º ]/g, "");
    downloadCSV(csv, `eleicao_${seriesClean}_Turma${classGroup}_${now}.csv`);
    toast.success(`Planilha ${series} Turma ${classGroup} exportada!`);
  };

  const seriesList = ["4º Ano", "5º Ano", "6º Ano", "7º Ano", "8º Ano", "9º Ano"];
  const classes = ["A", "B"];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Exportar Relatórios</h3>

      <Button
        onClick={exportAll}
        className="w-full h-11 bg-primary hover:bg-primary/90 font-semibold"
      >
        <Download className="w-4 h-4 mr-2" />
        Exportar Todos os Dados
      </Button>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Exportar por Série e Turma:</p>
        <div className="grid grid-cols-2 gap-2">
          {seriesList.map((series) =>
            classes.map((cls) => (
              <Button
                key={`${series}-${cls}`}
                variant="outline"
                onClick={() => exportBySeries(series, cls)}
                className="h-9 text-xs border-border/50"
              >
                <FileSpreadsheet className="w-3 h-3 mr-1" />
                {series} - {cls}
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}