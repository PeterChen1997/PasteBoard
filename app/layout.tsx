import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteFooter } from "./components/site-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Paste Board",
  description: "A modern paste board application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-zinc-900`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-transparent dark:to-zinc-950/50">
            <SiteHeader />
            <main className="flex-1">
              <div className="container mx-auto px-4">{children}</div>
            </main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
