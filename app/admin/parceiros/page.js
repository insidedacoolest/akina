import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { createPartner, updatePartner, deletePartner } from "./actions";
import { ConfirmButton } from "../ui";

export const metadata = { title: "Parceiros — Painel Akina" };

const inputStyle = { background: "var(--bg)", border: "1px solid var(--line-2)", padding: ".5rem .6rem", width: "100%" };

export default async function ParceirosPage() {
  await requireAdmin();
  const partners = await prisma.partner.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  return (
    <>
      <div className="admin-head"><div><h1>Parceiros</h1><p>Logos que aparecem na página inicial. Sem logo, mostra o nome.</p></div></div>

      <form action={createPartner} className="admin-form" style={{ marginBottom: "2.5rem" }}>
        <fieldset>
          <legend>Novo parceiro</legend>
          <div className="form-row-3">
            <label className="field"><span>Nome</span><input name="name" required /></label>
            <label className="field"><span>Link</span><input name="link" type="url" /></label>
            <label className="field"><span>Ordem</span><input name="order" type="number" defaultValue={partners.length} /></label>
          </div>
          <label className="field"><span>Logo (PNG/SVG com fundo transparente)</span><input type="file" name="logo" accept="image/*" /></label>
          <div className="form-actions"><button className="btn btn-red btn-sm"><span>Adicionar</span></button></div>
        </fieldset>
      </form>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Logo</th><th>Nome</th><th>Link</th><th>Ordem</th><th>Novo logo</th><th /></tr></thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td style={{ width: 80 }}>{p.logoUrl ? <img src={p.logoUrl} alt="" style={{ maxHeight: 36, maxWidth: 70 }} /> : <span className="muted">—</span>}</td>
                <td><input form={`p${p.id}`} name="name" defaultValue={p.name} style={inputStyle} /></td>
                <td><input form={`p${p.id}`} name="link" defaultValue={p.link} style={inputStyle} /></td>
                <td style={{ width: 90 }}><input form={`p${p.id}`} name="order" type="number" defaultValue={p.order} style={inputStyle} /></td>
                <td><input form={`p${p.id}`} type="file" name="logo" accept="image/*" style={{ fontSize: ".75rem" }} /></td>
                <td>
                  <div className="row-actions">
                    <form id={`p${p.id}`} action={updatePartner.bind(null, p.id)}><button>Guardar</button></form>
                    <form action={deletePartner.bind(null, p.id)}><ConfirmButton className="danger" message="Apagar este parceiro?">Apagar</ConfirmButton></form>
                  </div>
                </td>
              </tr>
            ))}
            {partners.length === 0 && <tr><td colSpan={6} className="muted">Sem parceiros.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
