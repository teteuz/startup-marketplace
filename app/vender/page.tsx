import type { Metadata } from "next";
import { Ban, BadgeCheck, Check } from "lucide-react";
import SellerFeeCalculator from "@/components/SellerFeeCalculator";
import SubmitWizard from "@/components/SubmitWizard";
import { ArrowBtn } from "@/components/ui";
import { SCORE_CRITERIA } from "@/lib/data";

export const metadata: Metadata = { title: "Vender meu negócio — Marketplace" };

const HARD_FILTERS = [
  "6 meses de receita comprovada",
  "Preço entre R$ 25 mil e R$ 5 milhões",
  "Titularidade comprovada",
  "Identificação e beneficiário final",
  "Transferibilidade demonstrável",
  "Ausência de passivo incompatível",
  "Capacidade de diligência antes da LOI",
  "SDE normalizado positivo nos últimos 3 meses",
];

const EXCLUDED = [
  "Pré-receita",
  "Aquisição fracionada",
  "Oferta de investimento",
  "Custódia cripto",
  "Setores regulados",
  "Direitos disputados",
  "Cessões proibidas",
];

export default function VenderPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="container hero-grid">
          <div>
            <h1 className="display" style={{ fontSize: "clamp(38px,5vw,58px)" }}>
              Venda seu negócio digital para compradores verificados.
            </h1>
            <p className="lead mt-24" style={{ maxWidth: 520 }}>
              Curadoria com score e justificativa, Data Room com NDA, escrow com parceiro habilitado e transferência
              acompanhada. Comissão só no fechamento.
            </p>
            <div className="row wrap mt-32">
              <a href="#submeter" className="btn btn-primary btn-lg">Submeter meu negócio</a>
              <a href="#comissao" className="btn btn-ghost btn-lg">Simular comissão</a>
            </div>
          </div>
          <div className="bento g-2">
            <div className="card card--green">
              <div className="card-head"><div className="card-label">Prioridade</div><ArrowBtn /></div>
              <div className="big-num mt-24">Micro-SaaS B2B</div>
              <div className="card-sub mt-8">e ferramentas digitais recorrentes simples</div>
            </div>
            <div className="card">
              <div className="card-head"><div className="card-label">Envelope</div><ArrowBtn /></div>
              <div className="big-num mt-24">R$ 25 mil – 5 mi</div>
              <div className="card-sub mt-8">venda de ativos, não quotas</div>
            </div>
            <div className="card span-2">
              <div className="card-label">Também no Standard (após checklist)</div>
              <div className="chips mt-16">
                {["Apps", "Conteúdo", "Newsletters", "Infoprodutos recorrentes"].map((c) => (
                  <span className="badge badge-outline" key={c} style={{ height: 32, fontSize: 13 }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="criterios">
        <div className="container">
          <div className="section-head">
            <h2 className="h2">Critérios objetivos, nota explicada</h2>
            <p className="muted">Reprovou? Você recebe a justificativa e pode voltar após 60 dias.</p>
          </div>
          <div className="bento g-3">
            <div className="card">
              <div className="card-label">Filtros eliminatórios</div>
              <div className="card-sub">todos obrigatórios</div>
              <ul className="list-plain mt-16">
                {HARD_FILTERS.map((f) => (
                  <li key={f}><Check size={16} style={{ color: "var(--green)", flex: "none", marginTop: 2 }} /> {f}</li>
                ))}
              </ul>
            </div>
            <div className="card card--orange">
              <div className="card-label">Scorecard</div>
              <div className="hero-num mt-16">≥ 60<span style={{ fontSize: 20, opacity: 0.7 }}>/100</span></div>
              <div className="card-sub">segundo avaliador em toda revisão</div>
              <div className="mt-24" style={{ display: "grid", gap: 10 }}>
                {SCORE_CRITERIA.map((c) => (
                  <div key={c.key}>
                    <div className="row-between tiny"><span>{c.label}</span><span style={{ opacity: 0.75 }}>{c.weight}</span></div>
                    <div className="meter mt-8" style={{ height: 6, background: "rgba(255,255,255,.2)" }}>
                      <span style={{ width: `${c.weight * 4}%`, background: "#fff" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-label">Não aceitamos</div>
              <div className="card-sub">fora do escopo do piloto</div>
              <ul className="list-plain mt-16">
                {EXCLUDED.map((f) => (
                  <li key={f}><Ban size={16} style={{ color: "var(--red)", flex: "none", marginTop: 2 }} /> {f}</li>
                ))}
              </ul>
              <div className="note mt-16 small">
                <BadgeCheck size={16} /> Itens não aplicáveis (ex.: churn em conteúdo) usam rubrica de estabilidade aprovada antes — nunca nota máxima automática.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="comissao">
        <div className="container">
          <div className="section-head">
            <h2 className="h2">Quanto você recebe</h2>
            <p className="muted">10% até R$ 75 mil · 8% até R$ 500 mil · 6% no excedente · piso de R$ 2.500.</p>
          </div>
          <SellerFeeCalculator />
        </div>
      </section>

      <section className="section" id="submeter">
        <div className="container">
          <div className="section-head">
            <h2 className="h2">Submeta seu negócio</h2>
            <p className="muted">Leva cerca de 10 minutos. Depois disso, a curadoria entra em contato.</p>
          </div>
          <SubmitWizard />
        </div>
      </section>
    </>
  );
}
