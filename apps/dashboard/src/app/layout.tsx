import { cookies } from "next/headers";
import { Toaster } from "@repo/ui/components/sonner";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";

import type { Metadata } from "next";

import "@repo/ui/globals.css";

import { Providers } from "@/components/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <Providers>
            <LayoutWrapper defaultOpen={defaultOpen}>{children}</LayoutWrapper>
            <Toaster />
          </Providers>
        </body>
      </html>
    </>
  );
}
