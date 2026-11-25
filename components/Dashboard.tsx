"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  Check,
  Clock,
  FileText,
  Hourglass,
  Info,
  Landmark,
  Lock,
  RefreshCw,
  ShieldAlert,
  TriangleAlert,
  Zap,
} from "lucide-react";
import {
  ACTIVE_DEAL,
  BUYER_ROOMS,
  DEAL_STEPS,
  SELLER_LISTING,
  getListing,
  scoreTotal,
} from "@/lib/data";
import { buyerFee, sellerCommission } from "@/lib/fees";
import { money, moneyCents } from "@/lib/format";
import { LineSpark } from "./Charts";
import { ArrowBtn, AvatarStack, ListingLogo } from "./ui";
import { Modal } from "./ListingDetail";

type View = "comprador" | "vendedor";

export default function Dashboard() {
  const params = useSearchParams();
  const [view, setView] = useState<View>(params.get("v") === "vendedor" ? "vendedor" : "comprador");

  return (
    <section className="section-tight">
      <div className="container">
        <div className="row-between wrap mb-24">
          <h1 className="h1">{view === "comprador" ? "Suas aquisições" : "Seu anúncio"}</h1>
          <div className="row wrap">
            <div className="segmented">
              <button className={view === "comprador" ? "active" : ""} onClick={() => setView("comprador")}>Comprador</button>
              <button className={view === "vendedor" ? "active" : ""} onClick={() => setView("vendedor")}>Vendedor</button>
            </div>
            <button className="icon-btn" aria-label="Notificações" style={{ background: "#fff" }}><Bell size={17} /></button>
          </div>
        </div>
        {view === "comprador" ? <BuyerView /> : <SellerView />}
      </div>
    </section>
  );
}

/* ====================================================== */

type Phase = "inspection" | "approved" | "disputed";

