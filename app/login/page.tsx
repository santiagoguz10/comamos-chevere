"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Error");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto card p-6 space-y-4">
      <h1 className="text-2xl font-bold">{mode === "login" ? "Ingresar" : "Crear cuenta"}</h1>
      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <input className="input" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Procesando..." : mode === "login" ? "Ingresar" : "Registrarse"}
        </button>
      </form>
      <button className="text-sm text-brand-600" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "No tengo cuenta, registrarme" : "Ya tengo cuenta, ingresar"}
      </button>
      <p className="text-xs text-stone-500">Demo admin: admin@comamoschevere.local / admin123</p>
    </div>
  );
}