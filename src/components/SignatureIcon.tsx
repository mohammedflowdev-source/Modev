import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Favicon / apple-touch-icon: a script "M" in the signature font (#F5F5F4) with a small orange dot,
 * on a #0C0A09 square. Rendered at build time, so the font file is read from disk.
 */
export async function renderSignatureIcon({ size, radius = 0 }: { size: number; radius?: number }) {
  const font = await readFile(join(process.cwd(), "src/assets/fonts/MrsSaintDelafield-Regular.ttf"));
  const s = size / 100; // layout below is in a 100-unit box
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          background: "#0C0A09",
          borderRadius: radius,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Signature",
            fontSize: 78 * s,
            lineHeight: 1,
            color: "#F5F5F4",
            marginTop: 20 * s,
            marginLeft: -8 * s,
          }}
        >
          M
        </div>
        <div
          style={{
            position: "absolute",
            width: 10 * s,
            height: 10 * s,
            borderRadius: 999,
            background: "#E5683F",
            right: 12 * s,
            bottom: 30 * s,
          }}
        />
      </div>
    ),
    { width: size, height: size, fonts: [{ name: "Signature", data: font, weight: 400, style: "normal" }] },
  );
}
