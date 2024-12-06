"use client";

import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { PasteActions } from "./paste-actions";
import { PasteContent } from "./paste-content";
import { PasteTimestamp } from "./paste-timestamp";
import { Paste } from "@/lib/types";

interface PasteItemProps {
  paste: Paste;
  onDelete: (id: string) => Promise<void>;
}

export function PasteItem({ paste, onDelete }: PasteItemProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      setCopiedId(paste.id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="group rounded-lg border border-border bg-card transition-colors hover:border-border/80">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <PasteTimestamp createdAt={paste.createdAt} />
          <PasteActions
            onCopy={handleCopy}
            onDelete={() => onDelete(paste.id)}
            isCopied={copiedId === paste.id}
          />
        </div>
        <PasteContent content={paste.content} />
      </div>
    </div>
  );
}
