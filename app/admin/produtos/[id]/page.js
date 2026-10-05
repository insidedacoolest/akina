import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import ProductForm from "../ProductForm";
import { updateProduct, deleteProduct } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Editar produto — Painel Akina" };

export default async function EditarProdutoPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) || 0 } });
  if (!product) notFound();

  return (
    <>
      <div className="admin-head">
        <div><h1>Editar produto</h1><p><Link href="/admin/produtos">← Voltar aos produtos</Link></p></div>
        <Link href={`/loja/${product.id}`} target="_blank" className="btn btn-ghost btn-sm"><span>Ver na loja ↗</span></Link>
      </div>
      <ProductForm action={updateProduct.bind(null, product.id)} initial={product} submitLabel="Guardar alterações" />
      <div className="danger-zone">
        <h3>Zona de perigo</h3>
        <form action={deleteProduct.bind(null, product.id)}><ConfirmButton>Apagar produto</ConfirmButton></form>
      </div>
    </>
  );
}
