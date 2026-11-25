/**
 * Dados FICTÍCIOS para o protótipo de interface.
 * Nenhum anúncio, empresa, pessoa ou valor abaixo é real.
 */

export type Category =
  | "Micro-SaaS B2B"
  | "Ferramenta digital"
  | "App"
  | "Newsletter"
  | "Conteúdo"
  | "Infoproduto recorrente";

export type Track = "Fast" | "Standard";

export type Verification = {
  method: "integracao" | "documental";
  source: string;
  period: string;
  coverage: string;
  lastSyncHours: number;
  limitations: string;
};

export type Listing = {
  id: string;
  name: string;
  category: Category;
  tagline: string;
  description: string;
  askingPrice: number;
  mrr: number;
  sdeMonthly: number; // SDE normalizado, média dos últimos 3 meses fechados
  churn: number | null; // % mensal
  customers: number;
  ageMonths: number;
  uf: string;
  track: Track;
  verification: Verification;
  score: number[]; // receita, margem, retenção, tendência, dependência, concentração, técnica, preço
  stack: string[];
  assets: string[];
  operation: string;
  risks: string[];
  ndaCount: number;
  hasActiveLoi: boolean;
  publishedDaysAgo: number;
  series: number[]; // receita mensal, 12 meses
  color: "green" | "orange" | "blue" | "ink" | "lime" | "violet";
};

export const SCORE_CRITERIA: Array<{ key: string; label: string; weight: number }> = [
  { key: "receita", label: "Receita", weight: 25 },
  { key: "margem", label: "Margem", weight: 15 },
  { key: "retencao", label: "Retenção", weight: 15 },
  { key: "tendencia", label: "Tendência", weight: 10 },
  { key: "dependencia", label: "Dependência", weight: 10 },
  { key: "concentracao", label: "Concentração", weight: 10 },
  { key: "tecnica", label: "Técnica", weight: 10 },
  { key: "preco", label: "Preço", weight: 5 },
];

export const CATEGORIES: Category[] = [
  "Micro-SaaS B2B",
  "Ferramenta digital",
  "App",
  "Newsletter",
  "Conteúdo",
  "Infoproduto recorrente",
];

function series(end: number, growth: number, wobble: number[]): number[] {
  const out: number[] = [];
  for (let i = 11; i >= 0; i--) {
    const base = end / Math.pow(1 + growth, i);
    const w = wobble[i % wobble.length];
    out.push(Math.round(base * (1 + w)));
  }
  out[11] = end;
  return out;
}

const W1 = [0, 0.03, -0.02, 0.01, -0.03, 0.02];
const W2 = [0.02, -0.01, 0.03, -0.02, 0, 0.01];

