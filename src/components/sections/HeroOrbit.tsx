type RingId = 1 | 2 | 3;

// Photo cards on the rotating rings (public/hero, see CREDITS.txt there).
// Each ring holds its cards at fixed angles; the whole ring spins and each card spins back to stay upright.
const RINGS: { ring: RingId; reverse?: boolean; offset: number; photos: number[] }[] = [
  { ring: 1, offset: 30, photos: [1, 2, 3, 4, 5, 6] },
  { ring: 2, reverse: true, offset: 10, photos: [7, 8, 9, 10, 11, 12, 13, 14, 15] },
  // 19 photos, 27 slots: the outer ring reuses some, spaced so repeats never sit side by side
  { ring: 3, offset: 20, photos: [16, 17, 18, 19, 2, 8, 5, 12, 1, 10, 4, 14] },
];

// Displayed card widths per ring (match .orbit-card-N in index.css) so the browser picks 240w or 360w
const CARD_SIZES: Record<RingId, string> = {
  1: "(min-width: 1600px) 128px, 8vw",
  2: "(min-width: 1600px) 168px, 10.5vw",
  3: "(max-width: 767px) 112px, (min-width: 1643px) 230px, 14vw",
};

const photoSrc = (n: number, w?: 240) =>
  `${import.meta.env.BASE_URL}hero/h${String(n).padStart(2, "0")}${w ? `-${w}` : ""}.webp`;

const photoImgProps = (n: number, ring: RingId) => ({
  src: photoSrc(n),
  srcSet: `${photoSrc(n, 240)} 240w, ${photoSrc(n)} 360w`,
  sizes: CARD_SIZES[ring],
  alt: "",
  width: 360,
  height: 225,
  decoding: "async",
  fetchPriority: "low",
}) as const;

/** Places a card on its ring: a position around the circle, in units of that ring's CSS radius. */
function slotTransform(ring: RingId, offset: number, index: number, count: number) {
  const angle = ((offset + (360 / count) * index) * Math.PI) / 180;
  const radius = `var(--orbit-${ring})`;
  return `translate(calc(${Math.cos(angle).toFixed(4)} * ${radius}), calc(${Math.sin(angle).toFixed(4)} * ${radius}))`;
}

/** Decorative rings, colour arcs and spinning photo cards behind the hero copy. */
export function HeroOrbit() {
  return (
    <div className="hero-orbit" aria-hidden="true">
      <span className="hero-ring hero-ring-0" />
      {[1, 2, 3].map((r) => (
        <span key={r} className={`hero-ring hero-ring-${r}`} />
      ))}
      <span className="hero-arc hero-arc-1" />
      <span className="hero-arc hero-arc-2" />

      {RINGS.map(({ ring, reverse, offset, photos }) => (
        <div key={ring} className={`orbit-spin orbit-spin-${ring}${reverse ? " orbit-rev" : ""}`}>
          {photos.map((n, i) => (
            <div key={n} className="orbit-slot" style={{ transform: slotTransform(ring, offset, i, photos.length) }}>
              <div className={`orbit-card orbit-card-${ring}`}>
                {/* Backlight (after Magic UI): a blurred, saturated copy of the photo glowing behind it.
                    Same file as the photo, so no extra download; CSS shows it on desktop only. */}
                <img className="orbit-glow" aria-hidden="true" {...photoImgProps(n, ring)} />
                <img {...photoImgProps(n, ring)} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
