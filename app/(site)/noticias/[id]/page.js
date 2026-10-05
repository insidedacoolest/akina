import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/db";
import { fmtDate } from "../../../lib/format";
import Media from "../../../components/Media";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id: Number(id) || 0 } });
  return { title: post ? `${post.title} — Akina Motorsport` : "Notícia — Akina Motorsport", description: post?.excerpt };
}

export default async function NoticiaPage({ params }) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id: Number(id) || 0 } });
  if (!post) notFound();

  return (
    <section className="section" style={{ paddingTop: "calc(var(--header-h) + 2.5rem)" }}>
      <div className="container">
        <article className="article">
          <div className="breadcrumb"><Link href="/">Início</Link> / <Link href="/noticias">Notícias</Link></div>
          <div className="news-meta" style={{ margin: "2rem 0 1rem" }}><span className="tag">{post.section}</span><span>{fmtDate(post.publishedAt)}</span></div>
          <h1 className="display-md">{post.title}</h1>
          <p className="lede" style={{ margin: "1.4rem 0 2rem" }}>{post.excerpt}</p>
          {post.imageUrl && <Media src={post.imageUrl} alt={post.title} ratio="16 / 9" />}
          <div className="article-body" style={{ marginTop: "2.5rem" }}>{post.body}</div>
          <Link href="/noticias" className="arrow-link" style={{ marginTop: "3rem" }}>← Todas as notícias</Link>
        </article>
      </div>
    </section>
  );
}
