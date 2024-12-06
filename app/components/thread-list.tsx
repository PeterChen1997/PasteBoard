"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { MessageSquare, Clock } from "lucide-react";
import { Thread } from "@/lib/types";

export function ThreadList() {
  const [search, setSearch] = useState("");

  const { data: threads, isLoading } = useQuery<Thread[]>({
    queryKey: ["threads", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const res = await fetch(`/api/threads?${params}`);
      if (!res.ok) throw new Error("Failed to fetch threads");
      return res.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Input
        type="search"
        placeholder="Search threads..."
        className="mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-4">
        {threads?.map((thread) => (
          <Link
            key={thread.id}
            href={`/threads/${thread.id}`}
            className="block p-6 bg-card hover:bg-accent transition-colors rounded-lg border border-border"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                {thread.title}
              </h2>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Updated {format(new Date(thread.updatedAt), "PPpp")}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
