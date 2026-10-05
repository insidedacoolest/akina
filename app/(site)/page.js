import Link from "next/link";
import { prisma } from "../lib/db";
import { getSettings } from "../lib/settings";
import { productToView } from "../lib/views";
import { fmtDate, dateParts, eur } from "../lib/format";
import { eventKindLabel } from "../lib/constants";
import Marquee from "../components/Marquee";
import Media from "../components/Media";
import Icon from "../components/Icon";
import Countdown from "../components/Countdown";
import ProductCard from "../components/ProductCard";
import DriverCard from "../components/DriverCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const now = new Date();
  const [settings, drivers, nextEvent, products, services, news, partners] = await Promise.all([
    getSettings(),
    prisma.driver.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }], take: 4 }),
    prisma.event.findFirst({ where: { date: { gte: now } }, orderBy: { date: "asc" } }),
    prisma.product.findMany({ where: { featured: true }, orderBy: { id: "desc" }, take: 4 }),
    prisma.service.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }], take: 5 }),
    prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.partner.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
  ]);

  const next = nextEvent ? dateParts(nextEvent.date) : null;

  return (
    <>
      {/* HERO */}
      <section className="hero">
        {settings.heroImage && (
          <div className="hero-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.heroImage} alt="" />
          </div>
        )}
        <div className="hero-sun" aria-hidden="true" />
        <div className="smoke s1" /><div className="smoke s2" /><div className="smoke s3" />
        <div className="hero-jp jp" aria-hidden="true">秋名<small>AKINA</small></div>

        <div className="container hero-content">
          <span className="kicker">Drift team & garage — Portugal</span>
          <h1 className="hero-title">
            <span className="line"><span>Akina</span></span>
            <span className="line indent"><span className="outline">Motor</span></span>
            <span className="line"><span>sport<sup>EST. 2019</sup></span></span>
          </h1>
          <p className="hero-lede">{settings.heroTagline}</p>
          <div className="hero-ctas">
            <Link href="/drift" className="btn btn-red btn-lg"><span>Equipa de Drift <Icon name="arrow" size={18} /></span></Link>
            <Link href="/oficina" className="btn btn-ghost btn-lg"><span>Oficina</span></Link>
          </div>
        </div>

        <div className="hero-hud">
          <div className="hud-cell"><b>{settings.statFollowers}</b><span>Seguidores</span></div>
          <div className="hud-cell"><b>{settings.statPosts}</b><span>Publicações</span></div>
          <div className="hud-cell"><b>{String(drivers.length).padStart(2, "0")}<em>/</em> crew</b><span>Pilotos</span></div>
          <div className="hud-cell">
            <b>{next ? <>{next.day}<em>.</em>{next.month}</> : "TBA"}</b>
            <span>Próxima saída</span>
          </div>
        </div>
      </section>

      <Marquee />

      {/* SPLIT */}
      <section className="split" aria-label="Escolhe o teu caminho">
        <Link href="/drift" className="split-panel">
          <Media src={settings.driftImage} alt="" />
          <div className="split-top"><span>01 — Equipa</span><span className="jp">ドリフト</span></div>
          <div className="split-bottom">
            <span className="split-word">Drift</span>
            <p className="split-desc">Pilotos, carros, calendário de provas e galeria.</p>
            <span className="split-go"><Icon name="arrow" /></span>
          </div>
        </Link>
        <Link href="/oficina" className="split-panel">
          <Media src={settings.oficinaImage} alt="" />
          <div className="split-top"><span>02 — Garage</span><span className="jp">ガレージ</span></div>
          <div className="split-bottom">
            <span className="split-word">Oficina</span>
            <p className="split-desc">Preparação e manutenção de carros de prova e outros japoneses. Marca online.</p>
            <span className="split-go"><Icon name="arrow" /></span>
          </div>
        </Link>
      </section>

      {/* NEXT EVENT */}
      {nextEvent && (
        <section className="next-event">
          <div className="container next-event-grid">
            <div>
              <span className="kicker">Próxima saída · {eventKindLabel(nextEvent.kind)}</span>
              <h2>{nextEvent.title}</h2>
              <div className="next-event-meta">
                <span><Icon name="pin" size={18} />{nextEvent.location}</span>
                <span><Icon name="flag" size={18} />{fmtDate(nextEvent.date)}</span>
              </div>
            </div>
            <Countdown target={nextEvent.date.toISOString()} />
          </div>
        </section>
      )}

      {/* TEAM */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <span className="sec-num">03</span>
            <div>
              <h2>A <em>crew</em></h2>
              <p>Quem conduz, quem prepara e quem faz tudo acontecer.</p>
            </div>
            <Link href="/drift#equipa" className="arrow-link">Equipa completa <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="driver-grid">
            {drivers.map((d) => <DriverCard key={d.id} driver={d} />)}
          </div>
        </div>
      </section>

      <Marquee items={["Merch", "Peças", "Performance", "Akina"]} variant="white" reverse />

      {/* SHOP */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <span className="sec-num">04</span>
            <div>
              <h2>Loja <em>/</em> pit shop</h2>
              <p>Merch oficial da equipa e peças automotivas para carros japoneses ou de competição.</p>
            </div>
            <Link href="/loja" className="arrow-link">Ver loja <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="product-grid">
            {products.map((p) => <ProductCard key={p.id} product={productToView(p)} />)}
          </div>
          <div className="subnav" style={{ marginTop: "2.5rem" }}>
            <Link href="/loja?s=merch" className="btn btn-white"><span>Merch</span></Link>
            <Link href="/loja?s=pecas" className="btn btn-ghost"><span>Peças & performance</span></Link>
          </div>
        </div>
      </section>

      {/* OFICINA */}
      <section className="section section-alt slant-top">
        <div className="container">
          <div className="sec-head">
            <span className="sec-num">05</span>
            <div>
              <h2>Na <em>oficina</em></h2>
              <p>O que aprendemos em pista aplicado no teu carro — de estrada ou de competição.</p>
            </div>
            <Link href="/oficina#marcar" className="btn btn-red"><span>Marcar serviço</span></Link>
          </div>
          <div className="spec-list">
            {services.map((s, i) => (
              <Link href="/oficina#servicos" className="spec-row" key={s.id}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.name}</h3>
                <span className="p">{s.priceFrom ? `desde ${eur(s.priceFrom)}` : "sob orçamento"}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      {news.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head">
              <span className="sec-num">06</span>
              <div><h2>Pit <em>talk</em></h2></div>
              <Link href="/noticias" className="arrow-link">Todas as notícias <Icon name="arrow" size={16} /></Link>
            </div>
            <div className="news-grid">
              {news.map((n) => (
                <Link href={`/noticias/${n.id}`} className="news-card" key={n.id}>
                  <Media src={n.imageUrl} alt={n.title} label={n.section} />
                  <div className="news-meta"><span className="tag">{n.section}</span><span>{fmtDate(n.publishedAt)}</span></div>
                  <h3>{n.title}</h3>
                  <p>{n.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PARTNERS */}
      {partners.length > 0 && (
        <section className="section-tight">
          <div className="container">
            <span className="kicker" style={{ marginBottom: "1.5rem" }}>Parceiros que alinham connosco</span>
            <div className="partners" style={{ marginTop: "1.5rem" }}>
              {partners.map((p) => (
                <a key={p.id} href={p.link || "#"} target="_blank" rel="noopener noreferrer" className="partner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.logoUrl ? <img src={p.logoUrl} alt={p.name} /> : <span>{p.name}</span>}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* INSTAGRAM */}
      <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="insta-cta">
        <div className="container">
          <span className="kicker">Segue a crew</span>
          <span className="insta-handle">@akina<br />.motorsport</span>
          <span className="btn btn-dark"><span><Icon name="instagram" size={18} /> Abrir Instagram</span></span>
        </div>
      </a>
    </>
  );
}
