import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { fmtDate } from "../../lib/format";
import { eventKindLabel } from "../../lib/constants";

export const metadata = { title: "Calendário — Painel Akina" };

export default async function EventosPage() {
  await requireAdmin();
  const events = await prisma.event.findMany({ orderBy: { date: "desc" } });
  const now = new Date();
  return (
    <>
      <div className="admin-head">
        <div><h1>Calendário</h1><p>Provas, shows e treinos. Os futuros aparecem na página inicial com contagem decrescente.</p></div>
        <Link href="/admin/eventos/novo" className="btn btn-red btn-sm"><span>+ Novo evento</span></Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Data</th><th>Evento</th><th>Tipo</th><th>Resultado</th><th /></tr></thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} style={e.date < now ? { opacity: 0.6 } : undefined}>
                <td>{fmtDate(e.date)}</td>
                <td><b>{e.title}</b><div className="muted">{e.location}</div></td>
                <td>{eventKindLabel(e.kind)}</td>
                <td>{e.result || <span className="muted">—</span>}</td>
                <td><div className="row-actions"><Link href={`/admin/eventos/${e.id}`}>Editar</Link></div></td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan={5} className="muted">Sem eventos.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
