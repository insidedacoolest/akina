import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import DriverForm from "../DriverForm";
import { updateDriver, deleteDriver } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Editar piloto — Painel Akina" };

export default async function EditarPilotoPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const driver = await prisma.driver.findUnique({ where: { id: Number(id) || 0 } });
  if (!driver) notFound();
  return (
    <>
      <div className="admin-head">
        <div><h1>{driver.name}</h1><p><Link href="/admin/pilotos">← Voltar</Link></p></div>
        <Link href={`/drift/${driver.slug}`} target="_blank" className="btn btn-ghost btn-sm"><span>Ver página ↗</span></Link>
      </div>
      <DriverForm action={updateDriver.bind(null, driver.id)} initial={driver} submitLabel="Guardar alterações" />
      <div className="danger-zone">
        <h3>Zona de perigo</h3>
        <form action={deleteDriver.bind(null, driver.id)}><ConfirmButton>Apagar piloto</ConfirmButton></form>
      </div>
    </>
  );
}
