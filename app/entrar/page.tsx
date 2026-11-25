import type { Metadata } from "next";
import { EyeOff, Fingerprint, Lock } from "lucide-react";
import LoginFlow from "@/components/LoginFlow";
import { ArrowBtn } from "@/components/ui";

export const metadata: Metadata = { title: "Entrar — Marketplace" };

export default function EntrarPage() {
  return (
    <section className="section-tight">
      <div className="container hero-grid" style={{ alignItems: "start" }}>
        <div style={{ maxWidth: 480, width: "100%" }}>
          <LoginFlow />
        </div>
        <div className="bento g-2 hide-sm">
          <div className="card card--green span-2">
            <div className="card-head">
              <div className="card-label">Para compradores</div>
              <ArrowBtn />
            </div>
            <div className="big-num mt-24">Identidade → Prova de fundos → NDA</div>
            <p className="small mt-12" style={{ opacity: 0.85 }}>
              Só depois disso o Data Room abre. Para enviar LOI, a prova de fundos precisa ter até 30 dias e cobrir preço
              + taxa + custos previstos.
            </p>
          </div>
          <div className="card">
            <Fingerprint size={24} />
            <div className="strong mt-16">Biometria bruta não é guardada</div>
            <p className="small muted mt-8">Quando o fornecedor de KYC atesta o resultado, guardamos apenas o resultado.</p>
          </div>
          <div className="card card--blue">
            <EyeOff size={24} />
            <div className="strong mt-16">CPF fora de analytics e e-mails</div>
            <p className="small mt-8" style={{ opacity: 0.85 }}>Watermarks usam um identificador proporcional, não seus documentos.</p>
          </div>
          <div className="card span-2 row" style={{ gap: 16 }}>
            <span className="icon-btn" style={{ width: 48, height: 48 }}><Lock size={20} /></span>
            <div>
              <div className="strong">Sessões e acessos revogáveis</div>
              <div className="small muted">NDA ausente, expirado ou acesso revogado bloqueia a sala — inclusive em sessões antigas.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
