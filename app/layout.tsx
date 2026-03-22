import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteFooter } from "./components/site-footer";

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
      <body>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
