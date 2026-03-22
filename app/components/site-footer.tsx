export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur">
      <div className="container py-6">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Paste Board</p>
          <p>Threaded snippets for quick capture, editing, and append-first workflows.</p>
        </div>
      </div>
    </footer>
  );
}
