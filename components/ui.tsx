import { ArrowUpRight, BadgeCheck, FileText, RefreshCw, TriangleAlert, Zap } from "lucide-react";
import type { Listing } from "@/lib/data";
import { isStale } from "@/lib/data";

export function ArrowBtn({ label = "Ver mais" }: { label?: string }) {
  return (
    <span className="icon-btn" aria-label={label} role="img">
      <ArrowUpRight size={17} />
    </span>
  );
}

export function TrackBadge({ track }: { track: Listing["track"] }) {
  return track === "Fast" ? (
    <span className="badge badge-green" title="Meta operacional de até 7 dias úteis — não é garantia de liquidação">
      <Zap size={12} /> Fast
    </span>
  ) : (
    <span className="badge badge-outline" title="Cronograma individual, estimativa de até 20 dias úteis">
      Standard
    </span>
  );
}

export function VerificationBadge({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  const v = listing.verification;
  if (isStale(listing)) {
    return (
      <span className="badge badge-amber" title="Mais de 48 h sem sincronização: novas LOIs bloqueadas até revisão">
        <TriangleAlert size={12} /> {compact ? "Selo desatualizado" : `Selo desatualizado · ${v.lastSyncHours} h`}
      </span>
    );
  }
  if (v.method === "integracao") {
    return (
      <span className="badge badge-blue" title={`Fonte: ${v.source} · Período: ${v.period}`}>
        <BadgeCheck size={12} /> {compact ? `Via ${v.source}` : `Verificado via ${v.source}`}
      </span>
    );
  }
  return (
    <span className="badge" title={`Fonte: ${v.source} · Período: ${v.period}`}>
      <FileText size={12} /> {compact ? "Documental" : "Verificado documentalmente"}
    </span>
  );
}

export function SyncLabel({ listing }: { listing: Listing }) {
  const v = listing.verification;
  if (v.method !== "integracao") return <span>Revisão documental · {v.period}</span>;
  return (
    <span className="row" style={{ gap: 6 }}>
      <RefreshCw size={12} /> sinc. há {v.lastSyncHours} h
    </span>
  );
}

const LOGO_COLORS: Record<Listing["color"], string> = {
  green: "c-green",
  orange: "c-orange",
  blue: "c-blue",
  ink: "c-ink",
  lime: "c-lime",
  violet: "c-violet",
};

export function ListingLogo({ listing, size = 48, onColor = false }: { listing: Listing; size?: number; onColor?: boolean }) {
  const initials = listing.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span
      className={`listing-logo ${onColor ? "on-color-logo" : LOGO_COLORS[listing.color]}`}
      style={{ width: size, height: size, fontSize: size * 0.36, borderRadius: size * 0.3 }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function BrandChip({ name, sub, color, letter }: { name: string; sub: string; color: string; letter: string }) {
  return (
    <div className="brand-chip">
      <span className="brand-mark" style={{ background: color }}>
        {letter}
      </span>
      <div>
        <div className="strong" style={{ fontSize: 14, lineHeight: 1.2 }}>{name}</div>
        <div className="tiny muted">{sub}</div>
      </div>
    </div>
  );
}

const AV_COLORS = ["#ff8a65", "#5c7cfa", "#20c997", "#f59f00", "#845ef7", "#e64980"];
export function AvatarStack({ names, more, small = false }: { names: string[]; more?: number; small?: boolean }) {
  return (
    <div className="avatars">
      {names.map((n, i) => (
        <span key={n} className={`avatar ${small ? "avatar-sm" : ""}`} style={{ background: AV_COLORS[i % AV_COLORS.length] }}>
          {n}
        </span>
      ))}
      {more ? (
        <span className={`avatar ${small ? "avatar-sm" : ""}`} style={{ background: "var(--green)" }}>
          +{more}
        </span>
      ) : null}
    </div>
  );
}
