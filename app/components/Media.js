import Icon from "./Icon";

// Shows an uploaded photo with the site's duotone treatment, or — when
// no photo exists yet — a branded placeholder (red sun + big label or icon)
// so layouts never look empty before the team uploads real pictures.
export default function Media({ src, alt = "", label, icon, className = "", ratio }) {
  const style = ratio ? { aspectRatio: ratio } : undefined;
  if (src) {
    return (
      <div className={`media ${className}`} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" />
      </div>
    );
  }
  return (
    <div className={`media media-ph ${className}`} style={style} role="img" aria-label={alt || label || ""}>
      <span className="media-sun" aria-hidden="true" />
      <span className="media-lines" aria-hidden="true" />
      {icon ? (
        <Icon name={icon} size={72} strokeWidth={1.1} className="media-icon" />
      ) : (
        label && <span className="media-label" aria-hidden="true">{label}</span>
      )}
    </div>
  );
}
