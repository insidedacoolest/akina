// Official Akina Motorsport logo (red sun cut by the Mt. Akina ridge +
// italic wordmark). LogoMark is a vector trace of the sun only, for places
// where the wordmark doesn't fit.

export function LogoMark({ size = 40, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 810 810" aria-hidden="true">
      <defs>
        <clipPath id="akina-mark-clip">
          <circle cx="405" cy="405" r="405" />
        </clipPath>
      </defs>
      <g clipPath="url(#akina-mark-clip)" fill="var(--red, #e2242a)">
        <polygon points="-5,-5 815,-5 815,276 600,487 392,303 -5,505" />
        <polygon points="-5,551 413,455 507,578 265,815 -5,815" />
      </g>
    </svg>
  );
}

export default function Logo({ size = "md", className = "" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/img/logo-akina.webp"
      alt="Akina Motorsport"
      width={2000}
      height={818}
      className={`logo logo-${size} ${className}`.trim()}
    />
  );
}
