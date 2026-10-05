import Link from "next/link";
import { requireAdmin } from "../../../lib/authGuard";
import EventForm from "../EventForm";
import { createEvent } from "../actions";

export const metadata = { title: "Novo evento — Painel Akina" };

export default async function NovoEventoPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-head"><div><h1>Novo evento</h1><p><Link href="/admin/eventos">← Voltar</Link></p></div></div>
      <EventForm action={createEvent} submitLabel="Criar evento" />
    </>
  );
}
