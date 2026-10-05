import Link from "next/link";
import { requireAdmin } from "../../../lib/authGuard";
import ProductForm from "../ProductForm";
import { createProduct } from "../actions";

export const metadata = { title: "Novo produto — Painel Akina" };

export default async function NovoProdutoPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-head"><div><h1>Novo produto</h1><p><Link href="/admin/produtos">← Voltar aos produtos</Link></p></div></div>
      <ProductForm action={createProduct} submitLabel="Criar produto" />
    </>
  );
}
