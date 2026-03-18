import React from "react";
import { motion } from "framer-motion";
import { Check, Vote } from "lucide-react";
import { cn } from "../../lib/utils";

export default function SlateCard({ slate, isSelected, onSelect, index }) {
  const isNullVote = slate.id === "null";

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onSelect(slate)}
      className={cn(
        "relative w-full text-left rounded-2xl p-5 transition-all duration-300 group",
        "glass hover:bg-white/10",
        isSelected && !isNullVote && "ring-2 ring-primary bg-primary/10 glow-emerald",
        isSelected && isNullVote && "ring-2 ring-destructive bg-destructive/10",
        !isSelected && "hover:scale-[1.02]"
      )}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center",
            isNullVote ? "bg-destructive" : "bg-primary"
          )}
        >
          <Check className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      )}

      <div className="flex items-center gap-4">
        {isNullVote ? (
          <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <Vote className="w-8 h-8 text-muted-foreground" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
            {slate.photo_url ? (
              <img
                src={slate.photo_url}
                alt={slate.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                <span className="text-2xl font-bold text-foreground">
                  {slate.name?.charAt(0)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-bold text-lg",
            isNullVote ? "text-muted-foreground" : "text-foreground"
          )}>
            {slate.name}
          </h3>
          {slate.description && (
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {slate.description}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
}