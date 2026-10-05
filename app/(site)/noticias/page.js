import Link from "next/link";
import { prisma } from "../../lib/db";
import { fmtDate } from "../../lib/format";
import Media from "../../components/Media";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notícias — Akina Motorsport" };

export default async function NoticiasPage() {
  const posts = await prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-sun" aria-hidden="true" />
        <div className="page-hero-jp jp" aria-hidden="true">ニュース</div>
        <div className="container">
          <div className="breadcrumb"><Link href="/">Início</Link> / Notícias</div>
          <h1 className="page-hero-word">Pit <span className="outline">talk</span></h1>
          <p className="lede">Novidades da equipa, da oficina e da loja.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <p className="lede">Ainda não há notícias.</p>
          ) : (
            <div className="news-grid">
              {posts.map((n, i) => (
                <Link href={`/noticias/${n.id}`} className={`news-card${i === 0 ? " lead" : ""}`} key={n.id}>
                  <Media src={n.imageUrl} alt={n.title} label={n.section} />
                  <div>
                    <div className="news-meta"><span className="tag">{n.section}</span><span>{fmtDate(n.publishedAt)}</span></div>
                    <h3 style={{ margin: ".7rem 0" }}>{n.title}</h3>
                    <p>{n.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
