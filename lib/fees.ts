/**
 * Regras de precificação do Plano Piloto v3.0 (seção 7).
 * Apenas cálculo ilustrativo para a interface — sem efeito financeiro.
 */

export const PRICE_MIN = 25_000;
export const PRICE_MAX = 5_000_000;

const SELLER_TIERS: Array<[cap: number, rate: number]> = [
  [75_000, 0.1],
  [500_000, 0.08],
  [Infinity, 0.06],
];
export const SELLER_FLOOR = 2_500;

export type SellerFee = {
  tableRaw: number; // soma das faixas marginais
  table: number; // max(piso, tabela)
  inaugural: number; // max(piso, 50% da tabela)
  slices: Array<{ from: number; to: number; rate: number; value: number }>;
};

export function sellerCommission(price: number): SellerFee {
  let prev = 0;
  let total = 0;
  const slices: SellerFee["slices"] = [];
  for (const [cap, rate] of SELLER_TIERS) {
    const top = Math.min(price, cap);
    const slice = Math.max(0, top - prev);
    if (slice > 0) {
      slices.push({ from: prev, to: top, rate, value: slice * rate });
      total += slice * rate;
    }
    prev = cap;
    if (price <= cap) break;
  }
  return {
    tableRaw: total,
    table: Math.max(SELLER_FLOOR, total),
    inaugural: Math.max(SELLER_FLOOR, total * 0.5),
    slices,
  };
}

export type BuyerPlan = "free" | "pro" | "fundador" | "institutional";

export const BUYER_PLANS: Record<
  BuyerPlan,
  { name: string; annual: number | null; rooms: string; feeLabel: string }
> = {
  free: { name: "Free", annual: null, rooms: "1 Data Room por vez", feeLabel: "3,5% por deal (piso R$ 1.250)" },
  pro: { name: "Pro", annual: 2_490, rooms: "Até 5 Data Rooms", feeLabel: "0% até R$ 500 mil; 1% no excedente" },
  fundador: { name: "Pro Fundador", annual: 1_490, rooms: "Até 5 Data Rooms", feeLabel: "Igual ao Pro (primeiros 50)" },
  institutional: { name: "Institutional", annual: 7_490, rooms: "Até 10 Data Rooms", feeLabel: "0% até R$ 5 mi/ano; 0,5% no excedente" },
};

export function buyerFee(price: number, plan: BuyerPlan, institutionalUsed = 0): number {
  switch (plan) {
    case "free":
      return Math.max(1_250, price * 0.035);
    case "pro":
    case "fundador":
      return Math.max(0, price - 500_000) * 0.01;
    case "institutional": {
      const allowance = Math.max(0, 5_000_000 - institutionalUsed);
      return Math.max(0, price - allowance) * 0.005;
    }
  }
}

/** Fluxo de valores (7.3): comprador deposita P+B+E; vendedor recebe P−S; plataforma recebe S+B. */
export function valueFlow(P: number, S: number, B: number, E: number) {
  return {
    buyerDeposits: P + B + E,
    sellerReceives: P - S,
    platformReceives: S + B,
  };
}
