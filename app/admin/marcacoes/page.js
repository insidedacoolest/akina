import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { fmtDate } from "../../lib/format";
import { BOOKING_STATUS, statusLabel } from "../../lib/constants";

export const metadata = { title: "Marcações — Painel Akina" };

export default async function MarcacoesPage({ searchParams }) {
  await requireAdmin();
  const { estado } = await searchParams;
  const bookings = await prisma.booking.findMany({
    where: estado ? { status: estado } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="admin-head">
        <div><h1>Marcações</h1><p>Pedidos feitos no formulário da oficina.</p></div>
      </div>
      <div className="filter-tabs">
        <Link href="/admin/marcacoes" className={!estado ? "active" : ""}>Todas</Link>
        {BOOKING_STATUS.map((s) => (
          <Link key={s.value} href={`/admin/marcacoes?estado=${s.value}`} className={estado === s.value ? "active" : ""}>{s.label}</Link>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Recebida</th><th>Cliente</th><th>Carro</th><th>Serviço</th><th>Data pref.</th><th>Estado</th><th /></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="muted">{fmtDate(b.createdAt)}</td>
                <td><b>{b.name}</b><div className="muted">{b.phone}</div></td>
                <td>{b.car}</td>
                <td>{b.service || <span className="muted">Diagnóstico</span>}</td>
                <td>{b.preferredDate ? fmtDate(b.preferredDate) : "—"}</td>
                <td><span className={`status status-${b.status}`}>{statusLabel(BOOKING_STATUS, b.status)}</span></td>
                <td><div className="row-actions"><Link href={`/admin/marcacoes/${b.id}`}>Abrir</Link></div></td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan={7} className="muted">Sem marcações.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
