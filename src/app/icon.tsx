import { renderSignatureIcon } from "@/components/SignatureIcon";

// Favicon: script "M" with an orange dot on a dark rounded square.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return renderSignatureIcon({ size: 64, radius: 14 });
}
