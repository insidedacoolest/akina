"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { createOrder } from "../actions/shop";
import { eur } from "../lib/format";

export default function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", nif: "", delivery: "envio", notes: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result = await createOrder({ ...form, items });
    setPending(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setOrderId(result.orderId);
    clearCart();
  }

  if (orderId) {
    return (
      <div className="checkout-done">
        <span className="tag">Encomenda #{orderId}</span>
        <h2 className="display-md">Bandeira axadrezada!</h2>
        <p className="lede">
          Obrigado, {form.name.split(" ")[0]}. Recebemos a encomenda — vamos confirmar stock e enviar-te os
          dados de pagamento por email ou telefone.
        </p>
        <Link href="/loja" className="btn btn-red"><span>Voltar à loja</span></Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-done">
        <p className="lede">O carrinho está vazio.</p>
        <Link href="/loja" className="btn btn-red"><span>Ver produtos</span></Link>
      </div>
    );
  }

  return (
    <div className="checkout-grid">
      <form className="form" onSubmit={handleSubmit}>
        <h3 className="form-title"><em>01</em> Os teus dados</h3>
        <label className="field">
          <span>Nome</span>
          <input type="text" required autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
        </label>
        <div className="form-row">
          <label className="field">
            <span>Email</span>
            <input type="email" required autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </label>
          <label className="field">
            <span>Telefone</span>
            <input type="tel" required autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </label>
        </div>

        <h3 className="form-title"><em>02</em> Entrega</h3>
        <div className="radio-cards">
          {[
            ["envio", "Envio por transportadora", "Portes calculados e confirmados contigo"],
            ["levantamento", "Levantar na oficina", "Sem portes — combinamos a hora"],
          ].map(([value, title, sub]) => (
            <label key={value} className={`radio-card${form.delivery === value ? " active" : ""}`}>
              <input type="radio" name="delivery" value={value} checked={form.delivery === value} onChange={() => update("delivery", value)} />
              <b>{title}</b>
              <small>{sub}</small>
            </label>
          ))}
        </div>
        <label className="field">
          <span>{form.delivery === "envio" ? "Morada de envio" : "Localidade"}</span>
          <input type="text" required autoComplete="street-address" value={form.address} onChange={(e) => update("address", e.target.value)} />
        </label>
        <div className="form-row">
          <label className="field">
            <span>NIF (opcional, para fatura)</span>
            <input type="text" inputMode="numeric" value={form.nif} onChange={(e) => update("nif", e.target.value)} />
          </label>
        </div>
        <label className="field">
          <span>Notas (opcional)</span>
          <textarea rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Para peças: indica o carro / chassis para confirmarmos compatibilidade." />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-red btn-lg" disabled={pending}>
          <span>{pending ? "A enviar…" : "Confirmar encomenda"}</span>
        </button>
        <p className="fine">Sem pagamento online — depois de confirmarmos a encomenda enviamos os dados para pagamento (MB Way ou transferência).</p>
      </form>

      <aside className="checkout-summary">
        <h3 className="form-title">Resumo</h3>
        {items.map((item) => (
          <div className="summary-line" key={`${item.id}-${item.size || "u"}`}>
            <span>{item.qty}× {item.name}{item.size ? <small> · {item.size}</small> : null}</span>
            <b>{eur(item.price * item.qty)}</b>
          </div>
        ))}
        <div className="summary-total"><span>Total</span><b>{eur(totalPrice)}</b></div>
        <p className="fine">Portes não incluídos.</p>
      </aside>
    </div>
  );
}
