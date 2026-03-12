import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TimelineChart({ votes }) {
  // Group votes by hour
  const votesByHour = {};
  
  votes.forEach((vote) => {
    const date = new Date(vote.created_date);
    const hour = date.getHours();
    const timeLabel = `${hour.toString().padStart(2, "0")}:00`;
    votesByHour[timeLabel] = (votesByHour[timeLabel] || 0) + 1;
  });

  // Convert to array and accumulate
  const data = Object.entries(votesByHour)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hora, votos]) => ({ hora, votos }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-strong rounded-lg px-3 py-2 text-sm">
          <p className="text-foreground font-medium">{payload[0].payload.hora}</p>
          <p className="text-primary">{payload[0].value} votos</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-xl p-5">
      <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
        Fluxo de Votação por Horário
      </h4>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
            <XAxis 
              dataKey="hora" 
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} 
            />
            <YAxis 
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} 
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="votos" 
              stroke="hsl(160, 84%, 39%)" 
              strokeWidth={3}
              dot={{ fill: "hsl(160, 84%, 39%)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-muted-foreground text-sm text-center py-10">
          Nenhum voto registrado ainda.
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Use este gráfico para identificar horários de pico e planejar futuras eleições
      </p>
    </div>
  );
}