export const LISTINGS: Listing[] = [
  {
    id: "agendai",
    name: "Agendaí",
    category: "Micro-SaaS B2B",
    tagline: "Agenda online e lembretes por WhatsApp para clínicas de estética.",
    description:
      "SaaS de agendamento com confirmação automática por WhatsApp, prontuário simples e cobrança de sinal. Clientes são clínicas de pequeno porte, com plano mensal e anual. Aquisição majoritariamente orgânica (SEO + indicação).",
    askingPrice: 420_000,
    mrr: 14_200,
    sdeMonthly: 9_800,
    churn: 2.4,
    customers: 212,
    ageMonths: 31,
    uf: "SP",
    track: "Fast",
    verification: {
      method: "integracao",
      source: "Stripe",
      period: "nov/2025 – out/2026",
      coverage: "100% da receita de assinaturas",
      lastSyncHours: 3,
      limitations: "Despesas e PI comprovadas por documento; a API não comprova ausência de passivos.",
    },
    score: [21, 12, 12, 8, 8, 9, 8, 4],
    stack: ["Next.js", "Node.js", "Postgres", "Vercel", "Z-API"],
    assets: ["Código-fonte e repositório", "Domínio agendai.app (fictício)", "Conta Stripe (migração assistida)", "Base de conhecimento e templates", "Marca e redes sociais"],
    operation: "1 fundador, ~12 h/semana. Sem empregados transferidos.",
    risks: ["Dependência da API não oficial de WhatsApp", "18% da receita em planos anuais (normalizados no MRR)"],
    ndaCount: 7,
    hasActiveLoi: false,
    publishedDaysAgo: 4,
    series: series(14_200, 0.035, W1),
    color: "green",
  },
  {
    id: "notafacil",
    name: "NotaFácil",
    category: "Micro-SaaS B2B",
    tagline: "Emissão automática de NFS-e para MEIs e prestadores de serviço.",
    description:
      "Ferramenta de emissão de notas fiscais de serviço integrada a mais de 300 prefeituras via parceiro. Plano por volume de notas. Base pulverizada, sem cliente acima de 2% da receita.",
    askingPrice: 1_250_000,
    mrr: 31_500,
    sdeMonthly: 19_400,
    churn: 1.9,
    customers: 1_480,
    ageMonths: 44,
    uf: "MG",
    track: "Standard",
    verification: {
      method: "integracao",
      source: "Asaas",
      period: "nov/2025 – out/2026",
      coverage: "100% da receita recorrente",
      lastSyncHours: 9,
      limitations: "Custos do parceiro de emissão verificados documentalmente.",
    },
    score: [23, 12, 13, 8, 6, 10, 8, 3],
    stack: ["Laravel", "MySQL", "AWS", "Fila Redis"],
    assets: ["Código-fonte", "Domínio e marca", "Contrato com parceiro de emissão (cessão sujeita a aceite)", "Documentação técnica"],
    operation: "2 sócios, ~20 h/semana somadas. Suporte terceirizado (contrato não transferido).",
    risks: ["Dependência de parceiro de emissão de notas", "Cessão do contrato do parceiro sujeita a aceite"],
    ndaCount: 11,
    hasActiveLoi: true,
    publishedDaysAgo: 12,
    series: series(31_500, 0.022, W2),
    color: "blue",
  },
  {
    id: "cobrify",
    name: "Cobrify",
    category: "Micro-SaaS B2B",
    tagline: "Régua de cobrança automática para pequenas empresas.",
    description:
      "Automatiza lembretes de vencimento por e-mail e WhatsApp, com link de pagamento. Clientes são escritórios de contabilidade e pequenas escolas.",
    askingPrice: 260_000,
    mrr: 8_900,
    sdeMonthly: 6_100,
    churn: 2.9,
    customers: 164,
    ageMonths: 22,
    uf: "PR",
    track: "Fast",
    verification: {
      method: "integracao",
      source: "Asaas",
      period: "nov/2025 – out/2026",
      coverage: "100% da receita de assinaturas",
      lastSyncHours: 5,
      limitations: "Reembolsos e chargebacks conciliados; despesas por documento.",
    },
    score: [18, 12, 11, 9, 8, 8, 8, 4],
    stack: ["Rails", "Postgres", "Render"],
    assets: ["Código-fonte", "Domínio", "Templates de régua", "Conta de e-mail transacional"],
    operation: "1 fundador, ~8 h/semana.",
    risks: ["Crescimento recente concentrado em um canal de parceria"],
    ndaCount: 5,
    hasActiveLoi: true,
    publishedDaysAgo: 19,
    series: series(8_900, 0.045, W1),
    color: "orange",
  },
  {
    id: "pontocerto",
    name: "PontoCerto",
    category: "Micro-SaaS B2B",
    tagline: "Controle de ponto por geolocalização para equipes de até 30 pessoas.",
    description:
      "App web e PWA de registro de ponto com relatórios para fechamento de folha. Público: comércio local e prestadores de serviço.",
    askingPrice: 145_000,
    mrr: 5_600,
    sdeMonthly: 3_900,
    churn: 3.1,
    customers: 241,
    ageMonths: 18,
    uf: "SC",
    track: "Fast",
    verification: {
      method: "integracao",
      source: "Stripe",
      period: "mai/2025 – out/2026",
      coverage: "100% da receita",
      lastSyncHours: 2,
      limitations: "Histórico de 18 meses; sazonalidade de fim de ano não isolada.",
    },
    score: [16, 11, 10, 7, 8, 9, 7, 4],
    stack: ["Vue", "Firebase", "Cloud Functions"],
    assets: ["Código-fonte", "Projeto Firebase", "Domínio", "Marca"],
    operation: "1 fundador, ~6 h/semana.",
    risks: ["Infra em conta pessoal — migração de projeto necessária"],
    ndaCount: 3,
    hasActiveLoi: false,
    publishedDaysAgo: 2,
    series: series(5_600, 0.03, W2),
    color: "lime",
  },
  {
    id: "painel-imob",
    name: "Painel Imob",
    category: "Micro-SaaS B2B",
    tagline: "CRM simples para corretores de imóveis autônomos.",
    description:
      "Funil de leads, agenda de visitas e integração com portais imobiliários. Planos individual e equipe.",
    askingPrice: 780_000,
    mrr: 22_800,
    sdeMonthly: 13_500,
    churn: 2.2,
    customers: 690,
    ageMonths: 39,
    uf: "RJ",
    track: "Standard",
    verification: {
      method: "integracao",
      source: "Stripe",
      period: "nov/2025 – out/2026",
      coverage: "100% da receita",
      lastSyncHours: 51,
      limitations: "Sincronização atrasada — selo desatualizado até revisão.",
    },
    score: [22, 11, 12, 7, 7, 9, 8, 3],
    stack: ["React", "Django", "Postgres", "GCP"],
    assets: ["Código-fonte", "Domínio", "Integrações com portais (sujeitas a termos de terceiros)", "Marca"],
    operation: "1 fundador + 1 freelancer (não transferido).",
    risks: ["Integrações dependem de termos de portais de terceiros"],
    ndaCount: 9,
    hasActiveLoi: false,
    publishedDaysAgo: 25,
    series: series(22_800, 0.018, W1),
    color: "ink",
  },
  {
    id: "dev-semanal",
    name: "Dev Semanal",
    category: "Newsletter",
    tagline: "Newsletter semanal para devs brasileiros, com assinatura paga e patrocínios.",
    description:
      "Curadoria semanal de conteúdo técnico em PT-BR. Receita de assinaturas premium e patrocínios recorrentes. Avaliada pela rubrica de estabilidade de audiência.",
    askingPrice: 120_000,
    mrr: 6_200,
    sdeMonthly: 5_100,
    churn: null,
    customers: 18_400,
    ageMonths: 27,
    uf: "RS",
    track: "Standard",
    verification: {
      method: "documental",
      source: "Extratos + plataforma de envio",
      period: "mai/2026 – out/2026",
      coverage: "Assinaturas e 6 contratos de patrocínio",
      lastSyncHours: 0,
      limitations: "Verificação documental; sem conector. Lista de e-mails não compartilhada antes do fechamento.",
    },
    score: [15, 13, 10, 6, 5, 7, 6, 4],
    stack: ["Plataforma de newsletter", "Notion"],
    assets: ["Marca e domínio", "Arquivo de edições", "Contratos de patrocínio (cessão sujeita a aceite)"],
    operation: "1 autor, ~5 h/semana.",
    risks: ["Dependência do autor como voz da marca", "Transferência da lista depende de base legal (LGPD)"],
    ndaCount: 4,
    hasActiveLoi: false,
    publishedDaysAgo: 8,
    series: series(6_200, 0.02, W2),
    color: "violet",
  },
  {
    id: "fitplan",
    name: "FitPlan",
    category: "App",
    tagline: "App de treinos em casa com assinatura mensal.",
    description:
      "App iOS e Android com planos de treino e acompanhamento. Receita via assinaturas nas lojas de apps.",
    askingPrice: 310_000,
    mrr: 11_400,
    sdeMonthly: 6_800,
    churn: 6.5,
    customers: 2_950,
    ageMonths: 20,
    uf: "BA",
    track: "Standard",
    verification: {
      method: "documental",
      source: "Relatórios App Store / Google Play",
      period: "nov/2025 – out/2026",
      coverage: "100% das assinaturas nas lojas",
      lastSyncHours: 0,
      limitations: "Transferência de app entre contas de loja depende das regras de cada loja.",
    },
    score: [17, 11, 7, 7, 7, 8, 7, 4],
    stack: ["Flutter", "Supabase", "RevenueCat"],
    assets: ["Apps nas lojas (transferência de conta)", "Código-fonte", "Conteúdo dos treinos", "Marca"],
    operation: "1 fundador, ~10 h/semana.",
    risks: ["Churn elevado típico de apps de consumo", "Transferência entre contas de loja"],
    ndaCount: 6,
    hasActiveLoi: false,
    publishedDaysAgo: 15,
    series: series(11_400, 0.028, W1),
    color: "orange",
  },
  {
    id: "linkbio-pro",
    name: "LinkBio Pro",
    category: "Ferramenta digital",
    tagline: "Página de links e catálogo para lojistas de Instagram.",
    description:
      "Ferramenta self-service com plano gratuito e pago. Converte via catálogo simples com botão de WhatsApp.",
    askingPrice: 68_000,
    mrr: 3_100,
    sdeMonthly: 2_400,
    churn: 4.1,
    customers: 520,
    ageMonths: 14,
    uf: "PE",
    track: "Fast",
    verification: {
      method: "integracao",
      source: "Stripe",
      period: "set/2025 – out/2026",
      coverage: "100% da receita",
      lastSyncHours: 7,
      limitations: "Histórico de 14 meses; anualização com faixa de incerteza.",
    },
    score: [13, 12, 9, 8, 8, 9, 7, 5],
    stack: ["SvelteKit", "Supabase", "Vercel"],
    assets: ["Código-fonte", "Domínio", "Marca"],
    operation: "1 fundador, ~4 h/semana.",
    risks: ["Mercado com muitos concorrentes gratuitos"],
    ndaCount: 2,
    hasActiveLoi: false,
    publishedDaysAgo: 1,
    series: series(3_100, 0.05, W2),
    color: "green",
  },
  {
    id: "contrato-ja",
    name: "Contrato Já",
    category: "Micro-SaaS B2B",
    tagline: "Gerador de contratos e propostas para freelancers.",
    description:
      "Modelos revisados, assinatura eletrônica via parceiro e cobrança integrada. Plano mensal único.",
    askingPrice: 95_000,
    mrr: 4_300,
    sdeMonthly: 3_200,
    churn: 3.4,
    customers: 310,
    ageMonths: 16,
    uf: "DF",
    track: "Standard",
    verification: {
      method: "documental",
      source: "Extratos + relatórios do gateway",
      period: "jul/2025 – out/2026",
      coverage: "100% da receita declarada",
      lastSyncHours: 0,
      limitations: "Conector em homologação; verificação documental enquanto isso.",
    },
    score: [14, 12, 10, 7, 8, 9, 7, 4],
    stack: ["Next.js", "Prisma", "Postgres"],
    assets: ["Código-fonte", "Biblioteca de modelos", "Domínio", "Marca"],
    operation: "1 fundador, ~5 h/semana.",
    risks: ["Modelos jurídicos precisam de revisão periódica"],
    ndaCount: 3,
    hasActiveLoi: false,
    publishedDaysAgo: 10,
    series: series(4_300, 0.03, W1),
    color: "blue",
  },
  {
    id: "planilha-pro",
    name: "Planilha Pro Club",
    category: "Infoproduto recorrente",
    tagline: "Clube de assinatura de planilhas e aulas de Excel para PMEs.",
    description:
      "Biblioteca de planilhas prontas, aulas mensais e comunidade. Avaliado pela rubrica de recorrência de audiência.",
    askingPrice: 180_000,
    mrr: 9_700,
    sdeMonthly: 7_900,
    churn: 5.2,
    customers: 1_120,
    ageMonths: 29,
    uf: "GO",
    track: "Standard",
    verification: {
      method: "documental",
      source: "Relatórios da plataforma de cursos",
      period: "nov/2025 – out/2026",
      coverage: "100% das assinaturas",
      lastSyncHours: 0,
      limitations: "Direitos de imagem do instrutor tratados em contrato específico.",
    },
    score: [16, 13, 8, 6, 5, 9, 6, 4],
    stack: ["Plataforma de cursos", "Comunidade (Discord)"],
    assets: ["Biblioteca de planilhas", "Aulas gravadas (direitos cedidos)", "Marca e domínio"],
    operation: "1 instrutor, ~8 h/semana.",
    risks: ["Dependência do instrutor nas aulas ao vivo"],
    ndaCount: 5,
    hasActiveLoi: false,
    publishedDaysAgo: 6,
    series: series(9_700, 0.015, W2),
    color: "lime",
  },
];

