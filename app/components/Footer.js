import Link from "next/link";
import Logo from "./Logo";
import Icon from "./Icon";

export default function Footer({ settings }) {
  return (
    <footer className="site-footer">
      <div className="footer-giant" aria-hidden="true">AKINA</div>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo size="lg" />
          <p>Equipa de Drift e Oficina especializada.<br />Cars • Drift • Fun • Friends.</p>
          <div className="footer-social">
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram" /></a>
            <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Icon name="youtube" /></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Drift</h4>
          <Link href="/drift#equipa">Equipa</Link>
          <Link href="/drift#calendario">Calendário</Link>
          <Link href="/drift#galeria">Galeria</Link>
          <Link href="/noticias">Notícias</Link>
        </div>
        <div className="footer-col">
          <h4>Oficina</h4>
          <Link href="/oficina#servicos">Serviços</Link>
          <Link href="/oficina#marcar">Marcar serviço</Link>
          <Link href="/loja?s=pecas">Peças</Link>
          <Link href="/loja?s=merch">Merch</Link>
        </div>
        <div className="footer-col footer-contact">
          <h4>Contactos</h4>
          <a href={`tel:${settings.phone.replace(/\s/g, "")}`}><Icon name="phone" size={16} />{settings.phone}</a>
          <a href={`mailto:${settings.email}`}><Icon name="mail" size={16} />{settings.email}</a>
          <span><Icon name="pin" size={16} />{settings.address}</span>
          <span><Icon name="clock" size={16} />{settings.hours}</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Akina Motorsport</span>
        <span className="jp" aria-hidden="true">秋名 · アキナ・モータースポーツ</span>
        <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer">Livro de Reclamações</a>
      </div>
    </footer>
  );
}
