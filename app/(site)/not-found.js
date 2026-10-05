import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <div>
        <span className="kicker">Erro 404</span>
        <h1 className="display-xl">Spin!</h1>
        <p className="lede" style={{ margin: "1rem auto 2rem" }}>Saíste de pista. Esta página não existe — ou já foi para a sucata.</p>
        <Link href="/" className="btn btn-red btn-lg"><span>Voltar à pista</span></Link>
      </div>
    </section>
  );
}
