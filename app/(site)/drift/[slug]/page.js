import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/db";
import Media from "../../../components/Media";
import DriverCard from "../../../components/DriverCard";
import Icon from "../../../components/Icon";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = await prisma.driver.findUnique({ where: { slug } });
  return { title: d ? `${d.name} — Akina Motorsport` : "Piloto — Akina Motorsport" };
}

export default async function DriverPage({ params }) {
  const { slug } = await params;
  const driver = await prisma.driver.findUnique({ where: { slug } });
  if (!driver) notFound();
  const others = await prisma.driver.findMany({ where: { id: { not: driver.id } }, orderBy: [{ order: "asc" }, { id: "asc" }], take: 3 });
  const specs = driver.specs.split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-sun" aria-hidden="true" />
        <div className="container">
          <div className="breadcrumb"><Link href="/">Início</Link> / <Link href="/drift">Drift</Link> / {driver.name}</div>
          <div className="driver-hero" style={{ marginTop: "2rem" }}>
            <Media src={driver.imageUrl} alt={driver.name} label={driver.num} />
            <div>
              <span className="driver-bignum" aria-hidden="true">{driver.num}</span>
              <span className="kicker" style={{ display: "flex", marginTop: "1rem" }}>{driver.role}{driver.nickname ? ` · "${driver.nickname}"` : ""}</span>
              <h1 className="display-lg" style={{ marginTop: ".6rem" }}>{driver.name}</h1>
              {driver.bio && <p className="lede" style={{ marginTop: "1.2rem" }}>{driver.bio}</p>}

              <table className="spec-table">
                <tbody>
                  <tr><th>Carro</th><td>{driver.car}</td></tr>
                  {driver.engine && <tr><th>Motor</th><td>{driver.engine}</td></tr>}
                  {driver.power > 0 && (
                    <tr>
                      <th>Potência</th>
                      <td>{driver.power} cv<div className="power-bar"><i style={{ width: `${Math.min(100, (driver.power / 800) * 100)}%` }} /></div></td>
                    </tr>
                  )}
                  {specs.length > 0 && <tr><th>Preparação</th><td>{specs.map((s) => <div key={s}>— {s}</div>)}</td></tr>}
                </tbody>
              </table>

              {driver.instagram && (
                <a href={driver.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ marginTop: "2rem" }}>
                  <span><Icon name="instagram" size={18} /> Seguir no Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {driver.carImageUrl && (
        <section className="section-tight">
          <div className="container"><Media src={driver.carImageUrl} alt={driver.car} ratio="21 / 9" /></div>
        </section>
      )}

      {others.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head">
              <span className="sec-num">{"//"}</span>
              <div><h2>Resto da <em>crew</em></h2></div>
              <Link href="/drift#equipa" className="arrow-link">Ver equipa <Icon name="arrow" size={16} /></Link>
            </div>
            <div className="driver-grid">{others.map((d) => <DriverCard key={d.id} driver={d} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
