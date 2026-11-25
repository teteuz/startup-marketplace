import Link from "next/link";
import type { Listing } from "@/lib/data";
import { multiple, scoreTotal, sdeAnnual, ttmRevenue } from "@/lib/data";
import { money, moneyShort, mult } from "@/lib/format";
import { ArrowBtn, ListingLogo, SyncLabel, TrackBadge, VerificationBadge } from "./ui";
import { MiniSpark } from "./Charts";

export default function ListingCard({ listing }: { listing: Listing }) {
  const l = listing;
  return (
    <Link href={`/anuncio/${l.id}`} className="card card-link listing-card">
      <div className="listing-top">
        <ListingLogo listing={l} />
        <div className="grow" style={{ minWidth: 0 }}>
          <div className="row" style={{ gap: 8 }}>
            <h3 className="h3" style={{ fontSize: 18 }}>{l.name}</h3>
            {l.publishedDaysAgo <= 3 && <span className="badge badge-orange">Novo</span>}
          </div>
          <div className="small muted">{l.category} · {l.uf}</div>
        </div>
        <ArrowBtn />
      </div>

      <p className="small" style={{ color: "var(--ink-2)", minHeight: 42 }}>{l.tagline}</p>

      <div className="row-between" style={{ alignItems: "flex-end" }}>
        <div>
          <div className="tiny muted">Preço pedido</div>
          <div className="big-num">{money(l.askingPrice)}</div>
        </div>
        <MiniSpark values={l.series} />
      </div>

      <div className="metrics-grid">
        <div className="metric"><div className="k">Receita 12m</div><div className="v">{moneyShort(ttmRevenue(l))}</div></div>
        <div className="metric"><div className="k">SDE anual.</div><div className="v">{moneyShort(sdeAnnual(l))}</div></div>
        <div className="metric"><div className="k">MRR</div><div className="v">{moneyShort(l.mrr)}</div></div>
        <div className="metric"><div className="k">Múltiplo SDE</div><div className="v">{mult(multiple(l))}</div></div>
      </div>

      <div className="row wrap" style={{ gap: 6 }}>
        <TrackBadge track={l.track} />
        <VerificationBadge listing={l} compact />
        {l.hasActiveLoi && <span className="badge badge-ink">LOI em andamento</span>}
      </div>

      <div className="listing-foot">
        <SyncLabel listing={l} />
        <span>
          Score <b style={{ color: "var(--ink)" }}>{scoreTotal(l)}</b>/100
        </span>
      </div>
    </Link>
  );
}