export const scoreTotal = (l: Listing) => l.score.reduce((a, b) => a + b, 0);
export const ttmRevenue = (l: Listing) => l.series.reduce((a, b) => a + b, 0);
export const sdeAnnual = (l: Listing) => l.sdeMonthly * 12;
export const multiple = (l: Listing) => l.askingPrice / sdeAnnual(l);
export const isStale =(l: Listing) => l.verification.method === "integracao" && l.verification.lastSyncHours > 48;
export const getListing = (id: string) => LISTINGS.find((l) => l.id === id);

/* ---------- Painel (deal fictício em andamento) ---------- */

export type DealState =
  | "LOI_ACCEPTED"
  | "APA_SIGNED"
  | "AWAITING_FUNDS"
  | "FUNDS_CONFIRMED_LOCKED"
  | "HANDOVER"
  | "INSPECTION"
  | "RELEASE_AUTHORIZED"
  | "RELEASED"
  | "SETTLED";

export const DEAL_STEPS: Array<{ state: DealState; label: string; day: string; hint: string }> = [
  { state: "LOI_ACCEPTED", label: "LOI aceita", day: "D0", hint: "No-shop de 10 dias úteis (Fast)" },
  { state: "APA_SIGNED", label: "APA assinado", day: "D1", hint: "Snapshot imutável das métricas anexado" },
  { state: "AWAITING_FUNDS", label: "Aguardando fundos", day: "D1–D2", hint: "Depósito P + B + E no escrow do parceiro" },
  { state: "FUNDS_CONFIRMED_LOCKED", label: "Saldo bloqueado", day: "D2", hint: "Confirmado por consulta ao parceiro" },
  { state: "HANDOVER", label: "Handover", day: "até D4", hint: "Só começa com saldo confirmado e bloqueado" },
  { state: "INSPECTION", label: "Inspeção", day: "3 dias úteis", hint: "Inicia com evidências de todos os itens críticos" },
  { state: "RELEASE_AUTHORIZED", label: "Liberação autorizada", day: "D7", hint: "Ops + segundo aprovador" },
  { state: "SETTLED", label: "Crédito confirmado", day: "D7*", hint: "Marco do KPI: crédito efetivo" },
];

