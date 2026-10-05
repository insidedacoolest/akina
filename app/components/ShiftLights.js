"use client";

import { useEffect, useState } from "react";

const SEGMENTS = 16;

// Scroll progress rendered as a sequential shift-light bar: white LEDs
// light up as you scroll, the last ones go red, and at the bottom of the
// page the whole bar flashes — "shift!".
export default function ShiftLights() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const lit = Math.round(progress * SEGMENTS);
  const shift = progress > 0.985;

  return (
    <div className={`shift-lights${shift ? " shift" : ""}`} aria-hidden="true">
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <span key={i} className={`${i < lit ? "on" : ""}${i >= SEGMENTS - 4 ? " hot" : ""}`} />
      ))}
    </div>
  );
}
