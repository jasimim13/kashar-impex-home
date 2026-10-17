import { business, directionsUrl, mapEmbedUrl, office } from "@/lib/content";
import { DirectionsIcon, PhoneIcon, PinIcon } from "./Icons";

export default function Location() {
  const hasAddress = office.address.trim() !== "";

  return (
    <section id="location" className="section location" aria-labelledby="location-title">
      <div className="section__head">
        <h2 id="location-title" className="title">
          Where to find us.
        </h2>
        <p className="section__lede">
          Visit our office to talk through your project in person. Call before you come so the right person is
          there to meet you.
        </p>
      </div>

      <div className="location__grid">
        <div className="location__card">
          <div className="location__address">
            <PinIcon className="contact__icon" />
            <div>
              <strong>Office</strong>
              <p>{hasAddress ? office.address : "Address coming soon."}</p>
            </div>
          </div>
          <div className="location__actions">
            {hasAddress && (
              <a className="btn btn--primary" href={directionsUrl()} target="_blank" rel="noopener noreferrer">
                <DirectionsIcon className="btn__icon" />
                Get directions
              </a>
            )}
            <a className="btn btn--secondary" href={business.phoneHref}>
              <PhoneIcon className="btn__icon" />
              {business.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="location__map">
          {hasAddress ? (
            <iframe
              src={mapEmbedUrl()}
              title={`Map showing ${business.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="location__placeholder">
              <span className="location__pin" aria-hidden="true">
                <PinIcon />
              </span>
              <p>The map will appear here once the address is added.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
