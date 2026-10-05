import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { eur } from "../../lib/format";
import { SHOP_SECTIONS, categoryLabel } from "../../lib/constants";
import { toggleStock } from "./actions";

export const metadata = { title: "Produtos — Painel Akina" };

export default async function ProdutosPage({ searchParams }) {
  await requireAdmin();
  const { s } = await searchParams;
  const products = await prisma.product.findMany({
    where: s ? { section: s } : undefined,
    orderBy: [{ section: "asc" }, { id: "desc" }],
  });

  return (
    <>
      <div className="admin-head">
        <div><h1>Produtos</h1><p>{products.length} produto(s).</p></div>
        <Link href="/admin/produtos/novo" className="btn btn-red btn-sm"><span>+ Novo produto</span></Link>
      </div>
      <div className="filter-tabs">
        <Link href="/admin/produtos" className={!s ? "active" : ""}>Todos</Link>
        {SHOP_SECTIONS.map((x) => (
          <Link key={x.value} href={`/admin/produtos?s=${x.value}`} className={s === x.value ? "active" : ""}>{x.long}</Link>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th /><th>Produto</th><th>Categoria</th><th className="num">Preço</th><th>Stock</th><th /></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td style={{ width: 60 }}>{p.imageUrl ? <img src={p.imageUrl} alt="" className="thumb" /> : <span className="thumb" />}</td>
                <td>
                  <Link href={`/admin/produtos/${p.id}`}><b>{p.name}</b></Link>
                  <div className="muted">{[p.brand, p.sku].filter(Boolean).join(" · ")}{p.featured ? " ★ destaque" : ""}</div>
                </td>
                <td>{p.section === "pecas" ? "Peças" : "Merch"} · {categoryLabel(p.section, p.category)}</td>
                <td className="num">{eur(p.price)}</td>
                <td>
                  <form action={toggleStock.bind(null, p.id)}>
                    <button className={`status ${p.inStock ? "status-concluida" : "status-cancelada"}`} style={{ background: "none", cursor: "pointer" }} title="Clicar para alternar">
                      {p.inStock ? "Em stock" : "Esgotado"}
                    </button>
                  </form>
                </td>
                <td><div className="row-actions"><Link href={`/loja/${p.id}`} target="_blank">Ver</Link><Link href={`/admin/produtos/${p.id}`}>Editar</Link></div></td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={6} className="muted">Ainda não há produtos.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
