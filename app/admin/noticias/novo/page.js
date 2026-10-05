import Link from "next/link";
import { requireAdmin } from "../../../lib/authGuard";
import NewsForm from "../NewsForm";
import { createNews } from "../actions";

export const metadata = { title: "Nova notícia — Painel Akina" };

export default async function NovaNoticiaPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-head"><div><h1>Nova notícia</h1><p><Link href="/admin/noticias">← Voltar</Link></p></div></div>
      <NewsForm action={createNews} submitLabel="Publicar" />
    </>
  );
}
