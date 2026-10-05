import Link from "next/link";
import Logo from "../../components/Logo";
import LoginForm from "./LoginForm";

export const metadata = { title: "Entrar — Painel Akina Motorsport" };

export default function AdminLoginPage() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <Link href="/"><Logo size="lg" /></Link>
        <h1>Pit <em style={{ color: "var(--red)", fontStyle: "normal" }}>lane</em></h1>
        <LoginForm />
      </div>
    </div>
  );
}
