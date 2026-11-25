const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const brlCents = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const money = (v: number) => brl.format(v);
export const moneyCents = (v: number) => brlCents.format(v);

/** R$ 1,2 mi / R$ 350 mil */
export function moneyShort(v: number) {
  if (v >= 1_000_000) {
    return `R$ ${(v / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} mi`;
  }
  if (v >= 1_000) {
    return `R$ ${(v / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
  }
  return money(v);
}

export const pct = (v: number, digits = 1) =>
  `${v.toLocaleString("pt-BR", { maximumFractionDigits: digits })}%`;

export const mult = (v: number) =>
  `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })}x`;
