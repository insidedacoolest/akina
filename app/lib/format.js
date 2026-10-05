export function eur(value) {
  return `${Number(value || 0).toFixed(2).replace(".", ",")} €`;
}

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function fmtDate(date) {
  const d = new Date(date);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function dateParts(date) {
  const d = new Date(date);
  return { day: String(d.getDate()).padStart(2, "0"), month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

export function toDateInput(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function slugify(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
