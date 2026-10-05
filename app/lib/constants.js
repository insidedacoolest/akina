// Shared option lists used by both the public site and the admin panel.

export const SHOP_SECTIONS = [
  { value: "merch", label: "Merch", long: "Merchandise" },
  { value: "pecas", label: "Peças", long: "Peças & Performance" },
];

export const SHOP_CATEGORIES = {
  merch: [
    { value: "vestuario", label: "Vestuário" },
    { value: "bones", label: "Bonés" },
    { value: "autocolantes", label: "Autocolantes" },
    { value: "acessorios", label: "Acessórios" },
  ],
  pecas: [
    { value: "suspensao", label: "Suspensão" },
    { value: "direcao", label: "Direção & Ângulo" },
    { value: "motor", label: "Motor & Turbo" },
    { value: "travoes", label: "Travões" },
    { value: "transmissao", label: "Transmissão" },
    { value: "jantes-pneus", label: "Jantes & Pneus" },
    { value: "interior", label: "Interior & Segurança" },
  ],
};

export function categoryLabel(section, value) {
  return SHOP_CATEGORIES[section]?.find((c) => c.value === value)?.label || value;
}

export const EVENT_KINDS = [
  { value: "prova", label: "Prova" },
  { value: "treino", label: "Treino livre" },
  { value: "show", label: "Show / Exibição" },
  { value: "encontro", label: "Encontro" },
];

export function eventKindLabel(value) {
  return EVENT_KINDS.find((k) => k.value === value)?.label || value;
}

export const BOOKING_STATUS = [
  { value: "nova", label: "Nova" },
  { value: "contactada", label: "Contactada" },
  { value: "agendada", label: "Agendada" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

export const ORDER_STATUS = [
  { value: "pendente", label: "Pendente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "paga", label: "Paga" },
  { value: "enviada", label: "Enviada" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelada", label: "Cancelada" },
];

export function statusLabel(list, value) {
  return list.find((s) => s.value === value)?.label || value;
}

export const NEWS_SECTIONS = [
  { value: "drift", label: "Drift" },
  { value: "oficina", label: "Oficina" },
  { value: "loja", label: "Loja" },
];

export const SERVICE_ICONS = ["wrench", "gauge", "turbo", "coilover", "steering", "brake", "engine", "weld", "cage", "tire", "laptop", "oil"];
