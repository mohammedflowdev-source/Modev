"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { THEME_COLORS } from "@/lib/themeColor";

const setThemeColor = (color: string) => {
  let metas = Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'));
  if (!metas.length) {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
    metas = [meta];
  }
  for (const meta of metas) {
    meta.removeAttribute("media");
    meta.content = color;
  }
};

/** Keeps the theme-color meta in sync when the visitor toggles the theme (and after page navigation). */
export default function ThemeColor() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  useEffect(() => {
    if (!resolvedTheme) return;
    setThemeColor(resolvedTheme === "dark" ? THEME_COLORS.dark : THEME_COLORS.light);
  }, [resolvedTheme, pathname]);
  return null;
}
