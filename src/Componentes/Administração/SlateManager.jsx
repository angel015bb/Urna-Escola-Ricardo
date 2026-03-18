import React, { useState } from "react";
import { base44 } from "../../API/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "../UI/input";
import { Button } from "../UI/button";
import { Label } from "../UI/label";
import { Textarea } from "../UI/textarea";
import { Plus, Trash2, Upload, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function SlateManager({ slates }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data) => {
      let photo_url = "";
      if (photoFile) {
        setUploading(true);
        const result = await base44.integrations.Core.UploadFile({ file: photoFile });
        photo_url = result.file_url;
        setUploading(false);
      }
      const slate = await base44.entities.Slate.create({ ...data, photo_url, is_active: true });
      
      // Audit log
      await base44.entities.AuditLog.create({
        action: "Chapa cadastrada",
        details: `Chapa "${data.name}" criada`,
        timestamp: new Date().toISOString()
      });
      
      return slate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slates"] });
      setForm({ name: "", description: "" });
      setPhotoFile(null);
      setShowForm(false);
      toast.success("Chapa cadastrada com sucesso!");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (slate) => {
      await base44.entities.Slate.delete(slate.id);
      
      // Audit log
      await base44.entities.AuditLog.create({
        action: "Chapa removida",
        details: `Chapa "${slate.name}" excluída`,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slates"] });
      toast.success("Chapa removida!");
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Chapas Cadastradas</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="sm"
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-1" /> Nova Chapa
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl p-5 space-y-4"
          >
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Nome da Chapa *</Label>
              <Input
                placeholder="Ex: Chapa União"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-muted/50 border-border/50 h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Descrição</Label>
              <Textarea
                placeholder="Propostas da chapa..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-muted/50 border-border/50 h-20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Foto da Chapa</Label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-border/50 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                {photoFile ? (
                  <Image className="w-4 h-4 text-primary" />
                ) : (
                  <Upload className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {photoFile ? photoFile.name : "Clique para selecionar uma imagem"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                />
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-border/50"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => createMutation.mutate(form)}
                disabled={!form.name || createMutation.isPending || uploading}
                className="bg-primary hover:bg-primary/90"
              >
                {uploading ? "Enviando foto..." : createMutation.isPending ? "Salvando..." : "Salvar Chapa"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {slates?.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-6">Nenhuma chapa cadastrada.</p>
        )}
        {slates?.map((slate) => (
          <div
            key={slate.id}
            className="glass rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {slate.photo_url ? (
                  <img src={slate.photo_url} alt={slate.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <span className="font-bold text-foreground">{slate.name?.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground">{slate.name}</p>
                {slate.description && (
                  <p className="text-xs text-muted-foreground truncate max-w-xs">{slate.description}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate(slate)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}