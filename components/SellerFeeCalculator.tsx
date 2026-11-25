"use client";

import { useState } from "react";
import { PRICE_MAX, PRICE_MIN, sellerCommission } from "@/lib/fees";
import { money, moneyCents, pct } from "@/lib/format";

const STOPS = [25_000, 75_000, 150_000, 500_000, 1_000_000, 5_000_000];

export default function SellerFeeCalculator() {
  const [price, setPrice] = useState(150_000);
  const [inaugural, setInaugural] = useState(true);
  const fee = sellerCommission(price);
  const S = inaugural ? fee.inaugural : fee.table;
  const valid = price >= PRICE_MIN && price <= PRICE_MAX;

  return (
    <div className="bento g-3">
      <div className="card span-2">
        <div className="card-head">
          <div>
            <div className="card-label">Simulador de comissão</div>
            <div className="card-sub">Faixas marginais · moeda do contrato: BRL</div>
          </div>
          <div className="segmented">
            <button className={inaugural ? "active" : ""} onClick={() => setInaugural(true)}>Oferta inaugural</button>
            <button className={!inaugural ? "active" : ""} onClick={() => setInaugural(false)}>Tabela</button>
          </div>
        </div>

        <div className="field mt-24">
          <label className="label">Preço de venda</label>
          <div className="input-wrap">
            <span className="prefix">R$</span>
            <input
              className={`input ${!valid ? "error" : ""}`}
              type="number"
              value={price}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={5000}
              onChange={(e) => setPrice(+e.target.value)}
              style={{ fontSize: 20, fontWeight: 600, height: 56 }}
            />
          </div>
          {!valid && <span className="hint" style={{ color: "var(--red)" }}>Fora do envelope do piloto (R$ 25 mil a R$ 5 milhões).</span>}
        </div>
        <div className="chips mt-12">
          {STOPS.map((s) => (
            <button key={s} className={`chip ${price === s ? "active" : ""}`} style={{ height: 30, fontSize: 13 }} onClick={() => setPrice(s)}>
              {money(s)}
            </button>
          ))}
        </div>

        <div className="table-wrap mt-24">
          <table className="table">
            <thead>
              <tr><th>Faixa</th><th>Alíquota</th><th style={{ textAlign: "right" }}>Valor</th></tr>
            </thead>
            <tbody>
              {fee.slices.map((s) => (
                <tr key={s.from}>
                  <td>{money(s.from)} – {money(s.to)}</td>
                  <td>{pct(s.rate * 100, 0)}</td>
                  <td style={{ textAlign: "right" }}>{moneyCents(s.value)}</td>
                </tr>
              ))}
              <tr>
                <td className="strong">Comissão de tabela</td>
                <td className="muted small">piso R$ 2.500</td>
                <td style={{ textAlign: "right" }} className="strong">{moneyCents(fee.table)}</td>
              </tr>
              {inaugural && (
                <tr>
                  <td className="strong">Com oferta inaugural (50%)</td>
                  <td className="muted small">maior entre piso e 50%</td>
                  <td style={{ textAlign: "right" }} className="strong">{moneyCents(fee.inaugural)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card card--ink">
          <div className="card-label">Você recebe</div>
          <div className="big-num mt-12">{valid ? moneyCents(price - S) : "—"}</div>
          <div className="card-sub mt-8">P − S, antes de custos expressamente alocados a você no APA</div>
        </div>
        <div className="card card--green">
          <div className="card-label">Comissão</div>
          <div className="big-num mt-12">{valid ? moneyCents(S) : "—"}</div>
          <div className="card-sub mt-8">
            {valid ? `${pct((S / price) * 100)} efetivo` : ""}
            {inaugural && valid && fee.table !== S ? <> · <span style={{ textDecoration: "line-through" }}>{money(fee.table)}</span></> : null}
          </div>
        </div>
        <div className="note">
          A taxa do comprador nunca é descontada do seu líquido, e o preço nunca passa pela conta da plataforma.
        </div>
      </div>
    </div>
  );
}
