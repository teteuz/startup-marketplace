"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/marketplace", label: "Comprar" },
  { href: "/vender", label: "Vender" },
  { href: "/precos", label: "Preços" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/painel", label: "Painel" },
];

/** Ícone vazado, traço grosso — conta / entrar */
function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4.2" />
      <path d="M4 20.5c1.4-3.7 4.4-5.7 8-5.7s6.6 2 8 5.7" />
    </svg>
  );
}

/** Ícone vazado, traço grosso — loja / vender meu negócio */
function StoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 9.5 5 4h14l1.5 5.5" />
      <path d="M3.5 9.5a2.8 2.8 0 0 0 5.67 0 2.8 2.8 0 0 0 5.66 0 2.8 2.8 0 0 0 5.67 0" />
      <path d="M5 12.5V20h14v-7.5" />
      <path d="M10 20v-4.5h4V20" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Marketplace — início">
      <span className="logo-mark" aria-hidden>
        <i /><i /><i /><i />
      </span>
      Marketplace
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <nav className="nav">
          <Logo />
          <div className="nav-links">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={pathname.startsWith(l.href) ? "active" : ""}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="row" style={{ gap: 6 }}>
            <Link href="/entrar" className="nav-icon" aria-label="Entrar" title="Entrar">
              <UserIcon />
            </Link>
            <Link href="/vender" className="nav-icon primary" aria-label="Vender meu negócio" title="Vender meu negócio">
              <StoreIcon />
            </Link>
            <button className="icon-btn nav-burger" aria-label="Abrir menu" onClick={() => setOpen((o) => !o)}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
        <div className={`mobile-menu ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
