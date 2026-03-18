import React from "react";
import { motion } from "framer-motion";
import { Button } from "../UI/button";
import { Download, CircleCheck as CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function VoteReceipt({ voter, onContinue }) {
  const receiptData = JSON.stringify({
    ra: voter.ra,
    nome: voter.name,
    serie: voter.series,
    turma: voter.class_group,
    votou: true,
    timestamp: new Date().toISOString(),
    escola: "EMEF Ricardo Puccetti"
  });

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const qr = document.querySelector("#vote-qr");
    if (!qr) return;

    const svg = qr.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      
      // Background
      ctx.fillStyle = "#0b0f1a";
      ctx.fillRect(0, 0, 400, 500);
      
      // QR Code
      ctx.drawImage(img, 50, 80, 300, 300);
      
      // Text
      ctx.fillStyle = "#10B981";
      ctx.font = "bold 24px Inter";
      ctx.textAlign = "center";
      ctx.fillText("COMPROVANTE DE VOTAÇÃO", 200, 40);
      
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "16px Inter";
      ctx.fillText(`RA: ${voter.ra}`, 200, 400);
      ctx.fillText(`${voter.series} - Turma ${voter.class_group}`, 200, 425);
      ctx.fillText(new Date().toLocaleString("pt-BR"), 200, 450);
      
      // Download
      const link = document.createElement("a");
      link.download = `comprovante_votacao_${voter.ra}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-8 text-center max-w-md mx-auto glow-emerald"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center"
      >
        <CheckCircle2 className="w-8 h-8 text-primary" />
      </motion.div>

      <h2 className="text-2xl font-bold text-foreground mb-2">Voto Registrado!</h2>
      <p className="text-muted-foreground mb-6 text-sm">
        Tire uma foto do QR Code abaixo como comprovante de participação
      </p>

      <div id="vote-qr" className="bg-white p-4 rounded-xl inline-block mb-6">
        <QRCodeSVG
          value={receiptData}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="text-xs text-muted-foreground mb-6 space-y-1">
        <p>RA: {voter.ra}</p>
        <p>{voter.series} - Turma {voter.class_group}</p>
        <p>{new Date().toLocaleString("pt-BR")}</p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex-1 border-border/50"
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar
        </Button>
        <Button
          onClick={onContinue}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Continuar
        </Button>
      </div>
    </motion.div>
  );
}