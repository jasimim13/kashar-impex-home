import { serviceGroups } from "@/lib/content";

export default function Services() {
  const count = serviceGroups.reduce((n, g) => n + g.items.length, 0);
  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <div className="services__intro">
        <h2 id="services-title" className="title">
          Every trade on one site, managed by one team.
        </h2>
        <p className="section__lede">
          {count} services under one roof, from the first layout drawing to the last tile. You deal with one
          team instead of hiring and chasing separate contractors.
        </p>
      </div>

      <div className="services__groups">
        {serviceGroups.map((group) => (
          <div key={group.title} className="group">
            <div className="group__head">
              <h3>{group.title}</h3>
              <p>{group.summary}</p>
            </div>
            <ul className="inset-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
