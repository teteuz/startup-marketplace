"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Info,
  Lock,
  ShieldCheck,
  TriangleAlert,
  X,
  Zap,
} from "lucide-react";
import {
  SCORE_CRITERIA,
  getListing,
  isStale,
  multiple,
  scoreTotal,
  sdeAnnual,
  ttmRevenue,
} from "@/lib/data";
import { buyerFee } from "@/lib/fees";
import { money, moneyShort, mult, pct } from "@/lib/format";
import { RevenueBars } from "./Charts";
import { ListingLogo, TrackBadge, VerificationBadge } from "./ui";

const ROOM_FILES = [
  ["Snapshot de métricas (out/2026).pdf", "Datado · será anexado ao APA"],
  ["Conciliação de receita — 12 meses.xlsx", "Receita, taxas, reembolsos, chargebacks, repasses"],
  ["Provas de titularidade (domínio, repositório, marca).pdf", "Documental"],
  ["Mapa de dependências e cessões.pdf", "Terceiros, contratos, permissões"],
  ["Certidões e análise.pdf", "Revisão de Ops / Jurídico"],
  ["Arquitetura, deploy e restauração.md", "Técnico"],
];

type Pof = { amount: number; days: number } | null;

export default function ListingDetail({ id }: { id: string }) {
  const l = getListing(id)!;
  const stale = isStale(l);
  const total = scoreTotal(l);

  const [kyc] = useState(true); // já verificado na sessão fictícia
  const [pof, setPof] = useState<Pof>(null);
  const [nda, setNda] = useState(false);
  const [modal, setModal] = useState<null | "nda" | "pof" | "loi" | "sent">(null);
  const [toast, setToast] = useState<string | null>(null);

  const roomOpen = kyc && !!pof && nda;
  const feeFree = buyerFee(l.askingPrice, "free");
  const showToast = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <section className="section-tight">
      <div className="container">
        <div className="row small muted mb-16" style={{ gap: 6 }}>
          <Link href="/marketplace" className="row" style={{ gap: 6 }}>
            <ArrowLeft size={14} /> Marketplace
          </Link>
          <ChevronRight size={14} /> {l.category} <ChevronRight size={14} /> <span style={{ color: "var(--ink)" }}>{l.name}</span>
        </div>

        <div className="detail-layout">
          {/* ------------ MAIN ------------ */}
          <div className="stack" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <div className="row" style={{ alignItems: "flex-start", gap: 16 }}>
                <ListingLogo listing={l} size={64} />
                <div className="grow">
                  <div className="row wrap" style={{ gap: 8 }}>
                    <h1 className="h1" style={{ fontSize: 34 }}>{l.name}</h1>
                    <TrackBadge track={l.track} />
                    <VerificationBadge listing={l} />
                  </div>
                  <div className="muted mt-8">{l.category} · {l.uf} · {l.ageMonths} meses de operação · publicado há {l.publishedDaysAgo} {l.publishedDaysAgo === 1 ? "dia" : "dias"}</div>
                  <p className="lead mt-16">{l.tagline}</p>
                </div>
              </div>
              {l.hasActiveLoi && (
                <div className="note note-blue mt-16">
                  <Info size={16} />
                  <span>Este anúncio já tem uma LOI aceita. Novas LOIs entram como <b>backup</b>, sem exclusividade concorrente.</span>
                </div>
              )}
              {stale && (
                <div className="note note-amber mt-16">
                  <TriangleAlert size={16} />
                  <span>
                    Sem sincronização há {l.verification.lastSyncHours} h. O selo está desatualizado e <b>novas LOIs ficam bloqueadas até revisão</b> da curadoria.
                  </span>
                </div>
              )}
            </div>

            <div className="bento g-3">
              <div className="card card--ink">
                <div className="card-label">Preço pedido</div>
                <div className="mid-num mt-12 nowrap">{moneyShort(l.askingPrice)}</div>
                <div className="card-sub mt-8">100% à vista</div>
              </div>
              <div className="card card--green">
                <div className="card-label">MRR</div>
                <div className="mid-num mt-12 nowrap">{money(l.mrr)}</div>
                <div className="card-sub mt-8">ARR {moneyShort(l.mrr * 12)} (12 × MRR)</div>
              </div>
              <div className="card">
                <div className="card-label">Receita 12 meses</div>
                <div className="mid-num mt-12 nowrap">{moneyShort(ttmRevenue(l))}</div>
                <div className="card-sub mt-8">realizada, bruta</div>
              </div>
              <div className="card">
                <div className="card-label">SDE anualizado</div>
                <div className="mid-num mt-12 nowrap">{moneyShort(sdeAnnual(l))}</div>
                <div className="card-sub mt-8">média 3 meses fechados</div>
              </div>
              <div className="card">
                <div className="card-label">Múltiplo SDE</div>
                <div className="mid-num mt-12 nowrap">{mult(multiple(l))}</div>
              </div>
              <div className="card">
                <div className="card-label">{l.churn === null ? "Estabilidade" : "Churn mensal"}</div>
                <div className="mid-num mt-12 nowrap">{l.churn === null ? "Rubrica" : pct(l.churn)}</div>
                {l.churn === null && <div className="card-sub mt-8">audiência, não churn</div>}
              </div>
              <div className="card">
                <div className="card-label">{l.category === "Newsletter" ? "Assinantes" : "Clientes ativos"}</div>
                <div className="mid-num mt-12 nowrap">{l.customers.toLocaleString("pt-BR")}</div>
              </div>
              <div className="card">
                <div className="card-label">Operação</div>
                <div className="mid-num mt-12 nowrap">{l.ageMonths} meses</div>
              </div>
              <div className="card">
                <div className="card-label">Score curadoria</div>
                <div className="mid-num mt-12 nowrap">{total}<span className="muted" style={{ fontSize: 18 }}>/100</span></div>
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <div>
                  <div className="card-label">Receita mensal</div>
                  <div className="card-sub">{l.verification.period} · fonte: {l.verification.source}</div>
                </div>
                <span className="badge badge-green">
                  +{pct(((l.series[11] - l.series[0]) / l.series[0]) * 100, 0)} em 12 meses
                </span>
              </div>
              <div className="mt-24">
                <RevenueBars values={l.series} />
              </div>
              <p className="tiny muted">
                MRR exclui receita única, tributos e descontos; planos anuais normalizados. Receita ≠ caixa.
              </p>
            </div>

            <div className="bento g-2">
              <div className="card">
                <div className="card-head">
                  <div className="card-label">Verificação</div>
                  <VerificationBadge listing={l} compact />
                </div>
                <dl className="kv mt-16">
                  <dt>Método</dt><dd>{l.verification.method === "integracao" ? "Integração (leitura com escopo verificado)" : "Documental"}</dd>
                  <dt>Fonte</dt><dd>{l.verification.source}</dd>
                  <dt>Período</dt><dd>{l.verification.period}</dd>
                  <dt>Cobertura</dt><dd>{l.verification.coverage}</dd>
                  <dt>Atualização</dt>
                  <dd>{l.verification.method === "integracao" ? `Diária · última há ${l.verification.lastSyncHours} h` : "Revisão manual na publicação"}</dd>
                  <dt>Limitações</dt><dd className="muted" style={{ fontWeight: 400 }}>{l.verification.limitations}</dd>
                </dl>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="card-label">Scorecard</div>
                    <div className="card-sub">2 avaliadores · mínimo 60</div>
                  </div>
                  <div className="mid-num">{total}</div>
                </div>
                <div className="mt-16" style={{ display: "grid", gap: 10 }}>
                  {SCORE_CRITERIA.map((c, i) => (
                    <div key={c.key}>
                      <div className="row-between tiny">
                        <span>{c.label}</span>
                        <span className="muted">{l.score[i]}/{c.weight}</span>
                      </div>
                      <div className="meter mt-8" style={{ height: 6 }}>
                        <span style={{ width: `${(l.score[i] / c.weight) * 100}%`, background: l.score[i] / c.weight >= 0.75 ? "var(--green)" : "var(--ink)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-label">Sobre o negócio</div>
              <p className="mt-12" style={{ color: "var(--ink-2)" }}>{l.description}</p>
              <div className="bento g-2 mt-24" style={{ gap: 20 }}>
                <div>
                  <div className="label mb-8">Ativos incluídos na transferência</div>
                  <ul className="list-plain">
                    {l.assets.map((a) => (
                      <li key={a}><Check size={16} style={{ color: "var(--green)", flex: "none", marginTop: 2 }} /> {a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="label mb-8">Operação</div>
                  <p className="small">{l.operation}</p>
                  <div className="label mb-8 mt-24">Stack</div>
                  <div className="chips">
                    {l.stack.map((s) => <span key={s} className="badge badge-outline">{s}</span>)}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-label">Riscos e limitações declarados</div>
              <div className="mt-16" style={{ display: "grid", gap: 8 }}>
                {l.risks.map((r) => (
                  <div key={r} className="note note-amber"><TriangleAlert size={16} /> {r}</div>
                ))}
              </div>
              <p className="tiny muted mt-16">
                A verificação de receita não comprova despesas, propriedade intelectual nem ausência de passivos. Asset
                sale e certidões não eliminam risco de sucessão.
              </p>
            </div>

            <div className="card">
              <div className="card-head">
                <div>
                  <div className="card-label">Data Room</div>
                  <div className="card-sub">Acesso registrado por anúncio · watermark com identificador</div>
                </div>
                {roomOpen ? <span className="badge badge-green"><Check size={12} /> Liberado</span> : <span className="badge"><Lock size={12} /> Restrito</span>}
              </div>
              <div className="locked-files mt-16">
                <ul className={`list-plain ${roomOpen ? "" : "blur"}`}>
                  {ROOM_FILES.map(([f, d]) => (
                    <li key={f} className="row-between">
                      <span className="row"><FileText size={16} /> {f}</span>
                      <span className="tiny muted hide-sm">{d}</span>
                    </li>
                  ))}
                </ul>
                {!roomOpen && (
                  <div className="overlay">
                    <div className="card center" style={{ maxWidth: 360 }}>
                      <Lock size={22} style={{ margin: "0 auto" }} />
                      <div className="strong mt-8">Conclua os requisitos de acesso</div>
                      <p className="small muted mt-8">Identidade, beneficiário final, prova de fundos e NDA versionado.</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="note mt-16">
                <ShieldCheck size={16} />
                <span>Nenhuma base de clientes identificável é disponibilizada antes do fechamento. O bloqueio de download dificulta a cópia, mas não impede captura de tela.</span>
              </div>
            </div>
          </div>

          {/* ------------ SIDE ------------ */}
          <aside className="sticky-side" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <div className="tiny muted">Preço pedido</div>
              <div className="hero-num">{money(l.askingPrice)}</div>
              <div className="row wrap mt-12" style={{ gap: 6 }}>
                <span className="badge"><Eye size={12} /> {l.ndaCount} NDAs</span>
                {l.track === "Fast" ? (
                  <span className="badge badge-green"><Zap size={12} /> Meta: 7 dias úteis</span>
                ) : (
                  <span className="badge"><Clock size={12} /> Até 20 dias úteis (estim.)</span>
                )}
              </div>

              <div className="divider" />
              <div className="label mb-8">Requisitos de acesso</div>
              <Req ok={kyc} label="Identidade e beneficiário final" sub="Verificado em 02/11" />
              <Req
                ok={!!pof}
                label="Prova de fundos"
                sub={pof ? `${moneyShort(pof.amount)} · enviada há ${pof.days} dias` : "Até 30 dias para enviar LOI"}
                action={!pof ? <button className="btn btn-soft btn-sm" onClick={() => setModal("pof")}>Enviar</button> : undefined}
              />
              <Req
                ok={nda}
                label="NDA v3 deste anúncio"
                sub={nda ? "Assinado agora" : "Versionado, por anúncio"}
                action={!nda ? <button className="btn btn-soft btn-sm" onClick={() => setModal("nda")}>Assinar</button> : undefined}
              />

              <button
                className="btn btn-primary btn-block btn-lg mt-16"
                disabled={!roomOpen || stale}
                onClick={() => setModal("loi")}
              >
                {stale ? "LOIs bloqueadas (selo desatualizado)" : l.hasActiveLoi ? "Enviar LOI de backup" : "Enviar LOI"}
              </button>
              {!roomOpen && <p className="tiny muted center mt-8">Conclua os requisitos para liberar o Data Room e a LOI.</p>}
            </div>

            <div className="card card--blue rings">
              <div className="card-label">Taxa do comprador</div>
              <div className="big-num mt-12">{money(feeFree)}</div>
              <div className="card-sub">no plano Free (3,5%, piso R$ 1.250)</div>
              <div className="divider" style={{ background: "rgba(255,255,255,.2)" }} />
              <div className="row-between small">
                <span>No plano Pro</span>
                <b>{money(buyerFee(l.askingPrice, "pro"))}</b>
              </div>
              <Link href="/precos" className="btn btn-white btn-block mt-16">Comparar planos</Link>
            </div>

            <div className="note">
              <Info size={16} />
              <span>O vendedor vê apenas uma <b>faixa indicativa</b> da sua prova de fundos — nunca o saldo exato ou documentos.</span>
            </div>
          </aside>
        </div>
      </div>

      {/* ------------ MODALS ------------ */}
      {modal === "nda" && (
        <Modal title="NDA — versão 3" onClose={() => setModal(null)}>
          <div className="card-inner small" style={{ maxHeight: 220, overflow: "auto" }}>
            <p><b>Acordo de confidencialidade (minuta fictícia para protótipo).</b></p>
            <p className="mt-8">1. As informações do Data Room de “{l.name}” são confidenciais e destinadas exclusivamente à avaliação da aquisição.</p>
            <p className="mt-8">2. É vedado contatar clientes, fornecedores ou colaboradores do negócio sem autorização expressa.</p>
            <p className="mt-8">3. O acesso é registrado, pode ser revogado e expira em 90 dias.</p>
            <p className="mt-8">4. Todas as negociações devem ocorrer pela plataforma enquanto vigente o compromisso aplicável.</p>
          </div>
          <NdaAccept
            onAccept={() => {
              setNda(true);
              setModal(null);
              showToast("NDA assinado · acesso registrado");
            }}
          />
        </Modal>
      )}

      {modal === "pof" && (
        <PofModal
          suggested={Math.ceil((l.askingPrice + feeFree) / 50_000) * 50_000}
          onClose={() => setModal(null)}
          onSubmit={(amount) => {
            setPof({ amount, days: 0 });
            setModal(null);
            showToast("Prova de fundos enviada para análise (simulação)");
          }}
        />
      )}

      {modal === "loi" && pof && (
        <LoiModal
          listingName={l.name}
          asking={l.askingPrice}
          track={l.track}
          pof={pof.amount}
          backup={l.hasActiveLoi}
          onClose={() => setModal(null)}
          onSend={() => setModal("sent")}
        />
      )}

      {modal === "sent" && (
        <Modal title="LOI enviada" onClose={() => setModal(null)}>
          <div className="center">
            <span className="req-ico ok" style={{ width: 56, height: 56, margin: "0 auto" }}><Check size={28} /></span>
            <p className="mt-16">O vendedor foi notificado. Você acompanha o status no seu painel.</p>
            <p className="small muted mt-8">A LOI não vincula a compra, salvo cláusulas expressamente vinculantes.</p>
            <Link href="/painel" className="btn btn-primary mt-24">Ir para o painel</Link>
          </div>
        </Modal>
      )}

      {toast && (
        <div className="toast"><BadgeCheck size={16} /> {toast}</div>
      )}
    </section>
  );
}

function Req({ ok, label, sub, action }: { ok: boolean; label: string; sub: string; action?: React.ReactNode }) {
  return (
    <div className="req">
      <span className={`req-ico ${ok ? "ok" : "no"}`}>{ok ? <Check size={15} /> : null}</span>
      <div className="grow">
        <div className="small strong">{label}</div>
        <div className="tiny muted">{sub}</div>
      </div>
      {action}
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="row-between mb-16">
          <div className="h3">{title}</div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar"><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function NdaAccept({ onAccept }: { onAccept: () => void }) {
  const [ok, setOk] = useState(false);
  return (
    <>
      <label className="check mt-16">
        <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} />
        <span className="small">Li e aceito o NDA v3. Entendo que meu acesso é registrado e pode ser revogado.</span>
      </label>
      <button className="btn btn-primary btn-block mt-16" disabled={!ok} onClick={onAccept}>Assinar NDA</button>
    </>
  );
}

function PofModal({ suggested, onClose, onSubmit }: { suggested: number; onClose: () => void; onSubmit: (v: number) => void }) {
  const [amount, setAmount] = useState(suggested);
  const [liquid, setLiquid] = useState(true);
  return (
    <Modal title="Prova de fundos" onClose={onClose}>
      <p className="small muted">
        Envie um comprovante de saldo líquido em seu nome, com até 30 dias. Investimentos ilíquidos, patrimônio
        declarado ou financiamento não aprovado não contam.
      </p>
      <div className="field mt-16">
        <label className="label">Valor comprovado (BRL)</label>
        <div className="input-wrap">
          <span className="prefix">R$</span>
          <input className="input" type="number" value={amount} step={10000} onChange={(e) => setAmount(+e.target.value)} />
        </div>
      </div>
      <div className="card-inner mt-16 center small muted" style={{ borderStyle: "dashed" }}>
        Arraste o extrato aqui (PDF) — <b>simulação, nada é enviado</b>
      </div>
      <label className="check mt-16">
        <input type="checkbox" checked={liquid} onChange={(e) => setLiquid(e.target.checked)} />
        <span className="small">O saldo é líquido, está em meu nome (ou da minha empresa verificada) e em BRL.</span>
      </label>
      <button className="btn btn-primary btn-block mt-16" disabled={!liquid || amount <= 0} onClick={() => onSubmit(amount)}>
        Enviar para análise
      </button>
    </Modal>
  );
}

function LoiModal({
  listingName,
  asking,
  track,
  pof,
  backup,
  onClose,
  onSend,
}: {
  listingName: string;
  asking: number;
  track: "Fast" | "Standard";
  pof: number;
  backup: boolean;
  onClose: () => void;
  onSend: () => void;
}) {
  const [price, setPrice] = useState(asking);
  const [accepted, setAccepted] = useState(false);
  const fee = buyerFee(price, "free");
  const external = 0;
  const required = price + fee + external;
  const covered = pof >= required;
  const inEnvelope = price >= 25_000 && price <= 5_000_000;

  return (
    <Modal title={`LOI — ${listingName}`} onClose={onClose}>
      {backup && (
        <div className="note note-blue mb-16"><Info size={16} /> Esta será uma LOI de backup, sem exclusividade concorrente.</div>
      )}
      <div className="field">
        <label className="label">Preço ofertado</label>
        <div className="input-wrap">
          <span className="prefix">R$</span>
          <input className={`input ${!inEnvelope ? "error" : ""}`} type="number" step={5000} value={price} onChange={(e) => setPrice(+e.target.value)} />
        </div>
        <span className="hint">Preço pedido: {money(asking)}</span>
      </div>

      <div className="field mt-16">
        <label className="label">Estrutura de pagamento</label>
        <div className="segmented">
          <button className="active">100% à vista</button>
          <button disabled title="Fora do piloto (Fase 2)">Seller financing</button>
          <button disabled title="Fora do piloto (Fase 2)">Earn-out</button>
        </div>
      </div>

      <div className="card-inner mt-16 small" style={{ display: "grid", gap: 8 }}>
        <div className="row-between"><span>Preço (P)</span><b>{money(price)}</b></div>
        <div className="row-between"><span>Taxa do comprador (B) · Free</span><b>{money(fee)}</b></div>
        <div className="row-between"><span>Custos externos (E)</span><b>{money(external)}</b></div>
        <div className="divider" style={{ margin: "4px 0" }} />
        <div className="row-between"><span className="strong">Depósito no escrow (P + B + E)</span><b>{money(required)}</b></div>
        <div className="row-between muted"><span>Sua prova de fundos</span><span>{money(pof)}</span></div>
      </div>

      {!covered && (
        <div className="note note-red mt-16">
          <TriangleAlert size={16} />
          <span>A prova de fundos não cobre preço + taxa + custos previstos. A LOI fica bloqueada até um novo comprovante.</span>
        </div>
      )}

      <div className="note mt-16">
        <Clock size={16} />
        <span>
          No-shop de <b>{track === "Fast" ? "10" : "20"} dias úteis</b> a partir do aceite. A LOI não vincula a compra, salvo
          cláusulas expressamente vinculantes; não há multa por mera desistência antes do APA.
        </span>
      </div>

      <label className="check mt-16">
        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
        <span className="small">Confirmo os termos da LOI e que minha prova de fundos continua válida.</span>
      </label>

      <button className="btn btn-primary btn-block btn-lg mt-16" disabled={!covered || !accepted || !inEnvelope} onClick={onSend}>
        Enviar LOI
      </button>
    </Modal>
  );
}
