"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, FileText, Info, Plug, TriangleAlert, X, Zap } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/data";
import { PRICE_MAX, PRICE_MIN, sellerCommission } from "@/lib/fees";
import { money } from "@/lib/format";

const STEPS = ["Negócio", "Métricas", "Verificação", "Transferência", "Revisão"];

const DECLARATIONS = [
  { key: "owner", label: "Sou titular (ou represento o titular) de todos os ativos à venda", filter: "Titularidade comprovada" },
  { key: "kyc", label: "Posso comprovar identidade e beneficiário final", filter: "Identificação e beneficiário final" },
  { key: "transfer", label: "Repositório, domínio, infraestrutura e billing são transferíveis", filter: "Transferibilidade" },
  { key: "liabilities", label: "Não há passivo incompatível (dívidas, litígios, direitos disputados)", filter: "Ausência de passivo incompatível" },
  { key: "dd", label: "Disponibilizo documentos para diligência antes da LOI", filter: "Capacidade de diligência antes da LOI" },
] as const;

const EXTRA = [
  { key: "noEmployees", label: "Sem empregados transferidos" },
  { key: "noStock", label: "Sem estoque físico" },
  { key: "notRegulated", label: "Não é setor regulado, oferta de investimento ou custódia cripto" },
] as const;

type Decl = Record<(typeof DECLARATIONS)[number]["key"] | (typeof EXTRA)[number]["key"], boolean>;

