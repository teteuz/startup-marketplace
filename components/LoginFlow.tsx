"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";

export default function LoginFlow() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [step, setStep] = useState<"form" | "mfa">("form");
  const [role, setRole] = useState<"comprar" | "vender" | "ambos">("comprar");
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = d;
    setCode(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
    if (next.every((c) => c)) setTimeout(() => router.push(role === "vender" ? "/painel?v=vendedor" : "/painel"), 350);
  };

  if (step === "mfa") {
    return (
      <div className="card" style={{ padding: 32 }}>
        <button className="btn-link small muted" onClick={() => setStep("form")}><ArrowLeft size={14} /> Voltar</button>
        <span className="req-ico ok mt-24" style={{ width: 52, height: 52 }}><KeyRound size={22} /></span>
        <h1 className="h2 mt-16">Verificação em duas etapas</h1>
        <p className="muted mt-8">Digite o código de 6 dígitos do seu app autenticador{email ? ` para ${email}` : ""}.</p>
        <div className="otp mt-32" style={{ justifyContent: "flex-start" }}>
          {code.map((c, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              inputMode="numeric"
              maxLength={1}
              value={c}
              aria-label={`Dígito ${i + 1}`}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus(); }}
            />
          ))}
        </div>
        <p className="tiny muted mt-24">Protótipo: qualquer código de 6 dígitos funciona.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 32 }}>
      <div className="segmented">
        <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Entrar</button>
        <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Criar conta</button>
      </div>
      <h1 className="h2 mt-24">{mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}</h1>
      <p className="muted mt-8">
        {mode === "login" ? "Acesse seu painel de compras e vendas." : "Cadastro gratuito. Verificação de identidade só quando for necessária."}
      </p>

      <form
        className="mt-24"
        style={{ display: "grid", gap: 16 }}
        onSubmit={(e) => {
          e.preventDefault();
          setStep("mfa");
        }}
      >
        {mode === "signup" && (
          <>
            <div className="field">
              <label className="label">Eu quero</label>
              <div className="chips">
                {(["comprar", "vender", "ambos"] as const).map((r) => (
                  <button type="button" key={r} className={`chip ${role === r ? "active" : ""}`} onClick={() => setRole(r)}>
                    {r === "comprar" ? "Comprar" : r === "vender" ? "Vender" : "Ambos"}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="label">Nome</label>
              <input className="input" required placeholder="Seu nome" />
            </div>
          </>
        )}
        <div className="field">
          <label className="label">E-mail</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" />
        </div>
        <div className="field">
          <div className="row-between">
            <label className="label">Senha</label>
            {mode === "login" && <a className="tiny muted" href="#">Esqueci a senha</a>}
          </div>
          <input className="input" type="password" required placeholder="••••••••" minLength={mode === "signup" ? 10 : 1} />
          {mode === "signup" && <span className="hint">Mínimo de 10 caracteres.</span>}
        </div>
        {mode === "signup" && (
          <label className="check">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            <span className="small">
              Li os Termos de Uso e a Política de Privacidade. Entendo para quais finalidades meus dados são tratados.
            </span>
          </label>
        )}
        <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={mode === "signup" && !terms}>
          {mode === "login" ? "Entrar" : "Criar conta"}
        </button>
        <div className="row small muted" style={{ gap: 8, justifyContent: "center" }}>
          <ShieldCheck size={14} /> MFA obrigatório para equipe e partes verificadas
        </div>
      </form>
    </div>
  );
}
