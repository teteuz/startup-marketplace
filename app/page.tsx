import Link from "next/link";
import { ArrowRight, BadgeCheck, Zap } from "lucide-react";
import { LISTINGS } from "@/lib/data";
import ListingCard from "@/components/ListingCard";
import { Bars3, LineSpark } from "@/components/Charts";
import { ArrowBtn, AvatarStack } from "@/components/ui";
import { HowItWorks, TracksCompare, TrustBento } from "@/components/Sections";
import NewsletterForm from "@/components/NewsletterForm";

export default function Home() {
  const featured = LISTINGS.filter((l) => ["agendai", "notafacil", "linkbio-pro"].includes(l.id));

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="badge badge-outline" style={{ background: "#fff" }}>
              <span className="dot" style={{ color: "var(--green)" }} /> Micro-SaaS e ferramentas digitais · R$ 25 mil a R$ 5 mi
            </span>
            <h1 className="display mt-24">
              Compre e venda negócios digitais com métricas verificadas.
            </h1>
            <p className="lead mt-24" style={{ maxWidth: 540 }}>
              Pagamento condicionado em escrow e transferência acompanhada do início ao crédito. Curadoria para
              vendedores, prova de fundos para compradores.
            </p>
            <div className="row wrap mt-32">
              <Link href="/marketplace" className="btn btn-primary btn-lg">
                Ver negócios à venda <ArrowRight size={18} />
              </Link>
              <Link href="/vender" className="btn btn-ghost btn-lg">
                Vender meu negócio
              </Link>
            </div>
            <div className="row mt-32" style={{ gap: 14 }}>
              <AvatarStack names={["LM", "RA", "JS", "TC"]} small />
              <p className="small muted" style={{ maxWidth: 360 }}>
                Compradores passam por identidade, beneficiário final e prova de fundos antes de acessar qualquer Data Room.
              </p>
            </div>
          </div>

          <div className="hero-bento">
            <div className="stack" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="card">
                <div className="card-head">
                  <div className="card-label">MRR verificado</div>
                  <ArrowBtn />
                </div>
                <div className="hero-num mt-16">R$ 14.200</div>
                <div className="row mt-8" style={{ gap: 6 }}>
                  <span className="badge badge-blue"><BadgeCheck size={12} /> via Stripe</span>
                  <span className="tiny muted">sinc. há 3 h</span>
                </div>
                <Bars3
                  items={[
                    { label: "Mensal", pct: 64, strong: true },
                    { label: "Anual*", pct: 22 },
                    { label: "Equipe", pct: 14 },
                  ]}
                />
                <div className="tiny muted mt-8">Mix de receita por plano · *anual normalizado no MRR</div>
              </div>
              <div className="card">
                <div className="card-label">Compradores verificados</div>
                <div className="card-sub">KYC + prova de fundos</div>
                <div className="card-inner mt-16">
                  <div className="row-between">
                    <div>
                      <div className="strong small">NDAs no anúncio</div>
                      <div className="tiny muted">últimos 14 dias</div>
                    </div>
                    <ArrowBtn />
                  </div>
                  <div className="mt-16">
                    <AvatarStack names={["AF", "BM", "CS"]} more={4} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 36 }}>
              <div className="card card--orange">
                <div className="card-head">
                  <div className="card-label">Visualizações do anúncio</div>
                  <ArrowBtn />
                </div>
                <div className="hero-num mt-16">1.284</div>
                <div className="mt-16">
                  <LineSpark
                    values={[120, 150, 140, 190, 312, 230, 142]}
                    labels={["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]}
                    highlight={4}
                    tooltip="312"
                    height={120}
                  />
                </div>
              </div>
              <div className="card card--blue rings">
                <div className="card-label">Escrow · saldo bloqueado</div>
                <div className="hero-num mt-24 nowrap" style={{ fontSize: 28 }}>R$ 260.000,00</div>
                <div className="row-between mt-24 small" style={{ opacity: 0.85 }}>
                  <span>DL-0042 · parceiro habilitado</span>
                  <span className="row" style={{ gap: 4 }}><Zap size={14} /> Fast</span>
                </div>
              </div>
              <div className="card row-between" style={{ padding: "18px 22px" }}>
                <div>
                  <div className="tiny muted">Payout</div>
                  <div className="strong">Ops + 2º aprovador</div>
                </div>
                <span className="badge badge-green">1/2 aprovado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- DESTAQUES ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="h2">Negócios à venda agora</h2>
            <Link href="/marketplace" className="btn btn-white">
              Ver todos os {LISTINGS.length} anúncios <ArrowRight size={16} />
            </Link>
          </div>
          <div className="bento g-3">
            {featured.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- COMO FUNCIONA (fade + etapas caindo uma por uma) ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="h2">Um processo acompanhado, do anúncio ao crédito</h2>
            <Link href="/como-funciona" className="btn-link">
              Ver o processo completo <ArrowRight size={16} />
            </Link>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* ---------- CURADORIA DAS MÉTRICAS (benefícios caindo um por um) ---------- */}
      <section className="section">
        <div className="container">
          <div className="mb-24">
            <h2 className="h2">Curadoria das métricas</h2>
            <p className="muted mt-12">Descrevemos como cada etapa funciona e quais são os limites dela.</p>
          </div>
          <TrustBento />
        </div>
      </section>

      {/* ---------- TRILHOS ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="h2">Fast ou Standard, conforme o negócio</h2>
          </div>
          <TracksCompare />
        </div>
      </section>

      {/* ---------- PREÇOS ---------- */}
      <section className="section">
        <div className="container">
          <div className="bento g-3">
            <div className="card span-2">
              <h2 className="h2">Você só paga comissão quando vende.</h2>
              <div className="bento g-3 mt-24" style={{ gap: 10 }}>
                {[
                  ["até R$ 75 mil", "10%"],
                  ["até R$ 500 mil", "8%"],
                  ["excedente", "6%"],
                ].map(([f, r]) => (
                  <div className="card-inner" key={f}>
                    <div className="tiny muted">{f}</div>
                    <div className="big-num">{r}</div>
                  </div>
                ))}
              </div>
              <p className="small muted mt-16">Faixas marginais · piso de R$ 2.500 · sem taxa de listagem.</p>
              <Link href="/vender#comissao" className="btn btn-primary mt-24">
                Simular minha comissão <ArrowRight size={16} />
              </Link>
            </div>
            <div className="card card--green">
              <div className="card-head">
                <div className="card-label">Oferta inaugural</div>
                <ArrowBtn />
              </div>
              <div className="hero-num mt-24">50% off</div>
              <div className="card-sub">na comissão de tabela, respeitado o piso</div>
              <p className="small mt-24" style={{ opacity: 0.9 }}>
                Para os 10 primeiros negócios aprovados, com assinatura em até 90 dias após a publicação. Sem
                retroatividade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- NEWSLETTER ---------- */}
      <section className="section">
        <div className="container">
          <div className="card card--ink rings" style={{ padding: "40px" }}>
            <div className="hero-grid" style={{ gap: 32 }}>
              <div>
                <div className="card-label">Newsletter</div>
                <h2 className="h2 mt-8">Novos negócios verificados, toda semana.</h2>
                <p className="mt-12" style={{ opacity: 0.7, maxWidth: 460 }}>
                  Um resumo dos anúncios publicados, com métricas, trilho e status de verificação. Você pode sair a
                  qualquer momento.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
