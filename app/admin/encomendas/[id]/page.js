import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import { eur } from "../../../lib/format";
import { ORDER_STATUS } from "../../../lib/constants";
import { updateOrderStatus, deleteOrder } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Encomenda — Painel Akina" };

export default async function EncomendaPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const o = await prisma.order.findUnique({ where: { id: Number(id) || 0 }, include: { items: true } });
  if (!o) notFound();

  return (
    <>
      <div className="admin-head">
        <div><h1>Encomenda #{o.id}</h1><p><Link href="/admin/encomendas">← Voltar às encomendas</Link></p></div>
        <div className="admin-head-actions">
          <a href={`mailto:${o.email}?subject=Encomenda Akina Motorsport #${o.id}`} className="btn btn-sm btn-red"><span>Enviar email ao cliente</span></a>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="panel">
          <h2>Cliente</h2>
          <dl className="dl">
            <dt>Nome</dt><dd>{o.name}</dd>
            <dt>Email</dt><dd><a href={`mailto:${o.email}`}>{o.email}</a></dd>
            <dt>Telefone</dt><dd><a href={`tel:${o.phone}`}>{o.phone}</a></dd>
            <dt>Entrega</dt><dd>{o.delivery === "levantamento" ? "Levantamento na oficina" : "Envio por transportadora"}</dd>
            <dt>Morada</dt><dd>{o.address}</dd>
            <dt>NIF</dt><dd>{o.nif || "—"}</dd>
            <dt>Data</dt><dd>{new Date(o.createdAt).toLocaleString("pt-PT")}</dd>
            <dt>Notas</dt><dd style={{ whiteSpace: "pre-line" }}>{o.notes || "—"}</dd>
          </dl>
        </div>
        <div className="panel">
          <h2>Estado</h2>
          <form action={updateOrderStatus.bind(null, o.id)} className="form">
            <label className="field">
              <span>Estado da encomenda</span>
              <select name="status" defaultValue={o.status}>
                {ORDER_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <div className="form-actions"><button className="btn btn-red btn-sm"><span>Guardar estado</span></button></div>
          </form>
        </div>
      </div>

      <h2 className="form-title" style={{ margin: "2rem 0 1rem" }}>Itens</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Produto</th><th>Opção</th><th className="num">Qtd</th><th className="num">Preço</th><th className="num">Subtotal</th></tr></thead>
          <tbody>
            {o.items.map((it) => (
              <tr key={it.id}>
                <td>{it.productId ? <Link href={`/admin/produtos/${it.productId}`}>{it.productName}</Link> : it.productName}</td>
                <td>{it.size || "—"}</td>
                <td className="num">{it.qty}</td>
                <td className="num">{eur(it.price)}</td>
                <td className="num">{eur(it.price * it.qty)}</td>
              </tr>
            ))}
            <tr><td colSpan={4} className="num"><b>Total (sem portes)</b></td><td className="num"><b>{eur(o.total)}</b></td></tr>
          </tbody>
        </table>
      </div>

      <div className="danger-zone">
        <h3>Zona de perigo</h3>
        <form action={deleteOrder.bind(null, o.id)}><ConfirmButton>Apagar encomenda</ConfirmButton></form>
      </div>
    </>
  );
}
