"use client";

import { useState } from "react";
import { Check, Mail } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="row" style={{ gap: 10 }}>
        <span className="req-ico ok"><Check size={16} /></span>
        <span>Pronto! (simulação — nenhum e-mail foi armazenado)</span>
      </div>
    );
  }

  return (
    <form
      className="row wrap"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setSent(true);
      }}
    >
      <div className="input-wrap grow" style={{ minWidth: 220 }}>
        <Mail size={16} className="prefix" style={{ left: 16 }} />
        <input
          className="input"
          style={{ borderRadius: 999, height: 50, color: "var(--ink)" }}
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button className="btn btn-green btn-lg" type="submit">Receber novos negócios</button>
    </form>
  );
}
