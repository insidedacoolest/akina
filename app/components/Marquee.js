export default function Marquee({ items = ["Cars", "Drift", "Fun", "Friends"], variant = "red", reverse = false }) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className={`marquee marquee-${variant}${reverse ? " reverse" : ""}`} aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div className="marquee-group" key={k}>
            {row.map((t, i) => (
              <span key={i}>{t}<i>✦</i></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
