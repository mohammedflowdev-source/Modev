import { renderSignatureIcon } from "@/components/SignatureIcon";

// Apple touch icon: same mark. iOS rounds the corners itself, so the background is square.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderSignatureIcon({ size: 180 });
}
