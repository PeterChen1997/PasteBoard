"use client";

import { Paste } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";

export function ThreadStats({ threadId }: { threadId: string }) {
  const { data: pastes } = useQuery<Paste[]>({
    queryKey: ["pastes", threadId],
    queryFn: async () => {
      const res = await fetch(`/api/threads/${threadId}/pastes`);
      if (!res.ok) throw new Error("Failed to fetch pastes");
      return res.json();
    },
  });

  return (
    <div className="flex items-center gap-2">
      <FileText className="h-4 w-4" />
      <span>{pastes?.length || 0} pastes</span>
    </div>
  );
}
