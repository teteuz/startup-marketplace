import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DocsStrip, Faq, HowItWorks, TracksCompare, TrustBento } from "@/components/Sections";
import { DEAL_STEPS } from "@/lib/data";

export const metadata: Metadata = { title: "Como funciona — Marketplace" };

export default function ComoFuncionaPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="container">
          <h1 className="display" style={{ fontSize: "clamp(38px,5vw,58px)", maxWidth: 880 }}>
            Do anúncio ao crédito confirmado, com cada etapa registrada.
          </h1>
          <p className="lead mt-24" style={{ maxWidth: 640 }}>
            Somos um marketplace gerenciado: fazemos curadoria, qualificamos compradores e coordenamos a transferência. O
            dinheiro fica com um parceiro de escrow habilitado — nunca com a plataforma.
          </p>
          <div className="mt-24"><DocsStrip /></div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <HowItWorks />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="h2">Estados de uma transação</h2>
            <p className="muted">Toda transição registra autor, horário, evidência e precondições. Um hold de compliance pode ser acionado a partir de qualquer estado ativo.</p>
          </div>
          <div className="bento g-4">
            {DEAL_STEPS.map((s, i) => (
              <div key={s.state} className={`card ${i === 3 ? "card--blue" : i === 5 ? "card--orange" : i === 7 ? "card--green" : ""}`}>
                <div className="row-between">
                  <span className="mid-num" style={{ opacity: 0.45 }}>0{i + 1}</span>
                  <span className="badge" style={i === 3 || i === 5 || i === 7 ? { background: "rgba(255,255,255,.2)", color: "#fff" } : undefined}>{s.day}</span>
                </div>
                <div className="h3 mt-16">{s.label}</div>
                <p className="small mt-8" style={{ opacity: i === 3 || i === 5 || i === 7 ? 0.85 : 1, color: i === 3 || i === 5 || i === 7 ? undefined : "var(--muted)" }}>{s.hint}</p>
              </div>
            ))}
          </div>
          <div className="bento g-3 mt-16">
            <div className="note note-amber">Disputa bloqueia a liberação antes da expiração. Triagem em 1 dia útil; mediação em até 5.</div>
            <div className="note">Reembolso só após plano de reversão confirmado. Cada deal tem plano de unwind antes do depósito.</div>
            <div className="note">Falha de payout volta para autorização; recusa ou timeout nunca aparece como liquidado.</div>
          </div>
        </div>
      </section>

      <section className="section" id="confianca">
        <div className="container">
          <div className="mb-24">
            <h2 className="h2">Curadoria das métricas</h2>
            <p className="muted mt-12">Descrevemos como cada etapa funciona e quais são os limites dela.</p>
          </div>
          <TrustBento />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="h2">Fast e Standard</h2>
          </div>
          <TracksCompare />
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container" style={{ maxWidth: 920 }}>
          <div className="section-head">
            <h2 className="h2">Perguntas frequentes</h2>
          </div>
          <Faq />
          <div className="center mt-48">
            <Link href="/marketplace" className="btn btn-primary btn-lg">Ver negócios à venda <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
