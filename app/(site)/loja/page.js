import Link from "next/link";
import { prisma } from "../../lib/db";
import { productToView } from "../../lib/views";
import ShopBrowser from "../../components/ShopBrowser";

export const dynamic = "force-dynamic";
export const metadata = { title: "Loja — Akina Motorsport", description: "Merch oficial Akina Motorsport e peças de performance para drift." };

export default async function LojaPage({ searchParams }) {
  const { s } = await searchParams;
  const rows = await prisma.product.findMany({ orderBy: { id: "desc" } });
  const products = rows.map(productToView);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-sun" aria-hidden="true" />
        <div className="page-hero-jp jp" aria-hidden="true">ショップ</div>
        <div className="container">
          <div className="breadcrumb"><Link href="/">Início</Link> / Loja</div>
          <h1 className="page-hero-word">Lo<span className="outline">ja</span></h1>
          <p className="lede">Veste a crew ou prepara o carro com as peças que usamos em pista. Encomenda online, levanta na oficina ou recebe em casa.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ShopBrowser products={products} initialSection={s === "pecas" ? "pecas" : "merch"} />
        </div>
      </section>
    </>
  );
}
