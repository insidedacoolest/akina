import { SERVICE_ICONS } from "../../lib/constants";

export default function ServiceForm({ action, initial, submitLabel }) {
  return (
    <form action={action} className="admin-form">
      <fieldset>
        <legend>Serviço</legend>
        <label className="field"><span>Nome</span><input name="name" required defaultValue={initial?.name} /></label>
        <label className="field"><span>Descrição</span><textarea name="description" rows={4} required defaultValue={initial?.description} /></label>
        <div className="form-row-3">
          <label className="field"><span>Preço desde (€, vazio = sob orçamento)</span><input type="number" step="0.01" min="0" name="priceFrom" defaultValue={initial?.priceFrom ?? ""} /></label>
          <label className="field"><span>Duração</span><input name="duration" placeholder="1 dia" defaultValue={initial?.duration} /></label>
          <label className="field"><span>Ordem</span><input type="number" name="order" defaultValue={initial?.order ?? 0} /></label>
        </div>
        <label className="field">
          <span>Ícone</span>
          <select name="icon" defaultValue={initial?.icon || "wrench"}>
            {SERVICE_ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
        <label className="check"><input type="checkbox" name="featured" defaultChecked={initial?.featured} /> Serviço em destaque</label>
      </fieldset>
      <div className="form-actions"><button className="btn btn-red"><span>{submitLabel}</span></button></div>
    </form>
  );
}
