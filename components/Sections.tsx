import type { CSSProperties } from "react";
import {
  BadgeCheck,
  FileSignature,
  Landmark,
  Lock,
  Plus,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { ArrowBtn, AvatarStack, BrandChip } from "./ui";
import Reveal from "./Reveal";

/** índice de atraso para itens que "caem um por um" */
const i = (n: number) => ({ "--i": n }) as CSSProperties;

export function TrustBento() {
  return (
    <Reveal className="bento g-3" threshold={0.15}>
      <div className="card span-2 drop" style={i(0)}>
        <div className="card-head">
          <div>
            <div className="card-label">Métricas verificadas</div>
            <div className="card-sub">Fonte, período, cobertura, atualização e limitações — sempre visíveis</div>
          </div>
          <ArrowBtn />
        </div>
        <div className="bento g-2 mt-24" style={{ gap: 10 }}>
          <BrandChip name="Stripe" sub="Conector · leitura verificada" color="#635bff" letter="S" />
          <BrandChip name="Asaas" sub="Conector · leitura verificada" color="#0a3fd1" letter="A" />
          <BrandChip name="Documental" sub="Extratos e relatórios" color="#0e1116" letter="D" />
          <BrandChip name="Snapshot no APA" sub="Datado e imutável" color="#0fb866" letter="✓" />
        </div>
        <p className="small muted mt-16">
          Receita ≠ caixa. A integração concilia receita, taxas, reembolsos e chargebacks, mas não comprova despesas,
          propriedade intelectual nem ausência de passivos — isso vem da diligência.
        </p>
      </div>

      <div className="card card--blue rings drop" style={i(1)}>
        <div className="card-head">
          <div className="card-label">Escrow com parceiro habilitado</div>
          <ArrowBtn />
        </div>
        <Landmark size={28} className="mt-24" />
        <div className="big-num mt-12">Nunca em conta da plataforma</div>
        <p className="small mt-12" style={{ opacity: 0.8 }}>
          O preço fica bloqueado no parceiro. Handover só começa com saldo confirmado por consulta ao parceiro — print
          ou comprovante não liberam nada.
        </p>
      </div>

      <div className="card drop" style={i(2)}>
        <div className="card-head">
          <div className="card-label">Compradores qualificados</div>
          <ArrowBtn />
        </div>
        <div className="card-inner mt-24">
          <div className="strong small">Antes do Data Room</div>
          <div className="tiny muted">Identidade · beneficiário final · prova de fundos · NDA</div>
          <div className="mt-16">
            <AvatarStack names={["LM", "RA", "JS"]} more={8} />
          </div>
        </div>
      </div>

      <div className="card card--green drop" style={i(3)}>
        <div className="card-head">
          <div className="card-label">Dupla aprovação</div>
          <ArrowBtn />
        </div>
        <ShieldCheck size={28} className="mt-24" />
        <div className="big-num mt-12">2 aprovadores</div>
        <p className="small mt-12" style={{ opacity: 0.85 }}>
          Payout exige revisão humana de Ops + segundo aprovador. Silêncio do comprador não libera pelo app.
        </p>
      </div>

      <div className="card drop" style={i(4)}>
        <div className="card-head">
          <div className="card-label">Curadoria com score</div>
          <ArrowBtn />
        </div>
        <div className="hero-num mt-24">
          60<span className="muted" style={{ fontSize: 22 }}>/100</span>
        </div>
        <div className="card-sub">nota mínima, sem compensar filtro eliminatório</div>
        <div className="mt-16 small" style={{ display: "grid", gap: 8 }}>
          {[
            ["Receita", 25],
            ["Margem", 15],
            ["Retenção", 15],
          ].map(([k, w]) => (
            <div key={k as string}>
              <div className="row-between tiny"><span>{k}</span><span className="muted">{w} pts</span></div>
              <div className="meter mt-8"><span style={{ width: `${(w as number) * 4}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function TracksCompare() {
  return (
    <div className="bento g-2">
      <div className="card card--ink">
        <div className="row-between">
          <span className="badge badge-solid-green"><Zap size={12} /> Fast</span>
          <span className="tiny" style={{ opacity: 0.6 }}>até R$ 500 mil · 100% à vista</span>
        </div>
        <div className="hero-num mt-24">7 dias úteis</div>
        <div className="card-sub">meta operacional, do aceite da LOI ao crédito confirmado</div>
        <div className="steps mt-24" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
          {[
            ["D0", "LOI aceita"],
            ["D1", "APA"],
            ["D2", "Saldo bloqueado"],
            ["D4", "Entrega completa"],
            ["D7", "Liberação"],
          ].map(([d, l]) => (
            <div className="step done" key={d}>
              <div className="step-bar" />
              <div className="step-label">{l}</div>
              <div className="step-day">{d}</div>
            </div>
          ))}
        </div>
        <p className="tiny mt-24" style={{ opacity: 0.6 }}>
          Não é garantia de liquidação. Suspenso por disputa, exigência regulatória ou condição precedente documentada.
          Apenas para casos previamente classificados: titularidade e certidões prontas, sem empregados, holdback ou
          migração crítica.
        </p>
      </div>

      <div className="card">
        <div className="row-between">
          <span className="badge badge-outline">Standard</span>
          <span className="tiny muted">demais casos dentro do escopo</span>
        </div>
        <div className="hero-num mt-24">até 20 dias úteis</div>
        <div className="card-sub">estimativa com calendário individual por operação</div>
        <ul className="list-plain mt-16">
          {[
            "Cronograma por operação, com etapas externas identificadas",
            "5 dias úteis de inspeção local",
            "Apps, newsletters, conteúdo e infoprodutos após checklist específico",
            "Exceções informadas previamente",
          ].map((t) => (
            <li key={t}>
              <BadgeCheck size={16} style={{ color: "var(--green)", marginTop: 2, flex: "none" }} /> {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const FAQ_ITEMS: Array<[string, string]> = [
  [
    "O dinheiro do comprador passa pela conta da plataforma?",
    "Não. O preço é depositado em escrow com um parceiro contratado e habilitado. A plataforma recebe apenas a sua comissão e a taxa do comprador, por fluxo validado.",
  ],
  [
    "O prazo de 7 dias do trilho Fast é garantido?",
    "Não. É uma meta operacional para casos previamente classificados, contada do aceite da LOI ao crédito confirmado. O prazo fica suspenso em caso de disputa, exigência regulatória ou condição precedente documentada.",
  ],
  [
    "O que significa “verificado via integração”?",
    "Que a receita foi lida diretamente do Stripe ou do Asaas com permissões verificadas, informando fonte, período, cobertura, data da última atualização e limitações. Não é auditoria independente.",
  ],
  [
    "Quais negócios são aceitos?",
    "Prioritariamente Micro-SaaS B2B e ferramentas digitais recorrentes, com pelo menos 6 meses de receita comprovada, SDE positivo nos últimos 3 meses, preço entre R$ 25 mil e R$ 5 milhões e transferência demonstrável. Não aceitamos pré-receita, venda de quotas, ofertas de investimento ou setores regulados.",
  ],
  [
    "Posso comprar em dólar?",
    "Ainda não. O trilho em USD só será oferecido depois de habilitação específica. Hoje as operações são em BRL e cada contrato usa moeda única.",
  ],
  [
    "A LOI me obriga a comprar?",
    "Não. A LOI não vincula a compra, salvo cláusulas expressamente vinculantes (como confidencialidade e no-shop). Não há multa por mera desistência antes do APA.",
  ],
  [
    "Vocês representam o comprador ou o vendedor juridicamente?",
    "Não. A plataforma oferece coordenação, curadoria e templates — não representação jurídica. Cada parte pode e deve contar com seu próprio assessor.",
  ],
];

export function Faq() {
  return (
    <div className="faq">
      {FAQ_ITEMS.map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <span className="icon-btn" aria-hidden><Plus size={16} /></span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}

/** "Como funciona": o bloco aparece em fade e cada etapa cai uma por uma ao rolar até ele. */
export function HowItWorks() {
  const seller = [
    ["Submeta o negócio", "Métricas, titularidade e transferibilidade. Conecte Stripe/Asaas ou envie documentos."],
    ["Curadoria e score", "Filtros eliminatórios + scorecard. Você recebe nota, justificativa e pedidos de correção."],
    ["Publicação e LOIs", "Só compradores verificados com NDA acessam o Data Room e enviam LOI."],
    ["Escrow e transferência", "Handover acompanhado após saldo bloqueado; payout com dupla aprovação."],
  ];
  const buyer = [
    ["Verifique-se", "Identidade, beneficiário final e prova de fundos (até 30 dias para enviar LOI)."],
    ["Explore e assine NDA", "Data Room por anúncio, com acesso registrado e revogável."],
    ["Envie a LOI", "Preço, condições e no-shop. Não vincula a compra antes do APA."],
    ["Deposite e inspecione", "Depósito no escrow do parceiro, entrega completa e inspeção antes da liberação."],
  ];
  return (
    <Reveal className="bento g-2 reveal" threshold={0.2}>
      <div className="card card--green">
        <div className="card-head">
          <div>
            <div className="card-label">Para vendedores</div>
            <div className="card-sub">Fundadores de negócios digitais brasileiros</div>
          </div>
          <Users size={22} />
        </div>
        <ol className="list-plain mt-16" style={{ color: "#fff" }}>
          {seller.map(([t, d], n) => (
            <li key={t} className="drop" style={{ borderColor: "rgba(255,255,255,.2)", ...i(n * 2) }}>
              <span className="mid-num" style={{ width: 34, flex: "none", opacity: 0.6 }}>0{n + 1}</span>
              <span><b>{t}</b><br /><span style={{ opacity: 0.85 }}>{d}</span></span>
            </li>
          ))}
        </ol>
      </div>
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-label">Para compradores</div>
            <div className="card-sub">Brasileiros e estrangeiros (operações em BRL)</div>
          </div>
          <Lock size={22} />
        </div>
        <ol className="list-plain mt-16">
          {buyer.map(([t, d], n) => (
            <li key={t} className="drop" style={i(n * 2 + 1)}>
              <span className="mid-num muted-2" style={{ width: 34, flex: "none" }}>0{n + 1}</span>
              <span><b>{t}</b><br /><span className="muted">{d}</span></span>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}

export function DocsStrip() {
  return (
    <div className="row wrap" style={{ gap: 8 }}>
      {["NDA versionado", "LOI", "APA com snapshot", "Plano de unwind", "Checklist de handover"].map((d) => (
        <span className="badge badge-outline" key={d}><FileSignature size={12} /> {d}</span>
      ))}
    </div>
  );
}
