import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="card empty">
          <div className="hero-num">404</div>
          <p className="muted mt-8">Página ou anúncio não encontrado.</p>
          <Link href="/marketplace" className="btn btn-primary mt-24">Ver negócios à venda</Link>
        </div>
      </div>
    </section>
  );
}
