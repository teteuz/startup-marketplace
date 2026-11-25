import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-card">
          <div className="footer-grid">
            <div>
              <div className="logo" style={{ color: "#fff" }}>
                <span className="logo-mark" aria-hidden style={{ background: "#fff" }}>
                  <i style={{ background: "var(--ink)" }} /><i /><i /><i />
                </span>
                Marketplace
              </div>
              <p className="small mt-16" style={{ maxWidth: 340 }}>
                Marketplace gerenciado de ativos digitais. Curadoria, prova de fundos, escrow com parceiro
                habilitado e transferência acompanhada.
              </p>
              <p className="tiny mt-16" style={{ maxWidth: 380, color: "rgba(255,255,255,.5)" }}>
                Nome de trabalho provisório. Protótipo de interface com dados fictícios: não constitui oferta,
                parecer, recomendação de investimento nem promessa de liquidação.
              </p>
            </div>
            <div>
              <h4>Comprar</h4>
              <Link href="/marketplace">Negócios à venda</Link>
              <Link href="/precos">Planos de comprador</Link>
              <Link href="/entrar">Verificar identidade e fundos</Link>
            </div>
            <div>
              <h4>Vender</h4>
              <Link href="/vender">Listar meu negócio</Link>
              <Link href="/vender#comissao">Comissão</Link>
              <Link href="/vender#criterios">Critérios de curadoria</Link>
            </div>
            <div>
              <h4>Plataforma</h4>
              <Link href="/como-funciona">Como funciona</Link>
              <Link href="/como-funciona#confianca">Segurança e escrow</Link>
              <Link href="/como-funciona#faq">Perguntas frequentes</Link>
            </div>
          </div>
          <div className="row-between wrap mt-32 tiny" style={{ color: "rgba(255,255,255,.45)" }}>
            <span>© 2026 Marketplace (nome provisório)</span>
            <span>Termos · Privacidade (LGPD) · Canal de direitos do titular</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
