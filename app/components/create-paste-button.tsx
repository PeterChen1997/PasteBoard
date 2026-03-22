"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "./ui/use-toast";

export function CreatePasteButton({ threadId }: { threadId: string }) {
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Missing content",
        description: "Add some content before creating a paste.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/threads/${threadId}/pastes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to create paste");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["pastes", threadId] }),
        queryClient.invalidateQueries({ queryKey: ["thread", threadId] }),
        queryClient.invalidateQueries({ queryKey: ["threads"] }),
      ]);
      setContent("");
      setOpen(false);
      toast({
        title: "Success",
        description: "Paste created successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create paste",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Paste</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Paste</DialogTitle>
          <DialogDescription>
            Add a new paste to this thread. You can edit or append more content
            later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="h-40"
              placeholder="Paste text, code, notes, or logs here..."
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
