'use client';

import { Button } from '../ui/button';
import { Copy, CheckCircle2, Trash2 } from 'lucide-react';

interface PasteActionsProps {
  onCopy: () => void;
  onDelete: () => void;
  isCopied: boolean;
}

export function PasteActions({ onCopy, onDelete, isCopied }: PasteActionsProps) {
  return (
    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
      <Button
        variant="ghost"
        size="icon"
        onClick={onCopy}
        className="hover:bg-primary/10"
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
        onClick={onDelete}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}