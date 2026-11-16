import { renderMoMark } from "@/components/MoMark";

// Apple touch icon: same "MO" mark. iOS rounds the corners itself, so the background is square.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderMoMark({ size: 180, fontSize: 80 });
}
