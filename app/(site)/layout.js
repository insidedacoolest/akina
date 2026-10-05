import { Big_Shoulders, Chakra_Petch, Inter } from "next/font/google";
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import { CartProvider } from "../components/CartContext";
import { getSettings } from "../lib/settings";

const fontDisplay = Big_Shoulders({ variable: "--font-display", subsets: ["latin"] });
const fontTech = Chakra_Petch({ variable: "--font-tech", weight: ["500", "600", "700"], subsets: ["latin"] });
const fontBody = Inter({ variable: "--font-body", weight: ["400", "500", "600", "700"], subsets: ["latin"] });

export const metadata = {
  title: "Akina Motorsport — Equipa de drift & oficina",
  description: "Akina Motorsport: equipa de drift e oficina de preparação em Portugal. Pilotos, calendário, serviços de oficina, merch e peças.",
};

export default async function SiteLayout({ children }) {
  const settings = await getSettings();
  return (
    <html lang="pt" className={`${fontDisplay.variable} ${fontTech.variable} ${fontBody.variable}`}>
      <body>
        <CartProvider>
          <div className="grain" aria-hidden="true" />
          <a href="#main" className="skip-link">Saltar para o conteúdo</a>
          <Header />
          <main id="main">{children}</main>
          <Footer settings={settings} />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