export default function SubmitWizard() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<Category>("Micro-SaaS B2B");
  const [desc, setDesc] = useState("");

  const [months, setMonths] = useState(12);
  const [mrr, setMrr] = useState(8000);
  const [sde, setSde] = useState(5000);
  const [price, setPrice] = useState(200_000);

  const [source, setSource] = useState<"stripe" | "asaas" | "doc" | null>(null);
  const [connected, setConnected] = useState(false);

  const [decl, setDecl] = useState<Decl>({
    owner: false, kyc: false, transfer: false, liabilities: false, dd: false,
    noEmployees: false, noStock: false, notRegulated: false,
  });

  const priority = category === "Micro-SaaS B2B" || category === "Ferramenta digital";
  const filters = [
    { label: "6 meses de receita comprovada", ok: months >= 6 },
    { label: "Preço dentro do envelope (R$ 25 mil – R$ 5 mi)", ok: price >= PRICE_MIN && price <= PRICE_MAX },
    ...DECLARATIONS.map((d) => ({ label: d.filter, ok: decl[d.key] })),
    { label: "SDE normalizado positivo nos últimos 3 meses fechados", ok: sde > 0 },
  ];
  const allPass = filters.every((f) => f.ok) && decl.notRegulated && !!source && (source === "doc" || connected);
  const fastEligible =
    priority && price <= 500_000 && source !== "doc" && connected && decl.noEmployees && decl.noStock;
  const fee = sellerCommission(price);

  const canNext = [
    name.trim().length > 1 && desc.trim().length > 10,
    months > 0 && mrr > 0 && price > 0,
    !!source && (source === "doc" || connected),
    true,
    allPass,
  ][step];

  if (done) {
    return (
      <div className="card center" style={{ padding: 48 }}>
        <span className="req-ico ok" style={{ width: 64, height: 64, margin: "0 auto" }}><Check size={30} /></span>
        <h3 className="h2 mt-24">Submissão recebida</h3>
        <p className="lead mt-12" style={{ maxWidth: 560, margin: "12px auto 0" }}>
          “{name}” entrou em curadoria. Você receberá o score, a justificativa e eventuais pedidos de correção, com
          revisão por um segundo avaliador.
        </p>
        <div className="row wrap mt-24" style={{ justifyContent: "center" }}>
          <span className="badge badge-outline">Status: CURATION</span>
          <span className="badge badge-green">{fastEligible ? "Pré-classificação: Fast" : "Pré-classificação: Standard"}</span>
        </div>
        <div className="row wrap mt-32" style={{ justifyContent: "center" }}>
          <Link href="/painel?v=vendedor" className="btn btn-primary">Acompanhar no painel</Link>
          <button className="btn btn-ghost" onClick={() => { setDone(false); setStep(0); }}>Nova submissão</button>
        </div>
        <p className="tiny muted mt-24">Simulação: nenhum dado foi enviado ou armazenado.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 28 }}>
      <div className="wizard-steps">
        {STEPS.map((s, i) => (
          <button
            key={s}
            className={`wstep ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
            style={{ border: "1px solid #edf0f4", cursor: i < step ? "pointer" : "default" }}
            onClick={() => i < step && setStep(i)}
          >
            <span className="n">{i < step ? <Check size={13} /> : i + 1}</span>
            {s}
          </button>
        ))}
      </div>

      <div className="mt-32" style={{ minHeight: 340 }}>
        {step === 0 && (
          <div className="bento g-2" style={{ gap: 20 }}>
            <div className="field">
              <label className="label">Nome do negócio</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Agendaí" />
            </div>
            <div className="field">
              <label className="label">URL</label>
              <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
            </div>
            <div className="field">
              <label className="label">Categoria</label>
              <select className="select" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {!priority && (
                <span className="hint" style={{ color: "#8a5a00" }}>Esta categoria entra somente no trilho Standard, após checklist específico.</span>
              )}
            </div>
            <div className="field">
              <label className="label">Tipo de transação</label>
              <div className="segmented">
                <button className="active">Venda de ativos</button>
                <button disabled title="Fora do escopo do piloto">Venda de quotas</button>
              </div>
            </div>
            <div className="field span-2">
              <label className="label">Descrição</label>
              <textarea className="textarea" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="O que o produto faz, para quem, como adquire clientes, quanto tempo você dedica por semana…" />
              <span className="hint">Mínimo de 10 caracteres. Não inclua dados pessoais de clientes.</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="bento g-2" style={{ gap: 20 }}>
            <NumField label="Meses de receita comprovada" value={months} onChange={setMonths} hint="Mínimo de 6 meses" error={months < 6} />
            <NumField label="MRR atual (R$)" value={mrr} onChange={setMrr} hint="Sem receita única, tributos e descontos; anuais normalizados" />
            <NumField label="SDE médio mensal — últimos 3 meses fechados (R$)" value={sde} onChange={setSde} hint="Com ajustes comprovados de um operador" error={sde <= 0} />
            <NumField label="Preço pedido (R$)" value={price} onChange={setPrice} hint="Entre R$ 25 mil e R$ 5 milhões, à vista" error={price < PRICE_MIN || price > PRICE_MAX} step={5000} />
            <div className="span-2 bento g-3" style={{ gap: 10 }}>
              <div className="card-inner"><div className="tiny muted">ARR (12 × MRR)</div><div className="mid-num">{money(mrr * 12)}</div></div>
              <div className="card-inner"><div className="tiny muted">SDE anualizado</div><div className="mid-num">{money(sde * 12)}</div></div>
              <div className="card-inner"><div className="tiny muted">Múltiplo implícito</div><div className="mid-num">{sde > 0 ? `${(price / (sde * 12)).toFixed(1).replace(".", ",")}x` : "—"}</div></div>
            </div>
            {months < 12 && months >= 6 && (
              <div className="note note-blue span-2"><Info size={16} /> Com menos de 12 meses, a anualização é identificada explicitamente, com sazonalidade e faixa de incerteza.</div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="bento g-3">
              {([
                ["stripe", "Stripe", "#635bff", "S", "Conector com permissões verificadas"],
                ["asaas", "Asaas", "#0a3fd1", "A", "Conector com permissões verificadas"],
                ["doc", "Documental", "#0e1116", "D", "Extratos e relatórios · só Standard"],
              ] as const).map(([k, n, c, letter, sub]) => (
                <button
                  key={k}
                  className="card card-flat"
                  onClick={() => { setSource(k); setConnected(false); }}
                  style={{
                    textAlign: "left", cursor: "pointer",
                    border: source === k ? "2px solid var(--ink)" : "1px solid var(--line)",
                    background: "#fff",
                  }}
                >
                  <div className="row-between">
                    <span className="brand-mark" style={{ background: c, width: 44, height: 44 }}>{letter}</span>
                    {source === k && <span className="req-ico ok"><Check size={14} /></span>}
                  </div>
                  <div className="strong mt-16">{n}</div>
                  <div className="tiny muted">{sub}</div>
                </button>
              ))}
            </div>

            {(source === "stripe" || source === "asaas") && (
              <div className="card-inner mt-24">
                {connected ? (
                  <div className="row" style={{ gap: 12 }}>
                    <span className="req-ico ok"><Check size={14} /></span>
                    <div>
                      <div className="strong small">Conectado (simulação)</div>
                      <div className="tiny muted">Escopo verificado: leitura de cobranças, reembolsos, chargebacks e repasses. Sincronização diária.</div>
                    </div>
                  </div>
                ) : (
                  <div className="row-between wrap">
                    <div className="small" style={{ maxWidth: 520 }}>
                      Você será redirecionado ao {source === "stripe" ? "Stripe" : "Asaas"} para autorizar acesso restrito. Se o
                      fornecedor não impuser escopo de leitura e houver acesso de escrita sem mitigação, <b>não recebemos a chave</b> e
                      seguimos por verificação documental.
                    </div>
                    <button className="btn btn-primary" onClick={() => setConnected(true)}><Plug size={16} /> Conectar</button>
                  </div>
                )}
              </div>
            )}
            {source === "doc" && (
              <div className="note mt-24">
                <FileText size={16} />
                <span>Você enviará extratos e relatórios na curadoria. A verificação documental permite o trilho Standard; o Fast exige integração.</span>
              </div>
            )}
            <div className="note note-amber mt-16">
              <TriangleAlert size={16} />
              <span>Após 48 h sem sincronização, o selo fica desatualizado e novas LOIs são bloqueadas até revisão. Variação acima de 10% abre investigação.</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bento g-2" style={{ gap: 10 }}>
            {DECLARATIONS.map((d) => (
              <label className="check" key={d.key}>
                <input type="checkbox" checked={decl[d.key]} onChange={(e) => setDecl({ ...decl, [d.key]: e.target.checked })} />
                <span className="small">{d.label}</span>
              </label>
            ))}
            {EXTRA.map((d) => (
              <label className="check" key={d.key}>
                <input type="checkbox" checked={decl[d.key]} onChange={(e) => setDecl({ ...decl, [d.key]: e.target.checked })} />
                <span className="small">{d.label}</span>
              </label>
            ))}
            <div className="note span-2">
              <Info size={16} />
              <span>Declarações são verificadas na curadoria com documentos. Conta bancária e identidade de PJ não são transferidas como ativo genérico.</span>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bento g-2">
            <div>
              <div className="label mb-8">Filtros eliminatórios</div>
              <ul className="list-plain">
                {filters.map((f) => (
                  <li key={f.label}>
                    <span className={`req-ico ${f.ok ? "ok" : ""}`} style={{ width: 22, height: 22, background: f.ok ? undefined : "#fde4e4", color: f.ok ? undefined : "#b42318" }}>
                      {f.ok ? <Check size={12} /> : <X size={12} />}
                    </span>
                    {f.label}
                  </li>
                ))}
                <li>
                  <span className={`req-ico ${decl.notRegulated ? "ok" : ""}`} style={{ width: 22, height: 22, background: decl.notRegulated ? undefined : "#fde4e4", color: decl.notRegulated ? undefined : "#b42318" }}>
                    {decl.notRegulated ? <Check size={12} /> : <X size={12} />}
                  </span>
                  Fora das categorias excluídas
                </li>
              </ul>
              {!allPass && (
                <div className="note note-red mt-16"><TriangleAlert size={16} /> Score não compensa filtro eliminatório reprovado. Volte e ajuste os itens marcados.</div>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className={`card ${fastEligible ? "card--green" : "card--ink"}`}>
                <div className="card-label">Pré-classificação</div>
                <div className="big-num mt-12 row" style={{ gap: 8 }}>{fastEligible ? <><Zap size={24} /> Fast</> : "Standard"}</div>
                <div className="card-sub mt-8">
                  {fastEligible ? "Meta operacional de 7 dias úteis (não é garantia)" : "Cronograma individual · até 20 dias úteis (estim.)"}
                </div>
              </div>
              <div className="card-inner">
                <div className="row-between small"><span>Comissão de tabela</span><b>{money(fee.table)}</b></div>
                <div className="row-between small mt-8"><span>Com oferta inaugural*</span><b>{money(fee.inaugural)}</b></div>
                <div className="tiny muted mt-8">*Se estiver entre os 10 primeiros aprovados e assinar em até 90 dias após a publicação.</div>
              </div>
              <div className="note"><BadgeCheck size={16} /> Sem taxa de listagem. Comissão só no fechamento.</div>
            </div>
          </div>
        )}
      </div>

      <div className="row-between mt-32" style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
        <button className="btn btn-ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ArrowLeft size={16} /> Voltar
        </button>
        {step < STEPS.length - 1 ? (
          <button className="btn btn-primary" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
            Continuar <ArrowRight size={16} />
          </button>
        ) : (
          <button className="btn btn-green" disabled={!allPass} onClick={() => setDone(true)}>
            Enviar para curadoria <Check size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function NumField({
  label, value, onChange, hint, error, step = 100,
}: { label: string; value: number; onChange: (v: number) => void; hint?: string; error?: boolean; step?: number }) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <input className={`input ${error ? "error" : ""}`} type="number" value={value} step={step} onChange={(e) => onChange(+e.target.value)} />
      {hint && <span className="hint" style={error ? { color: "var(--red)" } : undefined}>{hint}</span>}
    </div>
  );
}
