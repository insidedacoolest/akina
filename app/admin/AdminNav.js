"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "../components/Icon";

const GROUPS = [
  { label: null, links: [{ href: "/admin", label: "Resumo", icon: "gauge", exact: true }] },
  {
    label: "Oficina",
    links: [
      { href: "/admin/marcacoes", label: "Marcações", icon: "clock", badge: "bookings" },
      { href: "/admin/servicos", label: "Serviços", icon: "wrench" },
    ],
  },
  {
    label: "Loja",
    links: [
      { href: "/admin/encomendas", label: "Encomendas", icon: "bag", badge: "orders" },
      { href: "/admin/produtos", label: "Produtos", icon: "cart" },
    ],
  },
  {
    label: "Drift",
    links: [
      { href: "/admin/pilotos", label: "Pilotos", icon: "steering" },
      { href: "/admin/eventos", label: "Calendário", icon: "flag" },
      { href: "/admin/galeria", label: "Galeria", icon: "instagram" },
    ],
  },
  {
    label: "Site",
    links: [
      { href: "/admin/noticias", label: "Notícias", icon: "mail" },
      { href: "/admin/parceiros", label: "Parceiros", icon: "check" },
      { href: "/admin/definicoes", label: "Definições", icon: "gear" },
    ],
  },
];

export default function AdminNav({ badges = {} }) {
  const pathname = usePathname();
  return (
    <nav className="admin-nav">
      {GROUPS.map((g, i) => (
        <div key={i} style={{ display: "contents" }}>
          {g.label && <div className="admin-nav-group">{g.label}</div>}
          {g.links.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            const count = l.badge ? badges[l.badge] : 0;
            return (
              <Link key={l.href} href={l.href} className={active ? "active" : ""}>
                <span><Icon name={l.icon} size={17} />{l.label}</span>
                {count > 0 && <em className="pill">{count}</em>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
