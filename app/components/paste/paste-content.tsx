export function PasteContent({ content }: { content: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border/70 bg-muted/50 p-4 text-sm leading-6 text-foreground">
      {content}
    </pre>
  );
}
