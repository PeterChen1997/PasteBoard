"use client";

import { Button } from "../ui/button";
import {
  CheckCircle2,
  Copy,
  Pencil,
  PlusSquare,
  Trash2,
} from "lucide-react";

interface PasteActionsProps {
  onCopy: () => void;
  onEdit: () => void;
  onAppend: () => void;
  onDelete: () => void;
  isCopied: boolean;
  disabled?: boolean;
}

export function PasteActions({
  onCopy,
  onEdit,
  onAppend,
  onDelete,
  isCopied,
  disabled = false,
}: PasteActionsProps) {
  return (
    <div className="flex items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
      <Button
        variant="ghost"
        size="icon"
        onClick={onCopy}
        className="hover:bg-primary/10"
        disabled={disabled}
        type="button"
      >
        {isCopied ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="hover:bg-primary/10"
        disabled={disabled}
        type="button"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onAppend}
        className="hover:bg-primary/10"
        disabled={disabled}
        type="button"
      >
        <PlusSquare className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        disabled={disabled}
        type="button"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
