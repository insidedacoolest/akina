"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { saveUploadedImage } from "../../lib/upload";
import { SETTING_DEFAULTS } from "../../lib/settings";

const IMAGE_KEYS = ["heroImage", "driftImage", "oficinaImage"];

async function setValue(key, value) {
  await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
}

export async function saveSettings(prevState, formData) {
  await requireAdmin();
  for (const key of Object.keys(SETTING_DEFAULTS)) {
    if (IMAGE_KEYS.includes(key)) continue;
    if (formData.has(key)) await setValue(key, String(formData.get(key) || "").trim());
  }
  for (const key of IMAGE_KEYS) {
    const url = await saveUploadedImage(formData.get(key), "site");
    if (url) await setValue(key, url);
    else if (formData.get(`remove_${key}`) === "on") await setValue(key, "");
  }
  revalidatePath("/", "layout");
  return { saved: Date.now() };
}

export async function changePassword(prevState, formData) {
  const session = await requireAdmin();
  const bcrypt = (await import("bcryptjs")).default;
  const current = String(formData.get("current") || "");
  const next = String(formData.get("next") || "");
  if (next.length < 8) return { error: "A nova palavra-passe tem de ter pelo menos 8 caracteres." };
  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { error: "A palavra-passe atual está errada." };
  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  return { ok: true };
}
