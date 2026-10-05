import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/db";
import { productToView } from "../../../lib/views";
import { categoryLabel, SHOP_SECTIONS } from "../../../lib/constants";
import ProductGallery from "../../../components/ProductGallery";
import ProductDetailActions from "../../../components/ProductDetailActions";
import ProductCard from "../../../components/ProductCard";
import Icon from "../../../components/Icon";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const row = await prisma.product.findUnique({ where: { id: Number(id) || 0 } });
  if (!row) return { title: "Produto — Akina Motorsport" };
  return { title: `${row.name} — Loja Akina Motorsport`, description: row.description || undefined };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const row = await prisma.product.findUnique({ where: { id: Number(id) || 0 } });
  if (!row) notFound();
  const product = productToView(row);
  const isPart = product.section === "pecas";
  const sectionLabel = SHOP_SECTIONS.find((s) => s.value === product.section)?.label;

  const related = (
    await prisma.product.findMany({ where: { section: product.section, id: { not: product.id } }, orderBy: { id: "desc" }, take: 8 })
  )
    .map(productToView)
    .sort((a, b) => (b.category === product.category) - (a.category === product.category))
    .slice(0, 4);

  return (
    <>
      <section className="section" style={{ paddingTop: "calc(var(--header-h) + 2.5rem)" }}>
        <div className="container">
          <div className="breadcrumb" style={{ marginBottom: "2rem" }}>
            <Link href="/">Início</Link> / <Link href={`/loja?s=${product.section}`}>Loja · {sectionLabel}</Link> / {product.name}
          </div>
          <div className="product-detail">
            <ProductGallery product={product} />
            <div>
              <div className="pd-head">
                <span className="tag">{product.brand ? `${product.brand} · ` : ""}{categoryLabel(product.section, product.category)}</span>
                <h1>{product.name}</h1>
                {product.sku && <span className="pd-sku">REF. {product.sku}</span>}
              </div>

              {isPart && product.fitment && (
                <div className="fitment"><b>Compatibilidade</b>{product.fitment}</div>
              )}

              {product.description && <p className="lede">{product.description}</p>}

              <ProductDetailActions product={product} />

              <span className={`stock${product.inStock ? "" : " out"}`}>
                {product.inStock ? "Em stock" : "Esgotado — pergunta-nos pela reposição"}
              </span>

              <div className="perks">
                <div><Icon name="flag" size={20} /><span><b>Levantamento na oficina</b>Sem portes — escolhe no checkout.</span></div>
                <div><Icon name="mail" size={20} /><span><b>Confirmação pessoal</b>Confirmamos stock e pagamento contigo antes de enviar.</span></div>
                {isPart && (
                  <div><Icon name="wrench" size={20} /><span><b>Montagem na Akina</b><Link href="/oficina#marcar" style={{ textDecoration: "underline" }}>Marca a instalação</Link> na nossa oficina.</span></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="sec-head">
              <span className="sec-num">+</span>
              <div><h2>Também <em>te serve</em></h2></div>
              <Link href={`/loja?s=${product.section}`} className="arrow-link">Ver tudo <Icon name="arrow" size={16} /></Link>
            </div>
            <div className="product-grid">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
