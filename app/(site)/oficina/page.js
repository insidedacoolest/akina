import Link from "next/link";
import { prisma } from "../../lib/db";
import { getSettings } from "../../lib/settings";
import { eur } from "../../lib/format";
import Icon from "../../components/Icon";
import Marquee from "../../components/Marquee";
import BookingForm from "../../components/BookingForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Oficina — Akina Motorsport", description: "Oficina Akina Motorsport: setups de drift, kits de ângulo, turbo, mapeamento e manutenção. Marca online." };

const STEPS = [
  ["Diagnóstico", "Ouvimos o que queres do carro e vemos o estado real em que está."],
  ["Orçamento", "Plano claro, peças e prazos. Sem surpresas na fatura."],
  ["Execução", "Mãos de quem prepara carros de competição todas as semanas."],
  ["Shakedown", "Testamos antes de entregar. Se possível, de lado."],
];

export default async function OficinaPage() {
  const [settings, services] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
  ]);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-sun" aria-hidden="true" />
        <div className="page-hero-jp jp" aria-hidden="true">ガレージ</div>
        <div className="container">
          <div className="breadcrumb"><Link href="/">Início</Link> / Oficina</div>
          <h1 className="page-hero-word">Ofi<span className="outline">cina</span></h1>
          <p className="lede">Preparação, manutenção e setups de drift feitos por quem compete. O teu carro de estrada, de track day ou de competição — tratado como se fosse nosso.</p>
          <div className="subnav">
            <a href="#marcar" className="btn btn-red"><span>Marcar serviço</span></a>
            <a href="#servicos" className="btn btn-ghost"><span>Ver serviços</span></a>
          </div>
        </div>
      </section>

      <section className="section" id="servicos">
        <div className="container">
          <div className="sec-head">
            <span className="sec-num">01</span>
            <div><h2>Servi<em>ços</em></h2><p>Preços indicativos — o orçamento final depende do carro e das peças.</p></div>
            <span />
          </div>
          <div className="service-grid">
            {services.map((s, i) => (
              <article key={s.id} className={`service-card${s.featured ? " featured" : ""}`}>
                <div className="svc-top">
                  <span className="svc-icon"><Icon name={s.icon} size={30} /></span>
                  <span className="svc-num">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <div className="svc-meta">
                  <span>{s.duration || "—"}</span>
                  <b>{s.priceFrom ? `desde ${eur(s.priceFrom)}` : "sob orçamento"}</b>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={["Setup", "Ângulo", "Turbo", "Mapas", "Shakedown"]} />

      <section className="section">
        <div className="container">
          <div className="sec-head">
            <span className="sec-num">02</span>
            <div><h2>Como <em>trabalhamos</em></h2></div>
            <span />
          </div>
          <div className="process">
            {STEPS.map(([title, text], i) => (
              <div className="process-step" key={title}>
                <span className="dot">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt slant-top" id="marcar">
        <div className="container booking">
          <div className="booking-info">
            <span className="kicker">03 — Marcação</span>
            <h2 className="display-lg">Marca a tua <em>vez</em></h2>
            <p className="lede">Diz-nos o carro e o que precisas. Respondemos com disponibilidade e orçamento.</p>
            <div className="contact-lines">
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`}><Icon name="phone" size={18} />{settings.phone}</a>
              <a href={`mailto:${settings.email}`}><Icon name="mail" size={18} />{settings.email}</a>
              <span><Icon name="pin" size={18} />{settings.address}</span>
              <span><Icon name="clock" size={18} />{settings.hours}</span>
            </div>
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-white">
                <span>Falar no WhatsApp</span>
              </a>
            )}
          </div>
          <div className="booking-panel">
            <BookingForm services={services.map((s) => ({ id: s.id, name: s.name }))} />
          </div>
        </div>
      </section>
    </>
  );
}
