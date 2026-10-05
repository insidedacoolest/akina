import Link from "next/link";
import { requireAdmin } from "../../../lib/authGuard";
import ServiceForm from "../ServiceForm";
import { createService } from "../actions";

export const metadata = { title: "Novo serviço — Painel Akina" };

export default async function NovoServicoPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-head"><div><h1>Novo serviço</h1><p><Link href="/admin/servicos">← Voltar</Link></p></div></div>
      <ServiceForm action={createService} submitLabel="Criar serviço" />
    </>
  );
}
