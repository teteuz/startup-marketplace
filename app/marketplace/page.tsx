import type { Metadata } from "next";
import MarketplaceBrowser from "@/components/MarketplaceBrowser";
import { LISTINGS, isStale, multiple } from "@/lib/data";
import { mult } from "@/lib/format";

export const metadata: Metadata = { title: "Negócios à venda — Marketplace" };

export default function MarketplacePage() {
  const viaApi = LISTINGS.filter((l) => l.verification.method === "integracao" && !isStale(l)).length;
  const fast = LISTINGS.filter((l) => l.track === "Fast").length;
  const mults = LISTINGS.map(multiple).sort((a, b) => a - b);
  const median = (mults[4] + mults[5]) / 2;

  return (
    <section className="section-tight">
      <div className="container">
        <div className="section-head" style={{ alignItems: "flex-start" }}>
          <div>
            <h1 className="h1">Negócios digitais à venda</h1>
            <p className="muted mt-8">Todos passaram por filtros eliminatórios e score mínimo de 60/100.</p>
          </div>
        </div>

        <div className="bento g-4 mb-24">
          <div className="card">
            <div className="card-label">Anúncios publicados</div>
            <div className="hero-num mt-12">{LISTINGS.length}</div>
          </div>
          <div className="card card--blue">
            <div className="card-label">Verificados via integração</div>
            <div className="hero-num mt-12">{viaApi}</div>
          </div>
          <div className="card card--green">
            <div className="card-label">Elegíveis ao Fast</div>
            <div className="hero-num mt-12">{fast}</div>
          </div>
          <div className="card">
            <div className="card-label">Múltiplo SDE mediano</div>
            <div className="hero-num mt-12">{mult(median)}</div>
            <div className="tiny muted mt-8">n = {LISTINGS.length} · amostra pequena</div>
          </div>
        </div>

        <MarketplaceBrowser />
      </div>
    </section>
  );
}