function BuyerView() {
  const d = ACTIVE_DEAL;
  const l = getListing(d.listingId)!;
  const B = buyerFee(d.price, d.buyerPlan);
  const deposit = d.price + B + d.externalCosts;

  const [phase, setPhase] = useState<Phase>("inspection");
  const [modal, setModal] = useState<null | "approve" | "dispute">(null);
  const [reason, setReason] = useState("Funcionalidade");

  const currentIdx = DEAL_STEPS.findIndex((s) => s.state === (phase === "approved" ? "RELEASE_AUTHORIZED" : d.state));
  const pendingCriteria = d.inspectionCriteria.filter((c) => c.status !== "ok").length;

  return (
    <>
      <div className="bento g-4">
        {/* Deal card */}
        <div className={`card span-3 ${phase === "disputed" ? "card--ink" : "card--orange"}`}>
          <div className="card-head">
            <div className="row" style={{ gap: 14 }}>
              <ListingLogo listing={l} size={44} onColor />
              <div>
                <div className="card-label">{d.code} · {l.name}</div>
                <div className="card-sub row" style={{ gap: 6 }}><Zap size={12} /> Trilho Fast · {money(d.price)} à vista</div>
              </div>
            </div>
            <Link href={`/anuncio/${l.id}`} aria-label="Ver anúncio"><ArrowBtn /></Link>
          </div>

          <div className="row-between wrap mt-24" style={{ alignItems: "flex-end" }}>
            <div>
              <div className="card-sub">Estado atual</div>
              <div className="hero-num">
                {phase === "inspection" && "Inspeção"}
                {phase === "approved" && "Liberação em aprovação"}
                {phase === "disputed" && "Em disputa"}
              </div>
            </div>
            <div className="badge" style={{ background: "rgba(255,255,255,.2)", color: "#fff", height: 32, fontSize: 13 }}>
              {phase === "inspection" && <><Hourglass size={14} /> termina em {d.inspectionEndsIn}</>}
              {phase === "approved" && <><Clock size={14} /> aguardando Ops + 2º aprovador</>}
              {phase === "disputed" && <><Lock size={14} /> liberação bloqueada no parceiro</>}
            </div>
          </div>

          <div className="steps mt-24">
            {DEAL_STEPS.map((s, i) => (
              <div key={s.state} className={`step ${i < currentIdx ? "done" : ""} ${i === currentIdx ? "current" : ""}`} title={s.hint}>
                <div className="step-bar" />
                <div className="step-label">{s.label}</div>
                <div className="step-day">{s.day}</div>
              </div>
            ))}
          </div>

          {phase === "inspection" && (
            <div className="row wrap mt-24">
              <button className="btn btn-white" onClick={() => setModal("approve")}>
                <Check size={16} /> Aprovar inspeção
              </button>
              <button className="btn" style={{ background: "rgba(255,255,255,.16)", color: "#fff" }} onClick={() => setModal("dispute")}>
                <ShieldAlert size={16} /> Abrir disputa
              </button>
              <span className="small" style={{ opacity: 0.8 }}>Silêncio não libera automaticamente pelo app.</span>
            </div>
          )}
          {phase === "disputed" && (
            <p className="small mt-24" style={{ opacity: 0.8 }}>
              Motivo: {reason}. Triagem em 1 dia útil · saneamento sugerido em 3 · mediação em 5. A mesa propõe; não
              sentencia nem atua como árbitro.
            </p>
          )}
        </div>

        {/* Escrow */}
        <div className="card card--blue rings">
          <div className="card-head">
            <div className="card-label">Escrow</div>
            <Landmark size={20} />
          </div>
          <div className="big-num mt-24">{moneyCents(deposit)}</div>
          <div className="card-sub mt-8">Saldo confirmado e bloqueado</div>
          <div className="divider" style={{ background: "rgba(255,255,255,.2)" }} />
          <div className="small" style={{ display: "grid", gap: 6, opacity: 0.9 }}>
            <div className="row-between"><span>Preço (P)</span><span>{money(d.price)}</span></div>
            <div className="row-between"><span>Taxa (B) · Free</span><span>{money(B)}</span></div>
            <div className="row-between"><span>Custos (E)</span><span>{money(d.externalCosts)}</span></div>
          </div>
          <div className="tiny mt-16" style={{ opacity: 0.7 }}>Fonte de verdade: consulta ao parceiro · 18/11 15:22</div>
        </div>

        {/* PoF */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-label">Prova de fundos</div>
              <div className="card-sub">faixa exibida ao vendedor</div>
            </div>
            <span className="badge badge-green"><BadgeCheck size={12} /> válida</span>
          </div>
          <div className="big-num mt-16">R$ 300–350 mil</div>
          <div className="row-between tiny muted mt-16"><span>Enviada há 11 dias</span><span>LOI: até 30 · geral: até 90</span></div>
          <div className="meter mt-8"><span style={{ width: `${(11 / 90) * 100}%`, background: "var(--green)" }} /></div>
          <p className="tiny muted mt-12">Revalidação antes do depósito se houver mudança material.</p>
        </div>

        {/* Data rooms */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-label">Data Rooms</div>
              <div className="card-sub">Plano Free · 1 por vez</div>
            </div>
            <div className="mid-num">1/1</div>
          </div>
          {BUYER_ROOMS.map((r) => {
            const rl = getListing(r.listingId)!;
            return (
              <Link key={r.listingId} href={`/anuncio/${rl.id}`} className="card-inner row mt-16" style={{ gap: 12 }}>
                <ListingLogo listing={rl} size={36} />
                <div className="grow">
                  <div className="small strong">{rl.name}</div>
                  <div className="tiny muted">NDA {r.nda} · expira {r.expires}</div>
                </div>
              </Link>
            );
          })}
          <Link href="/precos" className="btn btn-soft btn-sm btn-block mt-12">Aumentar para 5 salas (Pro)</Link>
        </div>

        {/* Approvals */}
        <div className="card card--green">
          <div className="card-head">
            <div className="card-label">Aprovações de payout</div>
            <ArrowBtn />
          </div>
          <div className="hero-num mt-16">{phase === "approved" ? "1" : "0"}<span style={{ fontSize: 22, opacity: 0.7 }}>/2</span></div>
          <div className="small mt-16" style={{ display: "grid", gap: 8 }}>
            <div className="row" style={{ gap: 8 }}>
              {phase === "approved" ? <Check size={14} /> : <Clock size={14} />} Ops · Curadoria
            </div>
            <div className="row" style={{ gap: 8 }}><Clock size={14} /> Segundo aprovador</div>
          </div>
          <p className="tiny mt-16" style={{ opacity: 0.8 }}>Beneficiário editado invalida aprovações anteriores.</p>
        </div>

        {/* Team / parties */}
        <div className="card">
          <div className="card-label">Partes e mesa</div>
          <div className="card-sub">comunicação registrada no deal</div>
          <div className="card-inner mt-16">
            <div className="row-between">
              <div>
                <div className="small strong">Vendedor, Ops, Jurídico</div>
                <div className="tiny muted">+ você</div>
              </div>
              <ArrowBtn />
            </div>
            <div className="mt-12"><AvatarStack names={["VD", "OP", "JR"]} more={1} small /></div>
          </div>
        </div>
      </div>

      <div className="bento g-3 mt-16">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-label">Checklist de handover</div>
              <div className="card-sub">validado por Ops</div>
            </div>
            <span className="badge badge-green">{d.handover.filter((h) => h.done).length}/{d.handover.length}</span>
          </div>
          <ul className="list-plain mt-12">
            {d.handover.map((h) => (
              <li key={h.label}>
                <span className="req-ico ok" style={{ width: 20, height: 20 }}><Check size={11} /></span>
                <span className="small">{h.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-label">Critérios de inspeção</div>
              <div className="card-sub">anexos ao APA</div>
            </div>
            {pendingCriteria > 0 ? <span className="badge badge-amber">{pendingCriteria} pendente</span> : <span className="badge badge-green">ok</span>}
          </div>
          <div className="mt-16" style={{ display: "grid", gap: 8 }}>
            {d.inspectionCriteria.map((c) => (
              <div key={c.label} className="req">
                <span className={`req-ico ${c.status === "ok" ? "ok" : "no"}`}>{c.status === "ok" ? <Check size={14} /> : <Hourglass size={13} />}</span>
                <div className="grow small strong">{c.label}</div>
                <span className="tiny muted">{c.status === "ok" ? "conferido" : "em conferência"}</span>
              </div>
            ))}
          </div>
          <div className="note mt-16">
            <Info size={16} />
            <span>Falha relevante, fraude, vazamento, violação de PI ou impedimento de cessão também permitem abrir disputa.</span>
          </div>
        </div>

        <div className="card">
          <div className="card-label">Trilha de auditoria</div>
          <div className="card-sub">autor, horário, evidência e precondições</div>
          <ul className="timeline mt-16">
            {phase === "approved" && (
              <li><div className="tiny muted">Agora · Você</div>Inspeção aprovada; liberação aguardando dupla aprovação</li>
            )}
            {phase === "disputed" && (
              <li><div className="tiny muted">Agora · Você</div>Disputa aberta ({reason}); payout bloqueado no parceiro</li>
            )}
            {d.events.map((e) => (
              <li key={e.when + e.what}>
                <div className="tiny muted">{e.when} · {e.who}</div>
                {e.what}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <TransactionPackage />

      {modal === "approve" && (
        <Modal title="Aprovar inspeção" onClose={() => setModal(null)}>
          <p className="small">
            Ao aprovar, você confirma os critérios de inspeção do APA. A liberação ainda depende de <b>revisão de Ops e de um
            segundo aprovador</b>, e o crédito só é considerado concluído após comprovante do parceiro.
          </p>
          {pendingCriteria > 0 && (
            <div className="note note-amber mt-16">
              <TriangleAlert size={16} /> Há {pendingCriteria} critério em conferência (receita de referência). Você pode aguardar até o fim da inspeção.
            </div>
          )}
          <div className="row mt-24">
            <button className="btn btn-ghost grow" onClick={() => setModal(null)}>Aguardar</button>
            <button className="btn btn-primary grow" onClick={() => { setPhase("approved"); setModal(null); }}>Aprovar</button>
          </div>
        </Modal>
      )}

      {modal === "dispute" && (
        <Modal title="Abrir disputa" onClose={() => setModal(null)}>
          <p className="small muted">A disputa bloqueia a liberação antes da expiração, preserva evidências e congela tarefas críticas.</p>
          <div className="field mt-16">
            <label className="label">Motivo</label>
            <select className="select" value={reason} onChange={(e) => setReason(e.target.value)}>
              {["Funcionalidade", "Propriedade", "Acesso", "Receita de referência", "Dependências", "Fraude", "Vazamento", "Violação de PI", "Impedimento de cessão"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="field mt-16">
            <label className="label">Descrição e evidências</label>
            <textarea className="textarea" placeholder="Descreva o problema. Anexos ficam no registro do deal (simulação)." />
          </div>
          <button className="btn btn-orange btn-block mt-16" onClick={() => { setPhase("disputed"); setModal(null); }}>
            Abrir disputa
          </button>
        </Modal>
      )}
    </>
  );
}

function TransactionPackage() {
  const groups = [
    {
      title: "Antes do depósito",
      items: ["Identidades e beneficiários finais", "PoF", "Scorecard", "Provas de propriedade", "Certidões e análise", "Métricas reconciliadas", "Mapa de cessões", "NDA, LOI, APA e versões", "Cotação de taxas", "Contrato de escrow", "Beneficiários", "Plano de unwind"],
      done: 12,
    },
    {
      title: "Do depósito à liquidação",
      items: ["Notificações", "Entregas", "Rotação de credenciais e revogação", "Inspeção", "Duas aprovações", "Comprovante de crédito", "Notas fiscais", "Conciliação"],
      done: 3,
    },
    { title: "Pós-fechamento", items: ["Transição de 30 dias / até 10 h", "Pesquisa e retrospectiva"], done: 0 },
  ];
  return (
    <div className="card mt-16">
      <div className="card-head">
        <div>
          <div className="card-label">Pacote mínimo da transação</div>
          <div className="card-sub">Documento faltante bloqueia a etapa correspondente</div>
        </div>
        <FileText size={20} />
      </div>
      <div className="bento g-3 mt-16">
        {groups.map((g) => (
          <div key={g.title} className="card-inner">
            <div className="row-between">
              <div className="small strong">{g.title}</div>
              <span className="tiny muted">{g.done}/{g.items.length}</span>
            </div>
            <div className="meter mt-8"><span style={{ width: `${(g.done / g.items.length) * 100}%`, background: g.done === g.items.length ? "var(--green)" : "var(--ink)" }} /></div>
            <ul className="list-plain mt-8">
              {g.items.map((it, i) => (
                <li key={it} style={{ padding: "6px 0", fontSize: 13 }}>
                  {i < g.done ? <Check size={14} style={{ color: "var(--green)", flex: "none", marginTop: 2 }} /> : <span style={{ width: 14, height: 14, borderRadius: 99, border: "1.5px solid #c3cad4", flex: "none", marginTop: 2 }} />}
                  <span className={i < g.done ? "" : "muted"}>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====================================================== */

function SellerView() {
  const s = SELLER_LISTING;
  const l = getListing(s.listingId)!;
  const fee = sellerCommission(l.askingPrice);
  const [lois, setLois] = useState(s.lois.map((x) => ({ ...x })));
  const accepted = lois.find((x) => x.status === "aceita");

  const accept = (i: number) =>
    setLois((ls) => ls.map((x, j) => ({ ...x, status: j === i ? "aceita" : x.status === "recusada" ? "recusada" : "backup" })));
  const decline = (i: number) => setLois((ls) => ls.map((x, j) => (j === i ? { ...x, status: "recusada" } : x)));

  return (
    <>
      <div className="bento g-4">
        <div className="card span-2">
          <div className="card-head">
            <div className="row" style={{ gap: 14 }}>
              <ListingLogo listing={l} size={48} />
              <div>
                <div className="h3">{l.name}</div>
                <div className="small muted">Publicado há {l.publishedDaysAgo} dias · Fast · {money(l.askingPrice)}</div>
              </div>
            </div>
            <Link href={`/anuncio/${l.id}`} aria-label="Ver anúncio"><ArrowBtn /></Link>
          </div>
          <div className="bento g-3 mt-24" style={{ gap: 10 }}>
            <div className="card-inner"><div className="tiny muted">Score</div><div className="mid-num">{scoreTotal(l)}/100</div></div>
            <div className="card-inner"><div className="tiny muted">NDAs assinados</div><div className="mid-num">{s.ndas}</div></div>
            <div className="card-inner"><div className="tiny muted">LOIs qualificadas</div><div className="mid-num">{lois.filter((x) => x.status !== "recusada").length}</div></div>
          </div>
          <div className="row-between mt-16 small">
            <span className="row" style={{ gap: 6 }}><RefreshCw size={14} style={{ color: "var(--green)" }} /> Stripe sincronizado há {l.verification.lastSyncHours} h</span>
            <span className="muted">Meta: 5 NDAs e 1 LOI em 14 dias ✓</span>
          </div>
        </div>

        <div className="card card--orange">
          <div className="card-head">
            <div className="card-label">Visualizações</div>
            <ArrowBtn />
          </div>
          <div className="big-num mt-12">{s.views.toLocaleString("pt-BR")}</div>
          <LineSpark values={[120, 150, 140, 190, 312, 230, 142]} labels={["S", "T", "Q", "Q", "S", "S", "D"]} highlight={4} tooltip="312" height={100} />
        </div>

        <div className="card card--ink">
          <div className="card-label">Comissão estimada</div>
          <div className="big-num mt-12">{money(fee.inaugural)}</div>
          <div className="card-sub mt-8">Oferta inaugural · tabela <span style={{ textDecoration: "line-through" }}>{money(fee.table)}</span></div>
          <div className="divider" style={{ background: "rgba(255,255,255,.15)" }} />
          <div className="card-sub">Elegibilidade nº 3 de 10 · assinar até 90 dias após a publicação</div>
        </div>
      </div>

      <div className="bento g-3 mt-16">
        <div className="card span-2">
          <div className="card-head">
            <div>
              <div className="card-label">LOIs recebidas</div>
              <div className="card-sub">Você vê apenas a faixa indicativa da prova de fundos</div>
            </div>
            {accepted && <span className="badge badge-green">No-shop: 10 dias úteis</span>}
          </div>
          <div className="table-wrap mt-16">
            <table className="table">
              <thead>
                <tr><th>Comprador</th><th>Oferta</th><th>Faixa de fundos</th><th>PoF</th><th style={{ textAlign: "right" }}>Ação</th></tr>
              </thead>
              <tbody>
                {lois.map((x, i) => (
                  <tr key={x.buyer}>
                    <td><div className="strong small">{x.buyer}</div><div className="tiny muted">KYC + beneficiário final ✓</div></td>
                    <td className="strong">{money(x.price)}</td>
                    <td className="small">{x.pofBand}</td>
                    <td className="small">{x.pofAge} dias</td>
                    <td style={{ textAlign: "right" }}>
                      {x.status === "nova" && !accepted && (
                        <div className="row" style={{ justifyContent: "flex-end", gap: 6 }}>
                          <button className="btn btn-soft btn-sm" onClick={() => decline(i)}>Recusar</button>
                          <button className="btn btn-primary btn-sm" onClick={() => accept(i)}>Aceitar</button>
                        </div>
                      )}
                      {x.status === "aceita" && <span className="badge badge-green"><Check size={12} /> Aceita</span>}
                      {x.status === "backup" && <span className="badge">Backup</span>}
                      {x.status === "recusada" && <span className="badge badge-red">Recusada</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="note mt-16">
            <Info size={16} />
            <span>Uma LOI aceita por anúncio. As demais viram backup, sem exclusividade concorrente. A LOI não vincula a compra antes do APA.</span>
          </div>
        </div>

        <div className="card">
          <div className="card-label">Pendências da curadoria</div>
          <div className="card-sub">antes do depósito</div>
          <div className="mt-16" style={{ display: "grid", gap: 8 }}>
            <div className="req"><span className="req-ico ok"><Check size={14} /></span><div className="grow small strong">Provas de propriedade</div></div>
            <div className="req"><span className="req-ico ok"><Check size={14} /></span><div className="grow small strong">Métricas reconciliadas</div></div>
            <div className="req"><span className="req-ico no" /><div className="grow"><div className="small strong">Mapa de cessões</div><div className="tiny muted">Anexar termos da API de WhatsApp</div></div></div>
            <div className="req"><span className="req-ico no" /><div className="grow"><div className="small strong">Plano de unwind</div><div className="tiny muted">Obrigatório antes do depósito</div></div></div>
            <div className="req"><span className="req-ico no" /><div className="grow"><div className="small strong">Conta de recebimento</div><div className="tiny muted">Validação independente do beneficiário</div></div></div>
          </div>
          <button className="btn btn-primary btn-block mt-16">Enviar documentos</button>
        </div>
      </div>
    </>
  );
}
