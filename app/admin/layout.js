import { Big_Shoulders, Chakra_Petch, Inter } from "next/font/google";
import Link from "next/link";
import "../globals.css";
import "./admin.css";
import { getSession } from "../lib/session";
import { logout } from "../actions/auth";
import { prisma } from "../lib/db";
import AdminNav from "./AdminNav";
import Logo from "../components/Logo";

const fontDisplay = Big_Shoulders({ variable: "--font-display", subsets: ["latin"] });
const fontTech = Chakra_Petch({ variable: "--font-tech", weight: ["500", "600", "700"], subsets: ["latin"] });
const fontBody = Inter({ variable: "--font-body", weight: ["400", "500", "600", "700"], subsets: ["latin"] });

export const metadata = {
  title: "Painel — Akina Motorsport",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await getSession();
  let badges = {};
  if (session?.userId) {
    const [bookings, orders] = await Promise.all([
      prisma.booking.count({ where: { status: "nova" } }),
      prisma.order.count({ where: { status: "pendente" } }),
    ]);
    badges = { bookings, orders };
  }

  return (
    <html lang="pt" className={`${fontDisplay.variable} ${fontTech.variable} ${fontBody.variable}`}>
      <body className="admin-body">
        {!session?.userId ? (
          children
        ) : (
          <div className="admin-shell">
            <aside className="admin-sidebar">
              <Link href="/admin"><Logo size="sm" /></Link>
              <div className="admin-sidebar-sub">Painel de administração</div>
              <AdminNav badges={badges} />
              <div className="admin-sidebar-foot">
                <Link href="/" target="_blank">Ver site ↗</Link>
                <span className="hint" style={{ padding: "0 .7rem" }}>{session.email}</span>
                <form action={logout}><button type="submit">Terminar sessão</button></form>
              </div>
            </aside>
            <div className="admin-main">{children}</div>
          </div>
        )}
      </body>
    </html>
  );
}
