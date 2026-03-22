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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";

export function CreateThreadButton() {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a thread title before creating it.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to create thread");
      const thread = await res.json();
      router.push(`/threads/${thread.id}`);
      setOpen(false);
      setTitle("");
      toast({
        title: "Success",
        description: "Thread created successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create thread",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Thread</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Thread</DialogTitle>
          <DialogDescription>
            Start a new thread to group related snippets and notes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Release notes, debugging scratchpad, API snippets..."
              required
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