export const ACTIVE_DEAL = {
  listingId: "cobrify",
  code: "DL-0042",
  state: "INSPECTION" as DealState,
  price: 260_000,
  buyerPlan: "free" as const,
  externalCosts: 0,
  inspectionEndsIn: "2 dias úteis",
  handover: [
    { label: "Repositório transferido para a organização do comprador", done: true },
    { label: "Domínio transferido e DNS sob controle do comprador", done: true },
    { label: "Infraestrutura (Render) transferida", done: true },
    { label: "Billing / conta de pagamentos migrada", done: true },
    { label: "Todas as credenciais rotacionadas", done: true },
    { label: "Deploy e restauração de backup testados", done: true },
    { label: "Vendedor removido de acessos, recuperação de conta e MFA", done: true },
    { label: "Propriedade intelectual documentada", done: true },
  ],
  inspectionCriteria: [
    { label: "Funcionalidade", status: "ok" },
    { label: "Propriedade", status: "ok" },
    { label: "Acesso", status: "ok" },
    { label: "Receita de referência", status: "pendente" },
    { label: "Dependências", status: "ok" },
  ] as Array<{ label: string; status: "ok" | "pendente" }>,
  events: [
    { when: "Hoje, 09:12", who: "Sistema", what: "Inspeção iniciada após evidências completas e notificação comprovada" },
    { when: "Ontem, 18:40", who: "Ops · Curadoria", what: "Checklist de handover validado (8/8)" },
    { when: "Ontem, 10:05", who: "Vendedor", what: "Credenciais rotacionadas e acessos revogados" },
    { when: "18/11, 15:22", who: "Parceiro de escrow", what: "Saldo confirmado e bloqueado (consulta ao parceiro)" },
    { when: "17/11, 11:00", who: "Comprador + Vendedor", what: "APA assinado — versão v3 com snapshot de métricas" },
    { when: "16/11, 16:30", who: "Vendedor", what: "LOI aceita" },
  ],
};

export const BUYER_ROOMS = [
  { listingId: "agendai", nda: "v3 · assinado 12/11", expires: "em 78 dias" },
];

export const SELLER_LISTING = {
  listingId: "agendai",
  views: 1_284,
  ndas: 7,
  lois: [
    { buyer: "Comprador verificado #A17", price: 395_000, pofBand: "R$ 400–500 mil", pofAge: 6, status: "nova" },
    { buyer: "Comprador verificado #B03", price: 360_000, pofBand: "R$ 350–400 mil", pofAge: 21, status: "nova" },
  ],
};
