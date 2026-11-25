import { moneyShort } from "@/lib/format";

export const MONTHS = ["nov", "dez", "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out"];

function smoothPath(points: Array<[number, number]>) {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/** Linha suave com um ponto destacado (pill tooltip), como o card "Statistics". */
export function LineSpark({
  values,
  labels,
  highlight,
  tooltip,
  color = "#fff",
  height = 150,
}: {
  values: number[];
  labels: string[];
  highlight: number;
  tooltip: string;
  color?: string;
  height?: number;
}) {
  const W = 320;
  const H = height;
  const pad = 14;
  const chartH = H - 26;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = (W - pad * 2) / (values.length - 1);
  const pts: Array<[number, number]> = values.map((v, i) => [
    pad + i * step,
    26 + (chartH - 26) * (1 - (v - min) / span) * 0.75 + (chartH - 26) * 0.12,
  ]);
  const [hx, hy] = pts[highlight];

  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} className="spark" role="img" aria-label={`Gráfico, destaque em ${labels[highlight]}: ${tooltip}`}>
      {pts.map(([x], i) => (
        <line key={i} x1={x} x2={x} y1={20} y2={H} stroke={color} strokeOpacity={0.18} strokeWidth={1} />
      ))}
      <rect x={hx - 11} y={hy - 4} width={22} height={H - hy + 4} rx={11} fill={color} fillOpacity={0.3} />
      <path d={smoothPath(pts)} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={hx} cy={hy} r={3.5} fill={color} />
      <g transform={`translate(${hx}, ${hy - 22})`}>
        <rect x={-30} y={-13} width={60} height={26} rx={13} fill="#fff" />
        <text x={0} y={5} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="#0e1116">
          {tooltip}
        </text>
      </g>
      {labels.map((l, i) => (
        <text key={l + i} x={pts[i][0]} y={H + 14} textAnchor="middle" fontSize={10.5} fill={color} fillOpacity={0.85}>
          {l}
        </text>
      ))}
    </svg>
  );
}

/** Barras de 12 meses, topo arredondado; último mês em verde. */
export function RevenueBars({ values, height = 180 }: { values: number[]; height?: number }) {
  const W = 640;
  const H = height;
  const max = Math.max(...values) * 1.12;
  const gap = 10;
  const bw = (W - gap * (values.length - 1)) / values.length;
  return (
    <svg viewBox={`0 0 ${W} ${H + 40}`} className="spark" role="img" aria-label="Receita mensal dos últimos 12 meses">
      {values.map((v, i) => {
        const h = (v / max) * H;
        const x = i * (bw + gap);
        const last = i === values.length - 1;
        return (
          <g key={i}>
            <rect x={x} y={0} width={bw} height={H} rx={10} fill="#f1f3f6" />
            <rect x={x} y={H - h} width={bw} height={h} rx={10} fill={last ? "#0fb866" : "#e2f3d2"} />
            {last && (
              <g transform={`translate(${Math.min(x + bw / 2, W - 40)}, ${H - h - 16})`}>
                <rect x={-38} y={-13} width={76} height={26} rx={13} fill="#0e1116" />
                <text textAnchor="middle" y={4.5} fontSize={12} fontWeight={700} fill="#fff">
                  {moneyShort(v).replace("R$ ", "")}
                </text>
              </g>
            )}
            <text x={x + bw / 2} y={H + 22} textAnchor="middle" fontSize={12} fill="#9aa1ad">
              {MONTHS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Três colunas com trama listrada — inspirado no card "Analytics". */
export function Bars3({ items }: { items: Array<{ label: string; pct: number; strong?: boolean }> }) {
  return (
    <div className="bars3">
      {items.map((it) => (
        <div className="bar-col" key={it.label}>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                height: `${it.pct}%`,
                background: it.strong ? "var(--green)" : "var(--lime)",
                color: it.strong ? "#fff" : "var(--ink)",
              }}
            >
              {it.pct >= 25 && `${it.pct}%`}
            </div>
            {it.pct < 25 && (
              <div style={{ position: "absolute", left: 10, bottom: `calc(${it.pct}% + 8px)`, fontSize: 12, fontWeight: 600 }}>
                {it.pct}%
              </div>
            )}
          </div>
          <div className="bar-label">{it.label}</div>
        </div>
      ))}
    </div>
  );
}

/** Mini sparkline para cards de anúncio. */
export function MiniSpark({ values, color = "#0fb866" }: { values: number[]; color?: string }) {
  const W = 120;
  const H = 36;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts: Array<[number, number]> = values.map((v, i) => [
    (i / (values.length - 1)) * W,
    3 + (H - 6) * (1 - (v - min) / span),
  ]);
  const line = smoothPath(pts);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden>
      <path d={`${line} L ${W} ${H} L 0 ${H} Z`} fill={color} fillOpacity={0.1} />
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
