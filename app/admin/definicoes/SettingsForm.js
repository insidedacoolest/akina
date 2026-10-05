"use client";

import { useActionState } from "react";
import { saveSettings, changePassword } from "./actions";

function ImageField({ name, label, value, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value && <img src={value} alt="" className="current-image" />}
      <input type="file" name={name} accept="image/*" />
      {value && <label className="check"><input type="checkbox" name={`remove_${name}`} /> Remover</label>}
      {hint && <span className="hint">{hint}</span>}
    </label>
  );
}

export default function SettingsForm({ settings }) {
  const [state, action, pending] = useActionState(saveSettings, undefined);
  const [pwState, pwAction, pwPending] = useActionState(changePassword, undefined);

  return (
    <>
      <form action={action} className="admin-form">
        <fieldset>
          <legend>Contactos</legend>
          <div className="form-row">
            <label className="field"><span>Telefone</span><input name="phone" defaultValue={settings.phone} /></label>
            <label className="field"><span>WhatsApp (só números, com indicativo)</span><input name="whatsapp" defaultValue={settings.whatsapp} placeholder="351912345678" /></label>
          </div>
          <div className="form-row">
            <label className="field"><span>Email</span><input name="email" type="email" defaultValue={settings.email} /></label>
            <label className="field"><span>Horário</span><input name="hours" defaultValue={settings.hours} /></label>
          </div>
          <label className="field"><span>Morada da oficina</span><input name="address" defaultValue={settings.address} /></label>
          <div className="form-row">
            <label className="field"><span>Instagram</span><input name="instagram" type="url" defaultValue={settings.instagram} /></label>
            <label className="field"><span>YouTube</span><input name="youtube" type="url" defaultValue={settings.youtube} /></label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Página inicial</legend>
          <label className="field"><span>Frase de apresentação</span><textarea name="heroTagline" rows={2} defaultValue={settings.heroTagline} /></label>
          <div className="form-row">
            <label className="field"><span>Nº seguidores (texto)</span><input name="statFollowers" defaultValue={settings.statFollowers} /></label>
            <label className="field"><span>Nº publicações (texto)</span><input name="statPosts" defaultValue={settings.statPosts} /></label>
          </div>
          <ImageField name="heroImage" label="Foto de fundo do topo" value={settings.heroImage} hint="Horizontal, mín. 2000px de largura. Aparece a preto e branco atrás do sol." />
          <div className="form-row">
            <ImageField name="driftImage" label="Foto do painel DRIFT" value={settings.driftImage} />
            <ImageField name="oficinaImage" label="Foto do painel OFICINA" value={settings.oficinaImage} />
          </div>
        </fieldset>

        <div className="form-actions">
          <button className="btn btn-red" disabled={pending}><span>{pending ? "A guardar…" : "Guardar definições"}</span></button>
          {state?.saved && <span className="hint" style={{ color: "var(--ok)" }}>✓ Guardado</span>}
        </div>
      </form>

      <form action={pwAction} className="admin-form" style={{ marginTop: "3rem" }}>
        <fieldset>
          <legend>Mudar palavra-passe</legend>
          <div className="form-row">
            <label className="field"><span>Atual</span><input type="password" name="current" required autoComplete="current-password" /></label>
            <label className="field"><span>Nova (mín. 8 caracteres)</span><input type="password" name="next" required minLength={8} autoComplete="new-password" /></label>
          </div>
          {pwState?.error && <p className="form-error">{pwState.error}</p>}
          {pwState?.ok && <p className="hint" style={{ color: "var(--ok)" }}>✓ Palavra-passe alterada.</p>}
          <div className="form-actions"><button className="btn btn-ghost btn-sm" disabled={pwPending}><span>Alterar palavra-passe</span></button></div>
        </fieldset>
      </form>
    </>
  );
}
