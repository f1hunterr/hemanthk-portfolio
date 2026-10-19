// After Magic UI's Animated Beam (MIT, https://magicui.design), as a static SVG with CSS-animated
// pulses: BlendFlow's real pipeline, Google Sheets -> master -> render PCs -> NAS.
// Drawn top-to-bottom at roughly the card's width, so its labels render at full size (not shrunk).
const PCS = [
  { x: 60, label: "RENDER PC 1" },
  { x: 170, label: "RENDER PC 2" },
  { x: 280, label: "RENDER PC 3" },
];

export function BlendFlowDiagram() {
  return (
    <svg
      data-beam-diagram
      className="beam-diagram"
      viewBox="0 0 340 226"
      role="img"
      aria-label="BlendFlow pipeline: jobs from Google Sheets go to the master, which hands them to render PCs; finished images are saved to the NAS"
    >
      <defs>
        <linearGradient id="beam-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2d81ff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#2d81ff" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {/* Wires, then the pulses that travel along them */}
      <path className="beam-wire" d="M170 36 L 170 62" />
      {PCS.map((pc) => (
        <g key={pc.label}>
          <path className="beam-wire" d={`M170 94 C 170 108, ${pc.x} 108, ${pc.x} 122`} />
          <path className="beam-wire" d={`M${pc.x} 150 C ${pc.x} 170, 170 170, 170 190`} />
        </g>
      ))}
      <path className="beam-pulse" d="M170 36 L 170 62" />
      {PCS.map((pc, i) => (
        <g key={`p-${pc.label}`}>
          <path className={`beam-pulse beam-d${i + 1}`} d={`M170 94 C 170 108, ${pc.x} 108, ${pc.x} 122`} />
          <path className={`beam-pulse beam-d${i + 2}`} d={`M${pc.x} 150 C ${pc.x} 170, 170 170, 170 190`} />
        </g>
      ))}

      {/* Nodes */}
      <g className="beam-node">
        <rect x="105" y="8" width="130" height="28" />
        <text x="170" y="26">GOOGLE SHEETS</text>
      </g>
      <g className="beam-node beam-node-dark">
        <rect x="130" y="62" width="80" height="32" />
        <text x="170" y="82">MASTER</text>
      </g>
      {PCS.map((pc) => (
        <g key={`n-${pc.label}`} className="beam-node">
          <rect x={pc.x - 52} y="122" width="104" height="28" />
          <text x={pc.x} y="140">{pc.label}</text>
        </g>
      ))}
      <g className="beam-node">
        <rect x="125" y="190" width="90" height="28" />
        <text x="170" y="208">NAS</text>
      </g>
    </svg>
  );
}
