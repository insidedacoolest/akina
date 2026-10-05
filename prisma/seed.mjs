import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client.ts";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// NOTE: pilotos, eventos, notícias e produtos abaixo são DADOS DE EXEMPLO —
// substitui-os pelos reais no painel de administração.

const DRIVERS = [
  { slug: "piloto-33", num: "33", name: "Piloto Um", nickname: "Touge", role: "Piloto", car: "Nissan Skyline R33", engine: "RB25DET", power: 480, specs: "Turbo Garrett G30\nCoilovers ajustáveis\nKit de ângulo 60°\nTravão de mão hidráulico", bio: "Exemplo de biografia — edita no painel. Começou nos encontros de sábado à noite e nunca mais largou o volante.", order: 1 },
  { slug: "piloto-34", num: "34", name: "Piloto Dois", nickname: "Smoke", role: "Piloto", car: "Nissan Skyline R34", engine: "RB26 → RWD", power: 560, specs: "Conversão para tração traseira\nDiferencial autoblocante 2 vias\nArco de segurança FIA", bio: "Exemplo de biografia — edita no painel.", order: 2 },
  { slug: "piloto-46", num: "46", name: "Piloto Três", nickname: "Sideways", role: "Piloto", car: "BMW E46", engine: "M54B30 turbo", power: 420, specs: "Kit turbo custom\nBaquets + cintos 6 pontos\nJantes 18\"", bio: "Exemplo de biografia — edita no painel.", order: 3 },
  { slug: "piloto-14", num: "14", name: "Piloto Quatro", nickname: "Kouki", role: "Piloto / Mecânico", car: "Nissan Silvia S14", engine: "SR20DET", power: 380, specs: "Intercooler frontal\nEmbraiagem reforçada\nSuspensão ajustável", bio: "Exemplo de biografia — edita no painel.", order: 4 },
];

const d = (s) => new Date(s);
const EVENTS = [
  { title: "Up In Smoke Tour", location: "Portugal", date: d("2026-10-18T10:00:00"), kind: "show", desc: "Paragem da tour com demonstrações e baptismos de drift." },
  { title: "Ronda Final — Campeonato", location: "Autódromo (a confirmar)", date: d("2026-11-08T09:00:00"), kind: "prova", desc: "Última ronda da temporada." },
  { title: "Treino de inverno", location: "Kartódromo (a confirmar)", date: d("2026-12-06T09:00:00"), kind: "treino", desc: "Track day aberto a clientes da oficina." },
  { title: "Lagoa Motorshow", location: "Lagoa", date: d("2026-07-26T15:00:00"), kind: "show", desc: "Exibição de drift.", result: "Show completo · 3 carros em pista" },
  { title: "Drift Fun #08", location: "Portugal", date: d("2026-05-10T09:00:00"), kind: "encontro", desc: "Dia de drift entre amigos.", result: "12 pilotos · zero danos 🙌" },
];

const SERVICES = [
  { name: "Setup de drift", description: "Geometria, alinhamento e afinação de suspensão para drift — o mesmo processo que usamos nos carros da equipa.", priceFrom: 120, duration: "1 dia", icon: "steering", featured: true },
  { name: "Kits de ângulo", description: "Montagem e afinação de kits de ângulo, braços e cremalheiras para mais lock e controlo.", priceFrom: 250, duration: "1–2 dias", icon: "coilover" },
  { name: "Turbo & motor", description: "Montagem de turbos, intercoolers, colectores e preparação de motor com fiabilidade para pista.", priceFrom: null, duration: "sob orçamento", icon: "turbo" },
  { name: "Mapeamento & diagnóstico", description: "Diagnóstico eletrónico, registo de dados e afinação de centralina.", priceFrom: 60, duration: "2–4 h", icon: "laptop" },
  { name: "Manutenção geral", description: "Revisões, óleos, filtros, travões e embraiagens. Para o carro de todos os dias também.", priceFrom: 45, duration: "0,5–1 dia", icon: "oil" },
  { name: "Soldadura & fabrico", description: "Arcos de segurança, suportes, escapes e peças por medida.", priceFrom: null, duration: "sob orçamento", icon: "weld" },
];

