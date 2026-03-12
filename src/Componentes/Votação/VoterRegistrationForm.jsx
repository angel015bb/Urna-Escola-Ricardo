import React, { useState } from "react";
import { Input } from "../Componentes/UI/input";
import { Button } from "../Componentes/UI/button";
import { Label } from "../Componentes/UI/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Componentes/UI/select";
import { User, Mail, Hash, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function VoterRegistrationForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState({
    name: "",
    ra_base: "",
    ra_digit: "",
    email: "",
    gender: "",
    ethnicity: "",
    series: "",
    class_group: ""
  });
  const [raError, setRaError] = useState("");

  const handleRABaseChange = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 9);
    setForm({ ...form, ra_base: cleaned });
    validateRA(cleaned, form.ra_digit);
  };

  const handleRADigitChange = (digit) => {
    setForm({ ...form, ra_digit: digit });
    validateRA(form.ra_base, digit);
  };

  const validateRA = (base, digit) => {
    if (base.length === 9 && !digit) {
      setRaError("Selecione o dígito verificador");
    } else if (base.length < 9 && digit) {
      setRaError("RA deve ter 9 dígitos");
    } else {
      setRaError("");
    }
  };

  const fullRA = form.ra_base + form.ra_digit;
  const isValid = form.name && form.ra_base.length === 9 && form.ra_digit && form.gender && form.ethnicity && form.series && form.class_group;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) onSubmit({ ...form, ra: fullRA });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 md:p-8 space-y-5 glow-emerald"
    >
      <h2 className="text-xl font-bold text-foreground mb-2">Identificação do Eleitor</h2>

      <div className="space-y-2">
        <Label className="text-muted-foreground text-sm">Nome Completo *</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Digite seu nome completo"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="pl-10 bg-muted/50 border-border/50 focus:border-primary h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground text-sm">RA (Registro do Aluno) *</Label>
        <div className="grid grid-cols-[1fr,auto] gap-2">
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="9 dígitos (ex: 123456789)"
              value={form.ra_base}
              onChange={(e) => handleRABaseChange(e.target.value)}
              className="pl-10 bg-muted/50 border-border/50 focus:border-primary h-11"
              maxLength={9}
            />
          </div>
          <Select value={form.ra_digit} onValueChange={handleRADigitChange}>
            <SelectTrigger className="w-16 bg-muted/50 border-border/50 h-11">
              <SelectValue placeholder="-" />
            </SelectTrigger>
            <SelectContent>
              {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "X"].map((digit) => (
                <SelectItem key={digit} value={digit}>{digit}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {raError && <p className="text-destructive text-xs">{raError}</p>}
        {fullRA.length === 10 && !raError && (
          <p className="text-primary text-xs">RA completo: {fullRA}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground text-sm">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="pl-10 bg-muted/50 border-border/50 focus:border-primary h-11"
            type="email"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">Gênero *</Label>
          <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
            <SelectTrigger className="bg-muted/50 border-border/50 h-11">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Feminino">Feminino</SelectItem>
              <SelectItem value="Não-binário">Não-binário</SelectItem>
              <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">Etnia *</Label>
          <Select value={form.ethnicity} onValueChange={(v) => setForm({ ...form, ethnicity: v })}>
            <SelectTrigger className="bg-muted/50 border-border/50 h-11">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Branco(a)">Branco(a)</SelectItem>
              <SelectItem value="Preto(a)">Preto(a)</SelectItem>
              <SelectItem value="Pardo(a)">Pardo(a)</SelectItem>
              <SelectItem value="Amarelo(a)">Amarelo(a)</SelectItem>
              <SelectItem value="Indígena">Indígena</SelectItem>
              <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">Série *</Label>
          <Select value={form.series} onValueChange={(v) => setForm({ ...form, series: v })}>
            <SelectTrigger className="bg-muted/50 border-border/50 h-11">
              <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4º Ano">4º Ano</SelectItem>
              <SelectItem value="5º Ano">5º Ano</SelectItem>
              <SelectItem value="6º Ano">6º Ano</SelectItem>
              <SelectItem value="7º Ano">7º Ano</SelectItem>
              <SelectItem value="8º Ano">8º Ano</SelectItem>
              <SelectItem value="9º Ano">9º Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">Turma *</Label>
          <Select value={form.class_group} onValueChange={(v) => setForm({ ...form, class_group: v })}>
            <SelectTrigger className="bg-muted/50 border-border/50 h-11">
              <Users className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Turma A</SelectItem>
              <SelectItem value="B">Turma B</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-300"
      >
        {isLoading ? "Processando..." : "Prosseguir para Votação"}
      </Button>
    </motion.form>
  );
}