import Link from "next/link";
import { prisma } from "../../lib/db";
import { getSettings } from "../../lib/settings";
import { dateParts } from "../../lib/format";
import { eventKindLabel } from "../../lib/constants";
import DriverCard from "../../components/DriverCard";
import Media from "../../components/Media";
import Marquee from "../../components/Marquee";
import Icon from "../../components/Icon";

export const dynamic = "force-dynamic";
export const metadata = { title: "Drift — Akina Motorsport", description: "A equipa de drift Akina Motorsport: pilotos, carros, calendário e galeria." };

function EventRow({ event, past }) {
  const p = dateParts(event.date);
  return (
    <div className={`event-row${past ? " past" : ""}`}>
      <div className="event-date"><b>{p.day}</b><span>{p.month} {p.year}</span></div>
      <div className="event-main">
        <h3>{event.title}</h3>
        {event.desc && <p>{event.desc}</p>}
        <span className="event-loc"><Icon name="pin" size={14} />{event.location}</span>
      </div>
      <div className="event-side">
        <span className={`badge ${past ? "badge-dark" : "badge-red"}`}>{eventKindLabel(event.kind)}</span>
        {past && event.result && <span className="event-result">{event.result}</span>}
        {event.link && <a className="arrow-link" href={event.link} target="_blank" rel="noopener noreferrer">Info <Icon name="arrowUpRight" size={14} /></a>}
      </div>
    </div>
  );
}

export default async function DriftPage() {
  const now = new Date();
  const [settings, drivers, upcoming, past, gallery] = await Promise.all([
    getSettings(),
    prisma.driver.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
    prisma.event.findMany({ where: { date: { gte: now } }, orderBy: { date: "asc" } }),
    prisma.event.findMany({ where: { date: { lt: now } }, orderBy: { date: "desc" }, take: 8 }),
    prisma.galleryImage.findMany({ where: { section: "drift" }, orderBy: [{ order: "asc" }, { id: "desc" }] }),
  ]);

  const placeholders = ["Smoke", "Angle", "Touge", "Crew", "Lock", "Send it"];

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-sun" aria-hidden="true" />
        <div className="page-hero-jp jp" aria-hidden="true">ドリフト</div>
        <div className="container">
          <div className="breadcrumb"><Link href="/">Início</Link> / Drift</div>
          <h1 className="page-hero-word">Dri<span className="outline">ft</span></h1>
          <p className="lede">A equipa. Os carros. As saídas. Tudo o que acontece quando as rodas de trás deixam de concordar com as da frente.</p>
          <div className="subnav">
            <a href="#equipa" className="chip">Equipa</a>
            <a href="#calendario" className="chip">Calendário</a>
            <a href="#galeria" className="chip">Galeria</a>
            <a href="#patrocinios" className="chip">Patrocínios</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container manifesto-grid">
          <p className="manifesto">Não é só <s>fumo</s>. É <em>ângulo</em>, linha e amigos a partilhar a mesma pista.</p>
          <div className="manifesto-side">
            <span className="kicker">Cars • Drift • Fun • Friends</span>
            <p>A Akina nasceu da mesma forma que muitas equipas de drift: um grupo de amigos, carros a mais e fins de semana a menos. Hoje levamos essa energia para provas, shows e encontros — e para a oficina.</p>
          </div>
        </div>
      </section>

      <section className="section section-alt slant-top" id="equipa">
        <div className="container">
          <div className="sec-head">
            <span className="sec-num">01</span>
            <div><h2>Pilotos & <em>máquinas</em></h2><p>Carrega num piloto para ver a ficha técnica completa do carro.</p></div>
            <span />
          </div>
          <div className="driver-grid">
            {drivers.map((d) => <DriverCard key={d.id} driver={d} />)}
          </div>
        </div>
      </section>

      <Marquee items={["Up in smoke", "Touge", "Full lock", "Akina"]} />

      <section className="section" id="calendario">
        <div className="container">
          <div className="sec-head">
            <span className="sec-num">02</span>
            <div><h2>Calen<em>dário</em></h2><p>Provas, shows e treinos onde nos vais encontrar.</p></div>
            <span />
          </div>
          {upcoming.length === 0 ? (
            <p className="lede">Sem datas anunciadas — segue-nos no Instagram para as novidades.</p>
          ) : (
            <div className="event-list">{upcoming.map((e) => <EventRow key={e.id} event={e} />)}</div>
          )}

          {past.length > 0 && (
            <>
              <h3 className="form-title" style={{ marginTop: "4rem", marginBottom: "1rem" }}><em>{"//"}</em> Já passou</h3>
              <div className="event-list">{past.map((e) => <EventRow key={e.id} event={e} past />)}</div>
            </>
          )}
        </div>
      </section>

      <section className="section section-alt" id="galeria">
        <div className="container">
          <div className="sec-head">
            <span className="sec-num">03</span>
            <div><h2>Gale<em>ria</em></h2></div>
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="arrow-link">Mais no Instagram <Icon name="arrowUpRight" size={16} /></a>
          </div>
          <div className="gallery">
            {gallery.length > 0
              ? gallery.map((g) => (
                  <figure key={g.id}>
                    <Media src={g.imageUrl} alt={g.caption} />
                    {g.caption && <figcaption>{g.caption}</figcaption>}
                  </figure>
                ))
              : placeholders.map((label, i) => (
                  <figure key={label}>
                    <Media label={label} ratio={i % 3 === 0 ? "3 / 4" : i % 3 === 1 ? "4 / 3" : "1 / 1"} />
                  </figure>
                ))}
          </div>
        </div>
      </section>

      <section className="section" id="patrocinios">
        <div className="container">
          <div className="cta-band">
            <div>
              <span className="kicker">Patrocínios</span>
              <h3 style={{ marginTop: ".8rem" }}>O teu logo <br />de lado, a fumar.</h3>
              <p>Espaço nos carros, presença nos eventos e conteúdo para as redes. Fala connosco.</p>
            </div>
            <a href={`mailto:${settings.email}?subject=Patrocínio Akina Motorsport`} className="btn btn-red btn-lg"><span>Falar de patrocínio</span></a>
          </div>
        </div>
      </section>
    </>
  );
}
