import type { Metadata, Viewport } from "next";
import { Archivo } from 'next/font/google'
import "lenis/dist/lenis.css";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import SmoothScroll from "@/components/SmoothScroll";

const archivo = Archivo({
  display: "swap",
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-archivo"
})

export const metadata: Metadata = {
  metadataBase: new URL("https://modevflow.vercel.app"),
  title: "Mohammed Mostafa",
  description:
    "Mo Dev — web developer crafting fast, beautiful websites with clean code and thoughtful design that help businesses grow and stand out online.",
  openGraph: {
    title: "Mohammed Mostafa — Mo Dev",
    description:
      "Web developer crafting fast, beautiful websites with clean code and thoughtful design.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased bg-stone-200 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors duration-500 ${archivo.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
