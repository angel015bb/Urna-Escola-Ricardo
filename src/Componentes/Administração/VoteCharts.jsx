import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#6366F1", "#14B8A6"];

function ChartCard({ title, children }) {
  return (
    <div className="glass rounded-xl p-5">
      <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">{title}</h4>
      {children}
    </div>
  );
}

export default function VoteCharts({ votes, slates }) {
  // Votes by slate
  const votesBySlate = slates.map((s) => ({
    name: s.name,
    votos: votes.filter((v) => v.slate_id === s.id).length
  }));
  const nullVotes = votes.filter((v) => v.is_null_vote).length;
  if (nullVotes > 0) votesBySlate.push({ name: "Nulo", votos: nullVotes });

  // Votes by gender
  const genderCounts = {};
  votes.forEach((v) => {
    const g = v.voter_gender || "Não informado";
    genderCounts[g] = (genderCounts[g] || 0) + 1;
  });
  const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));

  // Votes by ethnicity
  const ethnicityCounts = {};
  votes.forEach((v) => {
    const e = v.voter_ethnicity || "Não informado";
    ethnicityCounts[e] = (ethnicityCounts[e] || 0) + 1;
  });
  const ethnicityData = Object.entries(ethnicityCounts).map(([name, value]) => ({ name, value }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-strong rounded-lg px-3 py-2 text-sm">
          <p className="text-foreground font-medium">{payload[0].name || payload[0].payload?.name}</p>
          <p className="text-primary">{payload[0].value} votos</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard title="Ranking de Votos por Chapa">
        {votesBySlate.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={votesBySlate}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="votos" radius={[6, 6, 0, 0]}>
                {votesBySlate.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-10">Nenhum voto registrado.</p>
        )}
      </ChartCard>

      <ChartCard title="Perfil por Gênero">
        {genderData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                {genderData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "hsl(215, 20%, 55%)" }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-10">Sem dados.</p>
        )}
      </ChartCard>

      <ChartCard title="Perfil por Etnia">
        {ethnicityData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={ethnicityData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                {ethnicityData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "hsl(215, 20%, 55%)" }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-10">Sem dados.</p>
        )}
      </ChartCard>

      <ChartCard title="Votos por Série">
        {(() => {
          const seriesCounts = {};
          votes.forEach((v) => {
            const s = v.voter_series || "Não informado";
            seriesCounts[s] = (seriesCounts[s] || 0) + 1;
          });
          const seriesData = Object.entries(seriesCounts).map(([name, votos]) => ({ name, votos }));
          return seriesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={seriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="votos" radius={[6, 6, 0, 0]}>
                  {seriesData.map((_, i) => (
                    <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-10">Sem dados.</p>
          );
        })()}
      </ChartCard>
    </div>
  );
}