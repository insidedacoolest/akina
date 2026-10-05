import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { eur } from "../../lib/format";
import Icon from "../../components/Icon";

export const metadata = { title: "Serviços — Painel Akina" };

export default async function ServicosPage() {
  await requireAdmin();
  const services = await prisma.service.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  return (
    <>
      <div className="admin-head">
        <div><h1>Serviços</h1><p>Aparecem na página da oficina e no formulário de marcação.</p></div>
        <Link href="/admin/servicos/novo" className="btn btn-red btn-sm"><span>+ Novo serviço</span></Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th /><th>Serviço</th><th>Duração</th><th className="num">Preço desde</th><th className="num">Ordem</th><th /></tr></thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td style={{ width: 40, color: "var(--red)" }}><Icon name={s.icon} size={22} /></td>
                <td><b>{s.name}</b>{s.featured && <span className="muted"> ★ destaque</span>}</td>
                <td>{s.duration || "—"}</td>
                <td className="num">{s.priceFrom ? eur(s.priceFrom) : "orçamento"}</td>
                <td className="num">{s.order}</td>
                <td><div className="row-actions"><Link href={`/admin/servicos/${s.id}`}>Editar</Link></div></td>
              </tr>
            ))}
            {services.length === 0 && <tr><td colSpan={6} className="muted">Sem serviços.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
