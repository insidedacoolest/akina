import { EVENT_KINDS } from "../../lib/constants";

function pad(n) {
  return String(n).padStart(2, "0");
}
function localDate(d) {
  return d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : "";
}
function localTime(d) {
  return d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : "09:00";
}

export default function EventForm({ action, initial, submitLabel }) {
  const date = initial?.date ? new Date(initial.date) : null;
  const end = initial?.endDate ? new Date(initial.endDate) : null;
  return (
    <form action={action} className="admin-form">
      <fieldset>
        <legend>Evento</legend>
        <label className="field"><span>Título</span><input name="title" required defaultValue={initial?.title} /></label>
        <div className="form-row">
          <label className="field"><span>Local</span><input name="location" required defaultValue={initial?.location} /></label>
          <label className="field">
            <span>Tipo</span>
            <select name="kind" defaultValue={initial?.kind || "prova"}>
              {EVENT_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
            </select>
          </label>
        </div>
        <div className="form-row-3">
          <label className="field"><span>Data</span><input type="date" name="date" required defaultValue={localDate(date)} /></label>
          <label className="field"><span>Hora</span><input type="time" name="time" defaultValue={localTime(date)} /></label>
          <label className="field"><span>Data de fim (opcional)</span><input type="date" name="endDate" defaultValue={localDate(end)} /></label>
        </div>
        <label className="field"><span>Descrição</span><textarea name="desc" rows={3} defaultValue={initial?.desc} /></label>
        <label className="field"><span>Link (bilhetes, organização…)</span><input type="url" name="link" defaultValue={initial?.link || ""} /></label>
        <label className="field">
          <span>Resultado (depois do evento)</span>
          <input name="result" placeholder="ex. 2º lugar Pro · Top 8" defaultValue={initial?.result} />
        </label>
      </fieldset>
      <div className="form-actions"><button className="btn btn-red"><span>{submitLabel}</span></button></div>
    </form>
  );
}
