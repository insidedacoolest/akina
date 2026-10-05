import Link from "next/link";
import Media from "./Media";

export default function DriverCard({ driver }) {
  return (
    <Link href={`/drift/${driver.slug}`} className="driver-card">
      <Media src={driver.imageUrl} alt={driver.name} />
      <span className="driver-num" aria-hidden="true">{driver.num}</span>
      <div className="driver-info">
        <small>{driver.role}{driver.nickname ? ` · "${driver.nickname}"` : ""}</small>
        <h3>{driver.name}</h3>
        <div className="driver-car">
          <span>{driver.car}</span>
          {driver.power > 0 && <b>{driver.power} cv</b>}
        </div>
      </div>
    </Link>
  );
}
