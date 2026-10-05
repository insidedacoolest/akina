import "server-only";
import { prisma } from "./db";

export const SETTING_DEFAULTS = {
  phone: "+351 912 345 678",
  whatsapp: "351912345678",
  email: "geral@akinamotorsport.pt",
  address: "Zona Industrial, Pavilhão 7 — Portugal",
  hours: "Seg–Sex 9h–19h · Sáb 9h–13h",
  instagram: "https://www.instagram.com/akina.motorsport/",
  youtube: "https://www.youtube.com/channel/UCuyuzqpPeu7aeCasDyVNu8g",
  heroTagline: "Equipa de drift e oficina de preparação. Fumo, ângulo e mecânica a sério — feitos pela mesma crew.",
  heroImage: "",
  driftImage: "",
  oficinaImage: "",
  statFollowers: "4.6K",
  statPosts: "210+",
};

export async function getSettings() {
  const rows = await prisma.setting.findMany();
  const values = { ...SETTING_DEFAULTS };
  for (const r of rows) values[r.key] = r.value;
  return values;
}
