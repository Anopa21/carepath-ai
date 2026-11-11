import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "CarePath AI",
  description: "Preventive care navigation platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <LanguageProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col md:flex-row">
              <Sidebar />
              <div className="min-w-0 flex-1">{children}</div>
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
