"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { PasteItem } from "./paste-item";
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
          <PasteItem key={paste.id} paste={paste} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
