"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { eur } from "../lib/format";
import Icon from "./Icon";

export default function CartDrawer() {
  const { items, removeItem, updateQty, totalPrice, totalQty, open, setOpen } = useCart();

  return (
    <>
      <div className={`backdrop${open ? " open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`cart-drawer${open ? " open" : ""}`} aria-label="Carrinho de compras" aria-hidden={!open}>
        <div className="cart-head">
          <div>
            <span className="tag">Pit box</span>
            <h3>Carrinho <em>{totalQty}</em></h3>
          </div>
          <button className="icon-btn" aria-label="Fechar carrinho" onClick={() => setOpen(false)}>
            <Icon name="close" />
          </button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <Icon name="cart" size={40} />
              <p>O carrinho está vazio.<br />Bora encher o depósito?</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={`${item.id}-${item.size || "u"}`}>
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-meta">
                    {item.size ? `${item.size} · ` : ""}{eur(item.price)}
                  </div>
                  <div className="qty-stepper sm">
                    <button type="button" onClick={() => updateQty(item.id, item.size, item.qty - 1)} aria-label="Diminuir quantidade">−</button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.id, item.size, item.qty + 1)} aria-label="Aumentar quantidade">+</button>
                  </div>
                </div>
                <div className="cart-item-side">
                  <b>{eur(item.price * item.qty)}</b>
                  <button className="link-btn" onClick={() => removeItem(item.id, item.size)}>Remover</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-foot">
          <div className="cart-total"><span>Total</span><b>{eur(totalPrice)}</b></div>
          {items.length === 0 ? (
            <button className="btn btn-red btn-block" type="button" disabled><span>Finalizar compra</span></button>
          ) : (
            <Link href="/loja/checkout" className="btn btn-red btn-block" onClick={() => setOpen(false)}>
              <span>Finalizar compra</span>
            </Link>
          )}
          <p className="fine">Sem pagamento online — confirmamos stock, portes e pagamento contigo depois da encomenda.</p>
        </div>
      </aside>
    </>
  );
}
