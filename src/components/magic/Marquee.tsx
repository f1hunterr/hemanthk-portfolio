// Adapted from Magic UI's Marquee (MIT, https://magicui.design) as plain CSS: no JavaScript runs.
// The list is rendered twice so the loop is seamless; the copy is hidden from screen readers.
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const list = (hidden: boolean) => (
    <ul className="marquee-list" aria-hidden={hidden ? "true" : undefined}>
      {items.map((item) => (
        <li key={item} className="mono-label">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <section className="marquee" aria-label={label}>
      <div className="marquee-track" data-marquee-track>
        {list(false)}
        {list(true)}
      </div>
    </section>
  );
}
