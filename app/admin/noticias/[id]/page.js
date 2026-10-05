import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import NewsForm from "../NewsForm";
import { updateNews, deleteNews } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Editar notícia — Painel Akina" };

export default async function EditarNoticiaPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id: Number(id) || 0 } });
  if (!post) notFound();
  return (
    <>
      <div className="admin-head"><div><h1>Editar notícia</h1><p><Link href="/admin/noticias">← Voltar</Link></p></div></div>
      <NewsForm action={updateNews.bind(null, post.id)} initial={post} submitLabel="Guardar alterações" />
      <div className="danger-zone">
        <h3>Zona de perigo</h3>
        <form action={deleteNews.bind(null, post.id)}><ConfirmButton>Apagar notícia</ConfirmButton></form>
      </div>
    </>
  );
}
