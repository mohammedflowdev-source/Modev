import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * "MO" mark used for the favicon and apple-touch-icon: light Archivo Bold on the site's dark
 * stone background. Rendered at build time (static), so the font file is read from disk.
 */
export async function renderMoMark({ size, fontSize, radius = 0 }: { size: number; fontSize: number; radius?: number }) {
  const archivoBold = await readFile(join(process.cwd(), "src/assets/fonts/Archivo-Bold.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0a09",
          color: "#f5f5f4",
          borderRadius: radius,
          fontFamily: "Archivo",
          fontSize,
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        MO
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "Archivo", data: archivoBold, weight: 700, style: "normal" }],
    },
  );
}
