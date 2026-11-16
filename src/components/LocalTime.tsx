"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Africa/Cairo",
  hour: "numeric",
  minute: "2-digit",
});

/** Live Cairo time. Renders a placeholder until mounted to avoid a hydration mismatch. */
export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()));
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums">
      Cairo &middot; <time suppressHydrationWarning>{time ?? "--:--"}</time>
    </span>
  );
}
