import { requireAdmin } from "../../lib/authGuard";
import { getSettings } from "../../lib/settings";
import SettingsForm from "./SettingsForm";

export const metadata = { title: "Definições — Painel Akina" };

export default async function DefinicoesPage() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <>
      <div className="admin-head"><div><h1>Definições</h1><p>Contactos, textos e fotos principais do site.</p></div></div>
      <SettingsForm settings={settings} />
    </>
  );
}
