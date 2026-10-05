import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import EventForm from "../EventForm";
import { updateEvent, deleteEvent } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Editar evento — Painel Akina" };

export default async function EditarEventoPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id: Number(id) || 0 } });
  if (!event) notFound();
  return (
    <>
      <div className="admin-head"><div><h1>Editar evento</h1><p><Link href="/admin/eventos">← Voltar</Link></p></div></div>
      <EventForm action={updateEvent.bind(null, event.id)} initial={event} submitLabel="Guardar alterações" />
      <div className="danger-zone">
        <h3>Zona de perigo</h3>
        <form action={deleteEvent.bind(null, event.id)}><ConfirmButton>Apagar evento</ConfirmButton></form>
      </div>
    </>
  );
}
