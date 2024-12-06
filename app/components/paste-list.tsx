"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Clock, Trash2 } from "lucide-react";
import { Paste } from "@/lib/types";

export function PasteList({ threadId }: { threadId: string }) {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const {
    data: pastes,
    isLoading,
    refetch,
  } = useQuery<Paste[]>({
    queryKey: ["pastes", threadId, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const res = await fetch(`/api/threads/${threadId}/pastes?${params}`);
      if (!res.ok) throw new Error("Failed to fetch pastes");
      return res.json();
    },
  });

  const handleDelete = async (pasteId: string) => {
    try {
      const res = await fetch(`/api/threads/${threadId}/pastes/${pasteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete paste");
      refetch();
      toast({
        title: "Success",
        description: "Paste deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete paste",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Input
        type="search"
        placeholder="Search pastes..."
        className="mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-4">
        {pastes?.map((paste) => (
          <div
            key={paste.id}
            className="group relative overflow-hidden rounded-lg border border-border bg-card transition-colors hover:bg-accent"
          >
            <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(paste.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <time dateTime={paste.createdAt}>
                  {format(new Date(paste.createdAt), "PPpp")}
                </time>
              </div>
              <pre className="font-mono text-sm bg-muted/50 rounded-md p-4 overflow-x-auto">
                {paste.content}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
