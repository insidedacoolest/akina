"use client";

import { useActionState } from "react";
import { createBooking } from "../actions/booking";

export default function BookingForm({ services }) {
  const [state, action, pending] = useActionState(createBooking, undefined);

  if (state?.success) {
    return (
      <div className="booking-done">
        <span className="tag">Pedido #{state.id}</span>
        <h3>Na grelha de partida!</h3>
        <p>Recebemos o teu pedido. Entramos em contacto para confirmar data, orçamento e detalhes.</p>
      </div>
    );
  }

  return (
    <form action={action} className="form">
      <div className="form-row">
        <label className="field">
          <span>Nome</span>
          <input name="name" required autoComplete="name" defaultValue={state?.values?.name} />
        </label>
        <label className="field">
          <span>Telefone</span>
          <input name="phone" type="tel" required autoComplete="tel" defaultValue={state?.values?.phone} />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" defaultValue={state?.values?.email} />
        </label>
        <label className="field">
          <span>Carro (marca, modelo, ano)</span>
          <input name="car" required placeholder="ex. Nissan Skyline R33 1996" defaultValue={state?.values?.car} />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Serviço</span>
          <select name="service" defaultValue={state?.values?.service || ""}>
            <option value="">Ainda não sei — preciso de diagnóstico</option>
            {services.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Data preferida</span>
          <input name="preferredDate" type="date" defaultValue={state?.values?.preferredDate} />
        </label>
      </div>
      <label className="field">
        <span>O que precisas?</span>
        <textarea name="message" rows={4} placeholder="Conta-nos o objetivo: pista, estrada, drift, potência, problema a resolver…" defaultValue={state?.values?.message} />
      </label>
      {state?.error && <p className="form-error">{state.error}</p>}
      <button type="submit" className="btn btn-red btn-lg" disabled={pending}>
        <span>{pending ? "A enviar…" : "Pedir marcação"}</span>
      </button>
      <p className="fine">Ao enviar aceitas ser contactado sobre este pedido. Não usamos os teus dados para mais nada.</p>
    </form>
  );
}
