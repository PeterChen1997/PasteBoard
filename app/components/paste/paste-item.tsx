"use client";

import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { PasteActions } from "./paste-actions";
import { PasteContent } from "./paste-content";
import { PasteEditorDialog } from "./paste-editor-dialog";
import { PasteTimestamp } from "./paste-timestamp";
import { Paste } from "@/lib/types";

interface PasteItemProps {
  paste: Paste;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, content: string) => Promise<void>;
  onAppend: (id: string, content: string) => Promise<void>;
  isPending: boolean;
}

export function PasteItem({
  paste,
  onDelete,
  onEdit,
  onAppend,
  isPending,
}: PasteItemProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAppendOpen, setIsAppendOpen] = useState(false);
  const [editContent, setEditContent] = useState(paste.content);
  const [appendContent, setAppendContent] = useState("");
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

  const handleEditSubmit = async () => {
    try {
      await onEdit(paste.id, editContent);
      setIsEditOpen(false);
    } catch {
      // Toasts are handled by the parent mutation layer.
    }
  };

  const handleAppendSubmit = async () => {
    try {
      await onAppend(paste.id, appendContent);
      setAppendContent("");
      setIsAppendOpen(false);
    } catch {
      // Toasts are handled by the parent mutation layer.
    }
  };

  return (
    <>
      <PasteEditorDialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (open) {
            setEditContent(paste.content);
          }
        }}
        title="Edit Paste"
        description="Replace the existing paste content while keeping the same thread context."
        label="Content"
        placeholder="Update this paste..."
        submitLabel="Save changes"
        value={editContent}
        onValueChange={setEditContent}
        onSubmit={handleEditSubmit}
        isSubmitting={isPending}
      />

      <PasteEditorDialog
        open={isAppendOpen}
        onOpenChange={(open) => {
          setIsAppendOpen(open);
          if (!open) {
            setAppendContent("");
          }
        }}
        title="Append To Paste"
        description="Add more content to the end of this paste without replacing what is already there."
        label="Additional content"
        placeholder="Add the next block of content..."
        submitLabel="Append content"
        value={appendContent}
        onValueChange={setAppendContent}
        onSubmit={handleAppendSubmit}
        isSubmitting={isPending}
      />

      <div className="group rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-border/80 hover:shadow-md">
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <PasteTimestamp
              createdAt={paste.createdAt}
              updatedAt={paste.updatedAt}
            />
            <PasteActions
              onCopy={handleCopy}
              onEdit={() => {
                setEditContent(paste.content);
                setIsEditOpen(true);
              }}
              onAppend={() => {
                setAppendContent("");
                setIsAppendOpen(true);
              }}
              onDelete={() => onDelete(paste.id)}
              isCopied={copiedId === paste.id}
              disabled={isPending}
            />
          </div>
          <PasteContent content={paste.content} />
        </div>
      </div>
    </>
  );
}
