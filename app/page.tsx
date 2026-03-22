import { CreateThreadButton } from "@/components/create-thread-button";
import { ThreadList } from "@/components/thread-list";

export default function Home() {
  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Workspace
          </p>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Threads</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Organize snippets by topic, keep them editable, and append new
              context without losing the original thread.
            </p>
          </div>
        </div>
        <CreateThreadButton />
      </div>
      <ThreadList />
    </div>
  );
}
