import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import { fmtDate } from "../../../lib/format";
import { BOOKING_STATUS } from "../../../lib/constants";
import { updateBooking, deleteBooking } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Marcação — Painel Akina" };

export default async function MarcacaoPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const b = await prisma.booking.findUnique({ where: { id: Number(id) || 0 } });
  if (!b) notFound();
  const phone = b.phone.replace(/[^\d+]/g, "");

  return (
    <>
      <div className="admin-head">
        <div><h1>Marcação #{b.id}</h1><p><Link href="/admin/marcacoes">← Voltar às marcações</Link></p></div>
        <div className="admin-head-actions">
          <a href={`tel:${phone}`} className="btn btn-sm btn-ghost"><span>Ligar</span></a>
          <a href={`https://wa.me/${phone.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost"><span>WhatsApp</span></a>
          <a href={`mailto:${b.email}?subject=Marcação Akina Motorsport #${b.id}`} className="btn btn-sm btn-red"><span>Responder por email</span></a>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="panel">
          <h2>Pedido</h2>
          <dl className="dl">
            <dt>Nome</dt><dd>{b.name}</dd>
            <dt>Email</dt><dd><a href={`mailto:${b.email}`}>{b.email}</a></dd>
            <dt>Telefone</dt><dd><a href={`tel:${phone}`}>{b.phone}</a></dd>
            <dt>Carro</dt><dd>{b.car}</dd>
            <dt>Serviço</dt><dd>{b.service || "Diagnóstico / a definir"}</dd>
            <dt>Data preferida</dt><dd>{b.preferredDate ? fmtDate(b.preferredDate) : "—"}</dd>
            <dt>Recebida</dt><dd>{new Date(b.createdAt).toLocaleString("pt-PT")}</dd>
            <dt>Mensagem</dt><dd style={{ whiteSpace: "pre-line" }}>{b.message || "—"}</dd>
          </dl>
        </div>
        <div className="panel">
          <h2>Gestão</h2>
          <form action={updateBooking.bind(null, b.id)} className="form">
            <label className="field">
              <span>Estado</span>
              <select name="status" defaultValue={b.status}>
                {BOOKING_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Notas internas</span>
              <textarea name="adminNotes" rows={6} defaultValue={b.adminNotes} placeholder="Orçamento enviado, data combinada, peças a encomendar…" />
            </label>
            <div className="form-actions"><button className="btn btn-red btn-sm"><span>Guardar</span></button></div>
          </form>
        </div>
      </div>

      <div className="danger-zone">
        <h3>Zona de perigo</h3>
        <form action={deleteBooking.bind(null, b.id)}><ConfirmButton>Apagar marcação</ConfirmButton></form>
      </div>
    </>
  );
}
