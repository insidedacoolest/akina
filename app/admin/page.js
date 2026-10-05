import Link from "next/link";
import { requireAdmin } from "../lib/authGuard";
import { prisma } from "../lib/db";
import { eur, fmtDate } from "../lib/format";
import { BOOKING_STATUS, ORDER_STATUS, statusLabel } from "../lib/constants";

export const metadata = { title: "Resumo — Painel Akina" };

export default async function AdminHome() {
  await requireAdmin();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [newBookings, pendingOrders, monthRevenue, soldOut, bookings, orders, nextEvent, counts] = await Promise.all([
    prisma.booking.count({ where: { status: "nova" } }),
    prisma.order.count({ where: { status: "pendente" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: monthStart }, status: { not: "cancelada" } } }),
    prisma.product.count({ where: { inStock: false } }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.event.findFirst({ where: { date: { gte: new Date() } }, orderBy: { date: "asc" } }),
    Promise.all([prisma.product.count(), prisma.driver.count(), prisma.service.count(), prisma.newsPost.count()]),
  ]);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Resumo</h1>
          <p>{nextEvent ? <>Próxima saída: <b>{nextEvent.title}</b> · {fmtDate(nextEvent.date)}</> : "Sem eventos agendados."}</p>
        </div>
        <div className="admin-head-actions">
          <Link href="/admin/produtos/novo" className="btn btn-sm btn-ghost"><span>+ Produto</span></Link>
          <Link href="/admin/noticias/novo" className="btn btn-sm btn-ghost"><span>+ Notícia</span></Link>
          <Link href="/admin/eventos/novo" className="btn btn-sm btn-red"><span>+ Evento</span></Link>
        </div>
      </div>

      <div className="kpis">
        <Link href="/admin/marcacoes?estado=nova" className={`kpi${newBookings ? " hot" : ""}`}><b>{newBookings}</b><span>Marcações por responder</span></Link>
        <Link href="/admin/encomendas?estado=pendente" className={`kpi${pendingOrders ? " hot" : ""}`}><b>{pendingOrders}</b><span>Encomendas pendentes</span></Link>
        <Link href="/admin/encomendas" className="kpi"><b>{eur(monthRevenue._sum.total || 0)}</b><span>Vendas este mês</span></Link>
        <Link href="/admin/produtos" className="kpi"><b>{soldOut}</b><span>Produtos esgotados</span></Link>
        <Link href="/admin/produtos" className="kpi"><b>{counts[0]}</b><span>Produtos na loja</span></Link>
        <Link href="/admin/pilotos" className="kpi"><b>{counts[1]}</b><span>Pilotos</span></Link>
        <Link href="/admin/servicos" className="kpi"><b>{counts[2]}</b><span>Serviços</span></Link>
        <Link href="/admin/noticias" className="kpi"><b>{counts[3]}</b><span>Notícias</span></Link>
      </div>

      <div className="admin-grid-2">
        <div className="panel">
          <h2>Últimas marcações <Link href="/admin/marcacoes">Ver todas →</Link></h2>
          <div className="table-wrap">
            <table>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td><Link href={`/admin/marcacoes/${b.id}`}><b>{b.name}</b></Link><div className="muted">{b.car}</div></td>
                    <td className="muted">{b.service || "Diagnóstico"}</td>
                    <td className="num"><span className={`status status-${b.status}`}>{statusLabel(BOOKING_STATUS, b.status)}</span></td>
                  </tr>
                ))}
                {bookings.length === 0 && <tr><td className="muted">Sem marcações.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel">
          <h2>Últimas encomendas <Link href="/admin/encomendas">Ver todas →</Link></h2>
          <div className="table-wrap">
            <table>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td><Link href={`/admin/encomendas/${o.id}`}><b>#{o.id} · {o.name}</b></Link><div className="muted">{fmtDate(o.createdAt)}</div></td>
                    <td className="num">{eur(o.total)}</td>
                    <td className="num"><span className={`status status-${o.status}`}>{statusLabel(ORDER_STATUS, o.status)}</span></td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td className="muted">Sem encomendas.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
