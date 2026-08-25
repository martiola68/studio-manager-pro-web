"use client";

import { FormEvent, useState } from "react";

export default function ImpostaPasswordTestPage() {
  const [email, setEmail] = useState("");
  const [codiceFiscale, setCodiceFiscale] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setOk(false);
    try {
      const response = await fetch("/api/abbonamento/test-imposta-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          codice_fiscale: codiceFiscale,
          new_password: password,
          setup_secret: secret,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Operazione non riuscita");
      setOk(true);
      setMessage("Password impostata. Ora puoi usare la pagina Abbonamento con la nuova password.");
      setPassword("");
      setSecret("");
    } catch (err: any) {
      setMessage(err?.message || "Operazione non riuscita");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#071f3d", color: "white", padding: "48px 20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <p style={{ color: "#55c7ff", fontWeight: 800, letterSpacing: 2, fontSize: 12 }}>SOLO TEST TEMPORANEO</p>
        <h1 style={{ fontSize: 42, margin: "12px 0 8px" }}>Imposta password utente test</h1>
        <p style={{ color: "#c5d4e6", lineHeight: 1.6, marginBottom: 28 }}>
          Questa pagina serve esclusivamente per la prova dell’area abbonamento e verrà eliminata al termine del test.
        </p>
        <form onSubmit={submit} style={{ background: "#09294e", border: "1px solid #24527c", borderRadius: 22, padding: 28, display: "grid", gap: 18 }}>
          <label>Email amministratore<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} /></label>
          <label>Codice fiscale studio<input required value={codiceFiscale} onChange={(e) => setCodiceFiscale(e.target.value)} style={inputStyle} /></label>
          <label>Nuova password<input required minLength={10} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} /></label>
          <label>Chiave temporanea Vercel<input required type="password" value={secret} onChange={(e) => setSecret(e.target.value)} style={inputStyle} /></label>
          <button disabled={loading} type="submit" style={{ border: 0, borderRadius: 10, padding: "16px 20px", fontWeight: 800, background: "#1574d1", color: "white", cursor: "pointer" }}>
            {loading ? "Impostazione..." : "Imposta password di test"}
          </button>
          {message && <div style={{ padding: 14, borderRadius: 10, background: ok ? "#123f36" : "#4b2532", color: "white" }}>{message}</div>}
        </form>
      </div>
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box" as const,
  marginTop: 8,
  padding: "14px 15px",
  borderRadius: 9,
  border: "1px solid #456783",
  background: "white",
  color: "#07172c",
  fontSize: 16,
};
