"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PasteEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  label: string;
  placeholder: string;
  submitLabel: string;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export function PasteEditorDialog({
  open,
  onOpenChange,
  title,
  description,
  label,
  placeholder,
  submitLabel,
  value,
  onValueChange,
  onSubmit,
  isSubmitting,
}: PasteEditorDialogProps) {
  const fieldId = `${title.toLowerCase().replace(/\s+/g, "-")}-input`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor={fieldId}>{label}</Label>
            <Textarea
              id={fieldId}
              value={value}
              onChange={(event) => onValueChange(event.target.value)}
              className="min-h-52"
              placeholder={placeholder}
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
