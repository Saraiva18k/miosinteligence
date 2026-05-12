// Neural-network brain logo — MIOS brand mark
// Left hemisphere: warm orange glowing nodes  |  Right: cool white/silver nodes

type NodeType = "hot" | "warm" | "cool" | "fade";

interface BrainNode { x: number; y: number; r: number; type: NodeType }

// ViewBox 0 0 32 22  — proportioned for a 44px tall header
const NODES: BrainNode[] = [
  //  # —  (  x,    y )  r     type       hemisphere
  { x:  8,  y:  4.5, r: 1.9, type: "hot"  },  //  0  top-left   ● orange glow
  { x: 14,  y:  2.5, r: 2.2, type: "hot"  },  //  1  top-center ● BRIGHT (largest)
  { x: 20,  y:  4.5, r: 1.7, type: "warm" },  //  2  top-right  ● orange
  { x: 25,  y:  6.5, r: 1.5, type: "cool" },  //  3  far-top    ○ white
  { x:  5,  y: 11.0, r: 1.5, type: "warm" },  //  4  mid-left   ● orange
  { x: 11,  y:  9.0, r: 2.4, type: "hot"  },  //  5  center     ● STAR (brightest)
  { x: 17,  y: 10.0, r: 1.7, type: "warm" },  //  6  mid-center ● orange
  { x: 22,  y: 11.0, r: 1.6, type: "cool" },  //  7  mid-right  ○ white
  { x: 28,  y: 12.0, r: 1.5, type: "cool" },  //  8  far-right  ○ white
  { x:  8,  y: 17.0, r: 1.6, type: "warm" },  //  9  lower-left ● orange
  { x: 14,  y: 16.0, r: 1.8, type: "warm" },  // 10  lower-mid  ● orange
  { x: 20,  y: 17.0, r: 1.4, type: "cool" },  // 11  lower-right○ white
  { x: 26,  y: 17.0, r: 1.4, type: "cool" },  // 12  lower-far  ○ white
  { x:  3,  y: 15.0, r: 1.3, type: "fade" },  // 13  temporal   ● dim orange bump
];

// Connection edges — [nodeA, nodeB] by index
const EDGES: [number, number][] = [
  // Top arch
  [0, 1], [1, 2], [2, 3],
  // Top → mid
  [0, 4], [0, 5], [1, 5], [1, 6], [2, 6], [2, 7], [3, 7], [3, 8],
  // Mid row
  [4, 5], [5, 6], [6, 7], [7, 8],
  // Mid → lower
  [4, 9], [5, 10], [6, 10], [6, 11], [7, 11], [7, 12], [8, 12],
  // Lower row
  [9, 10], [10, 11], [11, 12],
  // Temporal lobe connections
  [4, 13], [9, 13],
];

function fillFor(t: NodeType) {
  if (t === "hot")  return "#ff9500";
  if (t === "warm") return "rgba(255,149,0,0.72)";
  if (t === "cool") return "rgba(185,210,245,0.65)";
  return "rgba(255,149,0,0.42)";  // fade
}

function strokeFor(ai: number, bi: number) {
  const isWarm = (i: number) => {
    const t = NODES[i].type;
    return t === "hot" || t === "warm" || t === "fade";
  };
  const a = isWarm(ai), b = isWarm(bi);
  if  (a &&  b) return "rgba(255,149,0,0.28)";
  if (!a && !b) return "rgba(185,210,255,0.13)";
  return "rgba(255,175,80,0.18)";
}

export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>

      {/* ── Neural brain SVG ─────────────────────────────────────── */}
      <svg
        viewBox="0 0 32 22"
        width={32}
        height={22}
        aria-label="MIOS neural brain"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          {/* Glow filter for orange "hot" nodes */}
          <filter id="lg-glow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Ambient halo behind orange cluster */}
          <filter id="lg-ambient" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Soft ambient glow — anchors the orange hemisphere */}
        <ellipse
          cx={11} cy={10} rx={9} ry={8}
          fill="rgba(255,149,0,0.08)"
          filter="url(#lg-ambient)"
        />

        {/* Connection lines */}
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x} y1={NODES[a].y}
            x2={NODES[b].x} y2={NODES[b].y}
            stroke={strokeFor(a, b)}
            strokeWidth="0.55"
            strokeLinecap="round"
          />
        ))}

        {/* Node circles */}
        {NODES.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={fillFor(n.type)}
            filter={n.type === "hot" ? "url(#lg-glow)" : undefined}
          />
        ))}
      </svg>

      {/* ── MIOS wordmark ────────────────────────────────────────── */}
      <span style={{
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "3px",
        color: "rgba(255,255,255,0.93)",
        fontFamily: "inherit",
        lineHeight: 1,
      }}>
        MIOS
      </span>

    </div>
  );
}
