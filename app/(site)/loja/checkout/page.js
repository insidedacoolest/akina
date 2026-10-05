import Link from "next/link";
import CheckoutForm from "../../../components/CheckoutForm";

export const metadata = { title: "Finalizar compra — Akina Motorsport" };

export default function CheckoutPage() {
  return (
    <section className="section" style={{ paddingTop: "calc(var(--header-h) + 2.5rem)" }}>
      <div className="container">
        <div className="breadcrumb"><Link href="/">Início</Link> / <Link href="/loja">Loja</Link> / Checkout</div>
        <h1 className="display-lg" style={{ margin: "1rem 0 2.5rem" }}>Última <em>volta</em></h1>
        <CheckoutForm />
      </div>
    </section>
  );
}
