import { business, serviceGroups, siteUrl } from "@/lib/content";

// Business details in the schema.org format Google reads for local results and the knowledge panel.
// Only facts the owner has confirmed go here; no opening hours or map coordinates until they are known.
export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${siteUrl}/#business`,
    name: business.name,
    alternateName: "Kashar Imp",
    slogan: "You have a problem? We have a solution.",
    url: `${siteUrl}/`,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/images/stage-after.jpg`,
    email: business.email,
    telephone: "+92-332-1788788",
    contactPoint: [
      { "@type": "ContactPoint", telephone: "+92-332-1788788", contactType: "customer service", availableLanguage: ["en", "ur"] },
      { "@type": "ContactPoint", telephone: "+92-300-8616788", contactType: "customer service" },
      { "@type": "ContactPoint", telephone: "+92-52-4267888", contactType: "customer service" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop No. 14–15, First Floor, Cantonment Plaza, Jamia Masjid Road",
      addressLocality: "Sialkot Cantt",
      addressRegion: "Punjab",
      postalCode: "51320",
      addressCountry: "PK",
    },
    areaServed: { "@type": "City", name: "Sialkot" },
    knowsAbout: serviceGroups.flatMap((g) => g.items),
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: every value is our own constant text.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
