"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, LISTINGS, type Category, isStale, multiple, scoreTotal, ttmRevenue } from "@/lib/data";
import { money } from "@/lib/format";
import ListingCard from "./ListingCard";

const PRICE_RANGES = [
  { id: "all", label: "Qualquer", min: 0, max: Infinity },
  { id: "lt100", label: "Até R$ 100 mil", min: 0, max: 100_000 },
  { id: "100-500", label: "R$ 100–500 mil", min: 100_000, max: 500_000 },
  { id: "500-1m", label: "R$ 500 mil–1 mi", min: 500_000, max: 1_000_000 },
  { id: "gt1m", label: "Acima de R$ 1 mi", min: 1_000_000, max: Infinity },
];

const SORTS = {
  recent: { label: "Mais recentes", fn: (a: (typeof LISTINGS)[0], b: (typeof LISTINGS)[0]) => a.publishedDaysAgo - b.publishedDaysAgo },
  priceAsc: { label: "Menor preço", fn: (a: (typeof LISTINGS)[0], b: (typeof LISTINGS)[0]) => a.askingPrice - b.askingPrice },
  priceDesc: { label: "Maior preço", fn: (a: (typeof LISTINGS)[0], b: (typeof LISTINGS)[0]) => b.askingPrice - a.askingPrice },
  revenue: { label: "Maior receita", fn: (a: (typeof LISTINGS)[0], b: (typeof LISTINGS)[0]) => ttmRevenue(b) - ttmRevenue(a) },
  multiple: { label: "Menor múltiplo", fn: (a: (typeof LISTINGS)[0], b: (typeof LISTINGS)[0]) => multiple(a) - multiple(b) },
  score: { label: "Maior score", fn: (a: (typeof LISTINGS)[0], b: (typeof LISTINGS)[0]) => scoreTotal(b) - scoreTotal(a) },
} as const;

export default function MarketplaceBrowser() {
  const [q, setQ] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [track, setTrack] = useState<"all" | "Fast" | "Standard">("all");
  const [price, setPrice] = useState("all");
  const [minMrr, setMinMrr] = useState(0);
  const [onlyApi, setOnlyApi] = useState(false);
  const [hideStale, setHideStale] = useState(false);
  const [sort, setSort] = useState<keyof typeof SORTS>("recent");
  const [showFilters, setShowFilters] = useState(true);

  const results = useMemo(() => {
    const pr = PRICE_RANGES.find((p) => p.id === price)!;
    const term = q.trim().toLowerCase();
    return LISTINGS.filter((l) => {
      if (term && !`${l.name} ${l.tagline} ${l.category} ${l.stack.join(" ")}`.toLowerCase().includes(term)) return false;
      if (cats.length && !cats.includes(l.category)) return false;
      if (track !== "all" && l.track !== track) return false;
      if (l.askingPrice < pr.min || l.askingPrice > pr.max) return false;
      if (l.mrr < minMrr) return false;
      if (onlyApi && l.verification.method !== "integracao") return false;
      if (hideStale && isStale(l)) return false;
      return true;
    }).sort(SORTS[sort].fn);
  }, [q, cats, track, price, minMrr, onlyApi, hideStale, sort]);

  const activeCount =
    cats.length + (track !== "all" ? 1 : 0) + (price !== "all" ? 1 : 0) + (minMrr > 0 ? 1 : 0) + (onlyApi ? 1 : 0) + (hideStale ? 1 : 0);

  const clear = () => {
    setCats([]); setTrack("all"); setPrice("all"); setMinMrr(0); setOnlyApi(false); setHideStale(false); setQ("");
  };

  const toggleCat = (c: Category) => setCats((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));

  return (
    <>
      <div className="row wrap mb-24" style={{ gap: 12 }}>
        <div className="search grow" style={{ minWidth: 260 }}>
          <Search size={18} />
          <input
            className="input"
            placeholder="Buscar por nome, nicho ou stack (ex.: agendamento, Next.js)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar anúncios"
          />
        </div>
        <button className="btn btn-white btn-lg" onClick={() => setShowFilters((s) => !s)}>
          <SlidersHorizontal size={16} /> Filtros {activeCount > 0 && <span className="badge badge-ink">{activeCount}</span>}
        </button>
        <select className="select" style={{ width: 200, height: 54, borderRadius: 999, border: "none", boxShadow: "var(--shadow)", paddingLeft: 20 }} value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} aria-label="Ordenar">
          {Object.entries(SORTS).map(([k, s]) => (
            <option key={k} value={k}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="market-layout" style={!showFilters ? { gridTemplateColumns: "1fr" } : undefined}>
        {showFilters && (
          <aside className="card filters">
            <div className="row-between mb-16">
              <div className="strong">Filtros</div>
              {activeCount > 0 && (
                <button className="btn-link small" onClick={clear}><X size={14} /> Limpar</button>
              )}
            </div>

            <div className="filter-group">
              <div className="filter-title">Categoria</div>
              <div className="chips">
                {CATEGORIES.map((c) => (
                  <button key={c} className={`chip ${cats.includes(c) ? "active" : ""}`} style={{ height: 30, fontSize: 13 }} onClick={() => toggleCat(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-title">Trilho</div>
              <div className="segmented" style={{ width: "100%" }}>
                {(["all", "Fast", "Standard"] as const).map((t) => (
                  <button key={t} className={track === t ? "active" : ""} style={{ flex: 1 }} onClick={() => setTrack(t)}>
                    {t === "all" ? "Todos" : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-title">Preço pedido</div>
              <div style={{ display: "grid", gap: 6 }}>
                {PRICE_RANGES.map((p) => (
                  <label key={p.id} className="row small" style={{ gap: 10, cursor: "pointer" }}>
                    <input type="radio" name="price" checked={price === p.id} onChange={() => setPrice(p.id)} style={{ accentColor: "var(--ink)" }} />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-title">
                MRR mínimo <span className="muted">{minMrr ? money(minMrr) : "qualquer"}</span>
              </div>
              <input className="range" type="range" min={0} max={30000} step={1000} value={minMrr} onChange={(e) => setMinMrr(+e.target.value)} />
            </div>

            <div className="filter-group">
              <div className="filter-title">Verificação</div>
              <label className="row small" style={{ gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={onlyApi} onChange={(e) => setOnlyApi(e.target.checked)} style={{ accentColor: "var(--ink)" }} />
                Somente via integração (Stripe/Asaas)
              </label>
              <label className="row small mt-8" style={{ gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={hideStale} onChange={(e) => setHideStale(e.target.checked)} style={{ accentColor: "var(--ink)" }} />
                Ocultar selos desatualizados (&gt; 48 h)
              </label>
            </div>

            <div className="filter-group">
              <div className="filter-title">Moeda</div>
              <div className="segmented">
                <button className="active">BRL</button>
                <button disabled title="Trilho USD ainda não habilitado">USD · em breve</button>
              </div>
            </div>
          </aside>
        )}

        <div>
          <div className="row-between mb-16 small muted">
            <span>
              <b style={{ color: "var(--ink)" }}>{results.length}</b> {results.length === 1 ? "negócio encontrado" : "negócios encontrados"}
            </span>
            <span className="hide-sm">Métricas em BRL · SDE normalizado</span>
          </div>
          {results.length ? (
            <div className={`bento ${showFilters ? "g-2" : "g-3"}`}>
              {results.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            <div className="card empty">
              <div className="h3">Nenhum negócio com esses filtros</div>
              <p className="muted mt-8">Ajuste os filtros ou receba novos anúncios por e-mail.</p>
              <button className="btn btn-primary mt-24" onClick={clear}>Limpar filtros</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
