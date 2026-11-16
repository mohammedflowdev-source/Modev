import { renderMoMark } from "@/components/MoMark";

// Favicon: "MO" mark, light text on the site's dark stone background.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return renderMoMark({ size: 64, fontSize: 30, radius: 12 });
}
