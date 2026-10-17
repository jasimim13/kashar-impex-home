import Logo from "./Logo";
import { business, whatsappLink } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Logo />
          <p>Construction and renovation for homes and offices. All works and facilities under one roof.</p>
        </div>
        <div className="footer__links">
          <a href={business.phoneHref}>{business.phoneDisplay}</a>
          <a href={business.secondPhoneHref}>{business.secondPhoneDisplay}</a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href={`mailto:${business.email}`}>{business.email}</a>
        </div>
      </div>
      <p className="footer__legal">
        © {new Date().getFullYear()} {business.name}
      </p>
    </footer>
  );
}
