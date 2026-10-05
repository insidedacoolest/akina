import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { eur, fmtDate } from "../../lib/format";
import { ORDER_STATUS, statusLabel } from "../../lib/constants";

export const metadata = { title: "Encomendas — Painel Akina" };

export default async function EncomendasPage({ searchParams }) {
  await requireAdmin();
  const { estado } = await searchParams;
  const orders = await prisma.order.findMany({
    where: estado ? { status: estado } : undefined,
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="admin-head">
        <div><h1>Encomendas</h1><p>Encomendas feitas na loja. O pagamento é combinado com o cliente.</p></div>
      </div>
      <div className="filter-tabs">
        <Link href="/admin/encomendas" className={!estado ? "active" : ""}>Todas</Link>
        {ORDER_STATUS.map((s) => (
          <Link key={s.value} href={`/admin/encomendas?estado=${s.value}`} className={estado === s.value ? "active" : ""}>{s.label}</Link>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Data</th><th>Cliente</th><th>Entrega</th><th className="num">Itens</th><th className="num">Total</th><th>Estado</th><th /></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td className="muted">{fmtDate(o.createdAt)}</td>
                <td><b>{o.name}</b><div className="muted">{o.email}</div></td>
                <td>{o.delivery === "levantamento" ? "Levantamento" : "Envio"}</td>
                <td className="num">{o._count.items}</td>
                <td className="num">{eur(o.total)}</td>
                <td><span className={`status status-${o.status}`}>{statusLabel(ORDER_STATUS, o.status)}</span></td>
                <td><div className="row-actions"><Link href={`/admin/encomendas/${o.id}`}>Abrir</Link></div></td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={8} className="muted">Sem encomendas.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
