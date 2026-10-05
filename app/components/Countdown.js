"use client";

import { useEffect, useState } from "react";

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
  };
}

export default function Countdown({ target }) {
  const [t, setT] = useState(null);

  useEffect(() => {
    const tick = () => setT(diff(target));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [target]);

  const cells = [
    ["d", "Dias"],
    ["h", "Horas"],
    ["m", "Min"],
    ["s", "Seg"],
  ];

  return (
    <div className="countdown" aria-label="Contagem decrescente">
      {cells.map(([k, label]) => (
        <div className="countdown-cell" key={k}>
          <b>{t ? String(t[k]).padStart(2, "0") : "--"}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
