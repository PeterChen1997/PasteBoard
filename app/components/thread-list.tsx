"use client";

import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { Clock, FileText, MessageSquare, Search } from "lucide-react";
import { Thread } from "@/lib/types";

export function ThreadList() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());

  const {
    data: threads,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<Thread[]>({
    queryKey: ["threads", deferredSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (deferredSearch) params.append("search", deferredSearch);
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
      <div className="mb-6 rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search threads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {isFetching
            ? "Refreshing threads..."
            : `${threads?.length ?? 0} thread${threads?.length === 1 ? "" : "s"} visible`}
        </p>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <p className="text-sm font-medium text-foreground">
            We couldn&apos;t load the thread list.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm font-medium text-primary"
          >
            Try again
          </button>
        </div>
      ) : threads?.length ? (
        <div className="space-y-4">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              href={`/threads/${thread.id}`}
              className="block rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-card-foreground">
                      {thread.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Thread ID: {thread.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Updated {format(new Date(thread.updatedAt), "PPpp")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      {thread.pasteCount} pastes
                    </span>
                  </div>
                </div>
                <MessageSquare className="mt-1 h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
          <p className="text-lg font-medium text-foreground">
            {deferredSearch ? "No threads match that search yet." : "No threads yet."}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {deferredSearch
              ? "Try a different keyword or create a new thread."
              : "Create your first thread to start collecting snippets."}
          </p>
        </div>
      )}
    </div>
  );
}
