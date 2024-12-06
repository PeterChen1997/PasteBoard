export function PasteContent({ content }: { content: string }) {
  return (
    <pre className="font-mono text-sm bg-muted/50 rounded-md p-4 overflow-x-auto">
      {content}
    </pre>
  );
}