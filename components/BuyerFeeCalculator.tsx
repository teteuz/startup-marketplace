"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { BUYER_PLANS, type BuyerPlan, buyerFee, sellerCommission, valueFlow } from "@/lib/fees";
import { moneyCents } from "@/lib/format";

export default function BuyerFeeCalculator() {
  const [price, setPrice] = useState(150_000);
  const [plan, setPlan] = useState<BuyerPlan>("free");
  const [external, setExternal] = useState(0);

  const B = buyerFee(price, plan);
  const S = sellerCommission(price).table;
  const flow = valueFlow(price, S, B, external);

  return (
    <div className="card">
      <div className="bento g-3" style={{ gap: 20 }}>
        <div className="field">
          <label className="label">Preço do negócio (P)</label>
          <div className="input-wrap">
            <span className="prefix">R$</span>
            <input className="input" type="number" step={5000} value={price} onChange={(e) => setPrice(+e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label className="label">Seu plano</label>
          <select className="select" value={plan} onChange={(e) => setPlan(e.target.value as BuyerPlan)}>
            {Object.entries(BUYER_PLANS).map(([k, p]) => <option key={k} value={k}>{p.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="label">Custos externos previstos (E)</label>
          <div className="input-wrap">
            <span className="prefix">R$</span>
            <input className="input" type="number" step={100} value={external} onChange={(e) => setExternal(+e.target.value)} />
          </div>
          <span className="hint">O custo do escrow em BRL é despesa da plataforma.</span>
        </div>
      </div>

      <div className="bento g-3 mt-24" style={{ alignItems: "stretch" }}>
        <div className="card card--ink">
          <div className="card-label">Você deposita no escrow</div>
          <div className="big-num mt-12">{moneyCents(flow.buyerDeposits)}</div>
          <div className="card-sub mt-8">P + B + E · no parceiro, nunca na plataforma</div>
        </div>
        <div className="card card-flat" style={{ border: "1px solid var(--line)" }}>
          <div className="card-label">Vendedor recebe</div>
          <div className="big-num mt-12">{moneyCents(flow.sellerReceives)}</div>
          <div className="card-sub mt-8">P − S (comissão de tabela) − custos alocados a ele</div>
        </div>
        <div className="card card-flat" style={{ border: "1px solid var(--line)" }}>
          <div className="card-label">Plataforma recebe</div>
          <div className="big-num mt-12">{moneyCents(flow.platformReceives)}</div>
          <div className="card-sub mt-8">S + B</div>
        </div>
      </div>

      <div className="row wrap mt-16 small muted" style={{ gap: 8 }}>
        <span>Taxa do comprador (B): <b style={{ color: "var(--ink)" }}>{moneyCents(B)}</b></span>
        <ArrowRight size={14} />
        <span>{BUYER_PLANS[plan].feeLabel}</span>
      </div>
    </div>
  );
}
