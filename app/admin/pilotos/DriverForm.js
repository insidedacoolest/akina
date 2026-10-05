"use client";

import { useActionState } from "react";

export default function DriverForm({ action, initial, submitLabel }) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="admin-form">
      <fieldset>
        <legend>Piloto</legend>
        <div className="form-row-3">
          <label className="field"><span>Nome</span><input name="name" required defaultValue={initial?.name} /></label>
          <label className="field"><span>Alcunha</span><input name="nickname" defaultValue={initial?.nickname} /></label>
          <label className="field"><span>Número</span><input name="num" required maxLength={3} defaultValue={initial?.num} /></label>
        </div>
        <div className="form-row-3">
          <label className="field"><span>Função</span><input name="role" defaultValue={initial?.role || "Piloto"} /></label>
          <label className="field"><span>Instagram (link)</span><input name="instagram" type="url" defaultValue={initial?.instagram} /></label>
          <label className="field"><span>Ordem</span><input type="number" name="order" defaultValue={initial?.order ?? 0} /></label>
        </div>
        <label className="field"><span>Biografia</span><textarea name="bio" rows={4} defaultValue={initial?.bio} /></label>
        <label className="field">
          <span>Endereço da página (opcional)</span>
          <input name="slug" defaultValue={initial?.slug} placeholder="gerado a partir do nome" />
          <span className="hint">Fica em /drift/<b>endereço</b>.</span>
        </label>
      </fieldset>

      <fieldset>
        <legend>Carro</legend>
        <div className="form-row-3">
          <label className="field"><span>Carro</span><input name="car" required defaultValue={initial?.car} /></label>
          <label className="field"><span>Motor</span><input name="engine" defaultValue={initial?.engine} /></label>
          <label className="field"><span>Potência (cv)</span><input type="number" min="0" name="power" defaultValue={initial?.power ?? 0} /></label>
        </div>
        <label className="field"><span>Preparação (uma linha por item)</span><textarea name="specs" rows={5} defaultValue={initial?.specs} /></label>
      </fieldset>

      <fieldset>
        <legend>Fotos</legend>
        <div className="form-row">
          <label className="field">
            <span>Foto do piloto (4:5)</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {initial?.imageUrl && <img src={initial.imageUrl} alt="" className="current-image" />}
            <input type="file" name="image" accept="image/*" />
            {initial?.imageUrl && <label className="check"><input type="checkbox" name="removeImage" /> Remover foto</label>}
          </label>
          <label className="field">
            <span>Foto do carro (panorâmica)</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {initial?.carImageUrl && <img src={initial.carImageUrl} alt="" className="current-image" />}
            <input type="file" name="carImage" accept="image/*" />
            {initial?.carImageUrl && <label className="check"><input type="checkbox" name="removeCarImage" /> Remover foto</label>}
          </label>
        </div>
      </fieldset>

      {state?.error && <p className="form-error">{state.error}</p>}
      <div className="form-actions"><button className="btn btn-red" disabled={pending}><span>{pending ? "A guardar…" : submitLabel}</span></button></div>
    </form>
  );
}
