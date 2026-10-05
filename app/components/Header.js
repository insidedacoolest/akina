"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import Icon from "./Icon";
import ShiftLights from "./ShiftLights";
import { useCart } from "./CartContext";

const NAV = [
  { href: "/drift", label: "Drift", jp: "ドリフト" },
  { href: "/oficina", label: "Oficina", jp: "ガレージ" },
  { href: "/loja", label: "Loja", jp: "ショップ" },
  { href: "/noticias", label: "Notícias", jp: "ニュース" },
];

export default function Header() {
  const pathname = usePathname();
  const { totalQty, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
      <ShiftLights />
      <div className="header-inner">
        <Link href="/" className="header-brand" aria-label="Akina Motorsport — início" onClick={() => setMenuOpen(false)}>
          <Logo />
        </Link>

        <nav className="main-nav" aria-label="Principal">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname.startsWith(item.href) ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-num" aria-hidden="true">0{i + 1}</span>
              <span className="nav-label">{item.label}</span>
              <span className="nav-jp" aria-hidden="true">{item.jp}</span>
            </Link>
          ))}
          <Link href="/oficina#marcar" className="nav-mobile-cta" onClick={() => setMenuOpen(false)}>
            <span className="nav-label">Marcar oficina →</span>
          </Link>
        </nav>

        <div className="header-actions">
          <Link href="/oficina#marcar" className="btn btn-red btn-sm header-cta"><span>Marcar oficina</span></Link>
          <button type="button" className="icon-btn cart-btn" onClick={() => setOpen(true)} aria-label={`Abrir carrinho (${totalQty})`}>
            <Icon name="cart" />
            {totalQty > 0 && <span className="cart-count">{totalQty}</span>}
          </button>
          <button type="button" className="icon-btn menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" aria-expanded={menuOpen}>
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
