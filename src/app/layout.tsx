import type { Metadata, Viewport } from "next";
import { Archivo } from 'next/font/google'
import "lenis/dist/lenis.css";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import PageTransition from "@/components/PageTransition";
import ThemeColor from "@/components/ThemeColor";
import { THEME_COLOR_INIT_SCRIPT } from "@/lib/themeColor";
import { signatureFont } from "@/fonts";
import { Analytics } from "@vercel/analytics/next";

const archivo = Archivo({
  display: "swap",
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-archivo"
})

export const metadata: Metadata = {
  metadataBase: new URL("https://modevflow.vercel.app"),
  title: "Mohammed Mostafa — Mo Dev | Web Developer & Designer",
  description:
    "Mo Dev — web developer crafting fast, beautiful websites with clean code and thoughtful design that help businesses grow and stand out online.",
  openGraph: {
    title: "Mohammed Mostafa — Mo Dev",
    description:
      "Web developer crafting fast, beautiful websites with clean code and thoughtful design.",
    siteName: "Mo Dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // No themeColor here on purpose: the browser bar colour follows the site's theme (not the device).
  // The inline script in <body> creates the single theme-color tag before first paint (saved theme,
  // default light) and <ThemeColor /> updates it on toggle. A server-rendered tag would be duplicated
  // by React once the script changes it.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased bg-[var(--page-bg)] text-stone-900 dark:text-stone-100 transition-colors duration-500 ${archivo.variable} ${signatureFont.variable} font-sans`}>
        <script dangerouslySetInnerHTML={{ __html: THEME_COLOR_INIT_SCRIPT }} />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ThemeColor />
          <SmoothScroll><PageTransition>{children}</PageTransition></SmoothScroll>
          <Cursor />
          <div className="grain" aria-hidden="true" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
