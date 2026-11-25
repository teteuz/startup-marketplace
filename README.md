# Marketplace — protótipo de UI/UX

Interface do marketplace gerenciado de ativos digitais descrito no **Plano Piloto v3.0**.
Só front-end: **sem backend**, sem banco, sem integrações. Todos os dados são fictícios e ficam em [lib/data.ts](lib/data.ts).

Stack: Next.js 15 (App Router) + TypeScript + CSS puro ([app/globals.css](app/globals.css)) + ícones `lucide-react`.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
```

O projeto é exportado como site estático (`output: "export"`). Cada push na branch `main` publica no GitHub Pages pelo workflow [.github/workflows/pages.yml](.github/workflows/pages.yml).

> Não rode `npm run build` com o `npm run dev` aberto: os dois usam a pasta `.next` e o servidor de desenvolvimento quebra com erro 500. Se acontecer, pare o dev, apague `.next` e rode de novo.

## Telas

| Rota | O que mostra |
|---|---|
| `/` | Landing: proposta de valor, anúncios em destaque, como funciona, mecanismos de confiança, trilhos Fast/Standard, comissão, newsletter |
| `/marketplace` | Busca com filtros (categoria, trilho, preço, MRR mínimo, verificação, selo desatualizado) e ordenação |
| `/anuncio/[id]` | Detalhe: métricas, receita de 12 meses, verificação (fonte/período/cobertura/limitações), scorecard, riscos, Data Room bloqueado, fluxo PoF → NDA → LOI |
| `/vender` | Critérios de curadoria, simulador de comissão marginal e wizard de submissão com filtros eliminatórios |
| `/precos` | Planos de comprador (Free, Pro, Pro Fundador, Institutional) e simulador do fluxo P + B + E |
| `/painel` | Comprador: deal em inspeção, escrow, PoF, Data Rooms, dupla aprovação, handover, trilha de auditoria, pacote da transação · Vendedor (`?v=vendedor`): métricas do anúncio, LOIs recebidas (aceitar/recusar), pendências |
| `/entrar` | Login / cadastro com MFA (qualquer código de 6 dígitos funciona) |
| `/como-funciona` | Jornada completa, estados do deal, confiança, trilhos e FAQ |

## Regras do plano refletidas na interface

- Comissão do vendedor por faixas marginais (10% / 8% / 6%, piso de R$ 2.500) e oferta inaugural de 50% — [lib/fees.ts](lib/fees.ts)
- Taxa do comprador por plano; o comprador deposita P + B + E, o vendedor recebe P − S e a plataforma recebe S + B
- Envelope de preço de R$ 25 mil a R$ 5 mi; USD aparece como “em breve” (feature flag desligada)
- Selo desatualizado depois de 48 h sem sincronização bloqueia novas LOIs (ex.: *Painel Imob*)
- LOI exige identidade, prova de fundos que cubra P + B + E e NDA; seller financing e earn-out ficam desabilitados (Fase 2)
- Linguagem sem “garantido”, “100% seguro” ou “auditado”; o Fast é apresentado como **meta operacional**
- Payout com Ops + segundo aprovador; silêncio do comprador não libera nada automaticamente

> Nome “Marketplace” é provisório (seção 3 do plano: a marca ainda não foi decidida).
