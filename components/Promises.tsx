import { promises } from "@/lib/content";
import { promiseIcons } from "./Icons";

export default function Promises() {
  return (
    <section className="section promises" aria-labelledby="promises-title">
      <h2 id="promises-title" className="title promises__title">
        What you can hold us to.
      </h2>
      <ul className="promises__list">
        {promises.map((p) => {
          const Icon = promiseIcons[p.id];
          return (
            <li key={p.id}>
              <Icon className="promises__icon" />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
