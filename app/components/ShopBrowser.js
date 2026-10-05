"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import Icon from "./Icon";
import { SHOP_SECTIONS, SHOP_CATEGORIES } from "../lib/constants";

// Client-side filtering for the shop: Merch / Peças switch, category chips,
// free-text search (name, brand, reference, fitment) and sorting.
export default function ShopBrowser({ products, initialSection = "merch" }) {
  const [section, setSection] = useState(initialSection);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  function switchSection(value) {
    setSection(value);
    setCategory("all");
    const url = new URL(window.location.href);
    url.searchParams.set("s", value);
    window.history.replaceState(null, "", url);
  }

  const counts = useMemo(() => {
    const c = {};
    for (const p of products) c[p.section] = (c[p.section] || 0) + 1;
    return c;
  }, [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (p.section !== section) return false;
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return [p.name, p.brand, p.sku, p.fitment, p.description].join(" ").toLowerCase().includes(q);
    });
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, section, category, query, sort]);

  return (
    <div className="shop">
      <div className="shop-switch" role="tablist" aria-label="Secção da loja">
        {SHOP_SECTIONS.map((s, i) => (
          <button
            key={s.value}
            role="tab"
            aria-selected={section === s.value}
            className={section === s.value ? "active" : ""}
            onClick={() => switchSection(s.value)}
          >
            <small>0{i + 1} / {counts[s.value] || 0} artigos</small>
            <span>{s.long}</span>
          </button>
        ))}
      </div>

      <div className="shop-toolbar">
        <div className="chips">
          <button className={`chip${category === "all" ? " active" : ""}`} onClick={() => setCategory("all")}>Tudo</button>
          {SHOP_CATEGORIES[section].map((c) => (
            <button key={c.value} className={`chip${category === c.value ? " active" : ""}`} onClick={() => setCategory(c.value)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="shop-tools">
          <label className="search-field">
            <Icon name="search" size={18} />
            <input
              type="search"
              placeholder={section === "pecas" ? "Peça, marca, ref. ou carro…" : "Procurar merch…"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar">
            <option value="recent">Mais recentes</option>
            <option value="price-asc">Preço ↑</option>
            <option value="price-desc">Preço ↓</option>
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">
          <Icon name="search" size={36} />
          <p>Nada encontrado nesta curva. {section === "pecas" && "Não encontras a peça? Fala connosco — encomendamos por medida."}</p>
        </div>
      ) : (
        <div className="product-grid">
          {visible.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
