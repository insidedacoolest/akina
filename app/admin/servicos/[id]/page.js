import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import ServiceForm from "../ServiceForm";
import { updateService, deleteService } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Editar serviço — Painel Akina" };

export default async function EditarServicoPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id: Number(id) || 0 } });
  if (!service) notFound();
  return (
    <>
      <div className="admin-head"><div><h1>Editar serviço</h1><p><Link href="/admin/servicos">← Voltar</Link></p></div></div>
      <ServiceForm action={updateService.bind(null, service.id)} initial={service} submitLabel="Guardar alterações" />
      <div className="danger-zone">
        <h3>Zona de perigo</h3>
        <form action={deleteService.bind(null, service.id)}><ConfirmButton>Apagar serviço</ConfirmButton></form>
      </div>
    </>
  );
}
