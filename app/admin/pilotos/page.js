import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";

export const metadata = { title: "Pilotos — Painel Akina" };

export default async function PilotosPage() {
  await requireAdmin();
  const drivers = await prisma.driver.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  return (
    <>
      <div className="admin-head">
        <div><h1>Pilotos</h1><p>A crew que aparece na página Drift.</p></div>
        <Link href="/admin/pilotos/novo" className="btn btn-red btn-sm"><span>+ Novo piloto</span></Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th /><th>#</th><th>Piloto</th><th>Carro</th><th className="num">cv</th><th className="num">Ordem</th><th /></tr></thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td style={{ width: 60 }}>{d.imageUrl ? <img src={d.imageUrl} alt="" className="thumb" /> : <span className="thumb" />}</td>
                <td><b style={{ color: "var(--red)" }}>{d.num}</b></td>
                <td><b>{d.name}</b><div className="muted">{d.role}{d.nickname ? ` · "${d.nickname}"` : ""}</div></td>
                <td>{d.car}</td>
                <td className="num">{d.power || "—"}</td>
                <td className="num">{d.order}</td>
                <td><div className="row-actions"><Link href={`/drift/${d.slug}`} target="_blank">Ver</Link><Link href={`/admin/pilotos/${d.id}`}>Editar</Link></div></td>
              </tr>
            ))}
            {drivers.length === 0 && <tr><td colSpan={7} className="muted">Sem pilotos.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
