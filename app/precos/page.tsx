import type { Metadata } from "next";
import Link from "next/link";
import { Check, Info } from "lucide-react";
import BuyerFeeCalculator from "@/components/BuyerFeeCalculator";

export const metadata: Metadata = { title: "Preços — Marketplace" };

const PLANS = [
  {
    key: "free",
    name: "Free",
    price: "R$ 0",
    per: "",
    fee: "3,5% por deal",
    feeSub: "piso de R$ 1.250",
    cls: "",
    cta: "Criar conta",
    features: ["1 Data Room por vez", "Verificação de identidade e prova de fundos", "Envio de LOI", "Alertas de novos anúncios"],
  },
  {
    key: "pro",
    name: "Pro",
    price: "R$ 2.490",
    per: "/ano",
    fee: "0% até R$ 500 mil",
    feeSub: "1% no excedente, por deal",
    cls: "card--ink",
    cta: "Assinar Pro",
    features: ["Até 5 Data Rooms simultâneos", "Tudo do Free", "Preço e benefício congelados para LOI aceita durante a validade"],
  },
  {
    key: "fundador",
    name: "Pro Fundador",
    price: "R$ 1.490",
    per: "no 1º ano",
    fee: "igual ao Pro",
    feeSub: "apenas os primeiros 50 assinantes",
    cls: "card--green",
    cta: "Garantir vaga",
    badge: "Primeiros 50",
    features: ["Todos os benefícios do Pro", "Até 5 Data Rooms simultâneos", "Renovação conforme contrato"],
  },
  {
    key: "institutional",
    name: "Institutional",
    price: "R$ 7.490",
    per: "/ano",
    fee: "0% até R$ 5 mi/ano",
    feeSub: "0,5% no excedente do período",
    cls: "card--blue",
    cta: "Falar com a mesa",
    features: ["Até 10 Data Rooms", "First Look de 72 h em novos anúncios", "Agregação de controladas em contrato", "Coordenação e templates (sem representação jurídica)"],
  },
];

export default function PrecosPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="container center">
          <h1 className="display" style={{ fontSize: "clamp(38px,5vw,58px)", maxWidth: 820, margin: "0 auto" }}>
            Pague por acesso — ou só quando comprar.
          </h1>
          <p className="lead mt-24" style={{ maxWidth: 600, margin: "24px auto 0" }}>
            Vendedores pagam comissão apenas no fechamento. Compradores escolhem entre taxa por deal ou assinatura anual.
          </p>
          <div className="segmented mt-32">
            <button className="active">BRL</button>
            <button disabled title="Trilho USD ainda não habilitado">USD · em breve</button>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="bento g-4" style={{ alignItems: "stretch" }}>
            {PLANS.map((p) => (
              <div key={p.key} className={`card ${p.cls}`} style={{ display: "flex", flexDirection: "column" }}>
                <div className="row-between">
                  <div className="card-label strong">{p.name}</div>
                  {p.badge && <span className="badge" style={{ background: "rgba(255,255,255,.22)", color: "#fff" }}>{p.badge}</span>}
                </div>
                <div className="price-tag mt-24">
                  <span className="hero-num">{p.price}</span>
                  <span className="card-sub">{p.per}</span>
                </div>
                <div className={p.cls ? "" : "card-inner"} style={p.cls ? { background: "rgba(255,255,255,.12)", borderRadius: 16, padding: 16, marginTop: 20 } : { marginTop: 20 }}>
                  <div className="strong">{p.fee}</div>
                  <div className="card-sub">{p.feeSub}</div>
                </div>
                <ul className="list-plain mt-16" style={{ flex: 1 }}>
                  {p.features.map((f) => (
                    <li key={f} style={p.cls ? { borderColor: "rgba(255,255,255,.15)" } : undefined}>
                      <Check size={16} style={{ flex: "none", marginTop: 2, color: p.cls ? "#fff" : "var(--green)" }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/entrar" className={`btn btn-block mt-16 ${p.cls ? "btn-white" : "btn-primary"}`}>{p.cta}</Link>
              </div>
            ))}
          </div>

          <div className="bento g-3 mt-24">
            <div className="note"><Info size={16} /> O plano precisa estar ativo antes da LOI e na assinatura do APA. Não há cobrança retroativa por cancelamento posterior.</div>
            <div className="note"><Info size={16} /> Acesso com uso razoável antifraude, para proteger capacidade e sigilo dos vendedores.</div>
            <div className="note"><Info size={16} /> Arrependimento, reembolso e renovação seguem os termos validados e a lei aplicável.</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="h2">Quem paga o quê, numa conta só</h2>
            <p className="muted">Contratos em moeda única. Preço, encargos e beneficiários ficam congelados na versão assinada do APA.</p>
          </div>
          <BuyerFeeCalculator />
        </div>
      </section>
    </>
  );
}
