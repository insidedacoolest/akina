"use server";

import { prisma } from "../lib/db";

export async function createOrder(data) {
  const name = String(data?.name || "").trim();
  const email = String(data?.email || "").trim();
  const phone = String(data?.phone || "").trim();
  const address = String(data?.address || "").trim();
  const nif = String(data?.nif || "").trim();
  const delivery = data?.delivery === "levantamento" ? "levantamento" : "envio";
  const notes = String(data?.notes || "").trim();
  const items = Array.isArray(data?.items) ? data.items : [];

  if (!name || !email || !phone || !address) {
    return { error: "Preenche nome, email, telefone e morada." };
  }
  if (items.length === 0) {
    return { error: "O carrinho está vazio." };
  }

  // Never trust prices sent by the browser: re-read every product from the
  // DB and price each line from there (variant price when one is chosen).
  const ids = [...new Set(items.map((i) => Number(i.id)).filter(Boolean))];
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  const lines = [];
  for (const i of items) {
    const product = byId.get(Number(i.id));
    if (!product) return { error: "Um dos produtos do carrinho já não existe. Remove-o e tenta de novo." };
    if (!product.inStock) return { error: `${product.name} está esgotado. Remove-o do carrinho para continuar.` };
    const variants = JSON.parse(product.variantsJson || "[]");
    const variant = i.size ? variants.find((v) => v.label === i.size) : null;
    const qty = Math.max(1, Math.min(99, Math.floor(Number(i.qty) || 1)));
    lines.push({
      productId: product.id,
      productName: product.name,
      size: i.size ? String(i.size) : null,
      price: variant ? Number(variant.price) : product.price,
      qty,
    });
  }

  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);

  const order = await prisma.order.create({
    data: { name, email, phone, address, nif, delivery, notes, total, items: { create: lines } },
  });

  return { success: true, orderId: order.id };
}
