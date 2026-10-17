import Logo from "./Logo";
import { business, whatsappLink } from "@/lib/content";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Logo className="logo--footer" />
          <p>Construction and renovation for homes and offices. All works and facilities under one roof.</p>
        </div>
        <ul className="footer__contacts">
          <li>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="footer__icon footer__icon--whatsapp" />
              <span>
                <strong>{business.phoneDisplay}</strong>
                <small>WhatsApp and calls</small>
              </span>
            </a>
          </li>
          <li>
            <a href={business.secondPhoneHref}>
              <PhoneIcon className="footer__icon" />
              <span>
                <strong>{business.secondPhoneDisplay}</strong>
                <small>Calls only, no WhatsApp</small>
              </span>
            </a>
          </li>
          <li>
            <a href={business.landlineHref}>
              <PhoneIcon className="footer__icon" />
              <span>
                <strong>{business.landlineDisplay}</strong>
                <small>Landline</small>
              </span>
            </a>
          </li>
          <li>
            <a href={`mailto:${business.email}`}>
              <MailIcon className="footer__icon" />
              <span>
                <strong>{business.email}</strong>
                <small>Email</small>
              </span>
            </a>
          </li>
        </ul>
      </div>
      <p className="footer__legal">
        © {new Date().getFullYear()} {business.name}
      </p>
    </footer>
  );
}