const PRODUCTS = [
  { name: "T-shirt Akina Sun — Preta", section: "merch", category: "vestuario", price: 24.9, sizesCsv: "S,M,L,XL,2XL", description: "T-shirt em algodão pesado com o sol Akina nas costas.", featured: true },
  { name: "Hoodie Touge Nights", section: "merch", category: "vestuario", price: 49.9, oldPrice: 59.9, sizesCsv: "S,M,L,XL,2XL", description: "Hoodie com interior felpudo e bordado AKINA no peito.", featured: true },
  { name: "Boné Akina Motorsport", section: "merch", category: "bones", price: 22, description: "Boné snapback com logo bordado.", featured: false },
  { name: "Pack autocolantes (x8)", section: "merch", category: "autocolantes", price: 8.5, description: "8 autocolantes em vinil para o vidro, capô ou portátil.", featured: false },
  { name: "Banner de para-brisas", section: "merch", category: "autocolantes", price: 14.9, variantsJson: JSON.stringify([{ label: "Branco", price: 14.9 }, { label: "Vermelho", price: 14.9 }, { label: "Holográfico", price: 19.9 }]), description: "Banner de vidro frontal AKINA MOTORSPORT, recortado em vinil.", featured: true },
  { name: "Coilovers ajustáveis 32 vias", section: "pecas", category: "suspensao", brand: "Exemplo", sku: "CO-S14-32", fitment: "Nissan Silvia S13/S14/S15, 200SX", price: 890, description: "Coilovers com regulação de altura e 32 vias de amortecimento.", featured: true },
  { name: "Kit de ângulo 60°", section: "pecas", category: "direcao", brand: "Exemplo", sku: "LK-E46-60", fitment: "BMW E46 (exceto xDrive)", price: 649, description: "Kit completo de ângulo com braços reforçados.", featured: false },
  { name: "Travão de mão hidráulico", section: "pecas", category: "travoes", brand: "Exemplo", sku: "HB-UNI", fitment: "Universal", price: 129, description: "Alavanca vertical hidráulica com bomba 0.75\".", featured: false },
  { name: "Pastilhas de travão competição", section: "pecas", category: "travoes", brand: "Exemplo", sku: "BP-R33-F", fitment: "Nissan Skyline R33/R34 (frente)", price: 159, inStock: false, description: "Composto para uso intensivo em pista.", featured: false },
  { name: "Volante suede 350mm", section: "pecas", category: "interior", brand: "Exemplo", sku: "SW-350", fitment: "Universal (requer cubo)", price: 119, description: "Volante com prato fundo e costura vermelha.", featured: false },
];

const NEWS = [
  { title: "Up In Smoke Tour: estamos na estrada", excerpt: "A crew junta-se à tour com três carros. Datas e locais no calendário.", body: "Texto de exemplo — escreve a notícia completa no painel de administração.", section: "drift", publishedAt: d("2026-09-20") },
  { title: "Oficina: nova máquina de alinhamento", excerpt: "Setups de drift mais rápidos e mais precisos — marca já o teu.", body: "Texto de exemplo — escreve a notícia completa no painel de administração.", section: "oficina", publishedAt: d("2026-09-10") },
  { title: "Nova coleção de merch", excerpt: "Hoodies Touge Nights e banners de para-brisas já na loja.", body: "Texto de exemplo — escreve a notícia completa no painel de administração.", section: "loja", publishedAt: d("2026-08-30") },
];

const PARTNERS = [{ name: "Parceiro 01" }, { name: "Parceiro 02" }, { name: "Parceiro 03" }, { name: "Parceiro 04" }, { name: "Parceiro 05" }];

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@akinamotorsport.pt").toLowerCase();
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "akina2026", 10);
  await prisma.adminUser.upsert({ where: { email }, update: { passwordHash }, create: { email, passwordHash } });

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  for (const m of ["driver", "event", "service", "product", "newsPost", "partner", "galleryImage"]) await prisma[m].deleteMany();

  for (const x of DRIVERS) await prisma.driver.create({ data: x });
  for (const x of EVENTS) await prisma.event.create({ data: x });
  for (const [i, x] of SERVICES.entries()) await prisma.service.create({ data: { ...x, order: i } });
  for (const x of PRODUCTS) await prisma.product.create({ data: x });
  for (const x of NEWS) await prisma.newsPost.create({ data: x });
  for (const [i, x] of PARTNERS.entries()) await prisma.partner.create({ data: { ...x, order: i } });

  console.log("Seed concluído. Admin:", email);
}

main().finally(() => prisma.$disconnect());
