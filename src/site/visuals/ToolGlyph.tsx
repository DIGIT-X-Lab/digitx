/**
 * Synthetic schematics, one per tool. Each shows what the tool does in the deck's
 * line language; none is output from the tool itself.
 */

const INK = "var(--ink)";
const SUB = "var(--subtle)";
const DIM = "var(--strong)";
const LINE = "var(--line)";
const CORAL = "var(--coral)";
const BLUE = "var(--blue)";
const GREEN = "var(--green)";

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** MOOSE: a coronal label map; each organ becomes its own labelled class. */
function Moose() {
  const S = 5.4;
  const ROWS = 35;
  const cx = 160;
  const top = 6;
  // half-width of the body (in cells) at each row: head, neck, shoulders, waist, hips
  const half = (r: number) =>
    r < 6 ? Math.sqrt(Math.max(0, 9 - (r - 3) ** 2)) * 0.95 : r < 8 ? 1.6 : r < 10 ? 6.5 + (r - 8) * 1.2 : r < 23 ? 8.8 - (r - 10) * 0.12 : 7.3 + (r - 23) * 0.12;
  const organs = [
    { x: 0, y: 3, rx: 2.3, ry: 2.2, c: SUB }, // brain
    { x: -3.6, y: 13, rx: 2.5, ry: 3.6, c: BLUE }, // right lung
    { x: 3.5, y: 13, rx: 2.3, ry: 3.6, c: BLUE }, // left lung
    { x: 1, y: 15.4, rx: 1.9, ry: 1.6, c: CORAL }, // heart
    { x: -2.6, y: 19.6, rx: 3.6, ry: 1.9, c: INK }, // liver
    { x: 4.4, y: 19, rx: 1.3, ry: 1.4, c: DIM }, // spleen
    { x: -2.7, y: 23, rx: 1.0, ry: 1.7, c: GREEN }, // right kidney
    { x: 2.7, y: 23, rx: 1.0, ry: 1.7, c: GREEN }, // left kidney
    { x: 0, y: 31.4, rx: 1.7, ry: 1.2, c: BLUE }, // bladder
  ];
  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    const h = half(r);
    for (let c = -10; c <= 10; c++) {
      const gx = c;
      if (Math.abs(gx) > h) continue;
      const hit = organs.find((o) => ((gx - o.x) / o.rx) ** 2 + ((r - o.y) / o.ry) ** 2 <= 1);
      const spine = !hit && r > 9 && r < 30 && gx === 0;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={cx + gx * S - S / 2 + 0.45}
          y={top + r * S + 0.45}
          width={S - 0.9}
          height={S - 0.9}
          fill={hit ? hit.c : spine ? "var(--muted)" : "var(--line)"}
          opacity={hit ? (hit.c === INK ? 0.55 : 0.85) : spine ? 0.5 : 1}
        />,
      );
    }
  }
  return <g>{cells}</g>;
}

/** LION: a maximum-intensity field with one lesion outlined. */
function Lion() {
  const dots = Array.from({ length: 70 }, (_, i) => ({
    x: 70 + rand(i) * 180,
    y: 28 + rand(i + 99) * 144,
    r: 1 + rand(i + 7) * 2.6,
    o: 0.15 + rand(i + 3) * 0.45,
  }));
  return (
    <g>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={SUB} opacity={d.o} />
      ))}
      <circle cx={196} cy={82} r={9} fill={INK} opacity={0.9} />
      <circle cx={190} cy={88} r={6} fill={INK} opacity={0.75} />
      <path d="M176 70 C186 60 210 64 212 80 C214 96 200 104 186 100 C174 96 168 80 176 70 Z" fill="none" stroke={CORAL} strokeWidth={1.8} />
      <line x1={212} y1={78} x2={244} y2={62} stroke={CORAL} strokeWidth={1} />
      <text x={248} y={60} fontSize={12} fill={CORAL}>lesion</text>
    </g>
  );
}

/** FALCON: frames that drifted apart, then brought back into register. */
function Falcon() {
  const organ = (x: number, y: number, stroke: string, o = 1) => (
    <g opacity={o}>
      <ellipse cx={x} cy={y} rx={30} ry={42} fill="none" stroke={stroke} strokeWidth={1.6} />
      <ellipse cx={x + 4} cy={y - 8} rx={10} ry={13} fill="none" stroke={stroke} strokeWidth={1.2} />
    </g>
  );
  return (
    <g>
      {organ(86, 100, SUB, 0.9)}
      {organ(100, 92, CORAL, 0.9)}
      <text x={93} y={172} fontSize={12} fill={SUB} textAnchor="middle">before</text>
      <path d="M150 100 H180" stroke={DIM} strokeWidth={1.2} />
      <path d="M176 95 L182 100 L176 105" fill="none" stroke={DIM} strokeWidth={1.2} />
      {organ(236, 98, SUB, 0.9)}
      {organ(236, 98, CORAL, 0.9)}
      <text x={236} y={172} fontSize={12} fill={SUB} textAnchor="middle">after</text>
    </g>
  );
}

/** PUMA: two tracer studies brought into one frame. */
function Puma() {
  return (
    <g>
      <rect x={96} y={36} width={128} height={128} fill="none" stroke={LINE} />
      <path d="M126 140 C120 100 132 60 160 52 C188 60 200 100 194 140 Z" fill="none" stroke={BLUE} strokeWidth={1.6} />
      <circle cx={146} cy={96} r={9} fill={BLUE} opacity={0.5} />
      <circle cx={176} cy={118} r={7} fill={CORAL} opacity={0.8} />
      <circle cx={150} cy={78} r={5} fill={CORAL} opacity={0.8} />
      <line x1={160} y1={30} x2={160} y2={170} stroke={DIM} strokeDasharray="2 4" />
      <line x1={90} y1={100} x2={230} y2={100} stroke={DIM} strokeDasharray="2 4" />
      <text x={236} y={70} fontSize={12} fill={BLUE}>tracer A</text>
      <text x={236} y={124} fontSize={12} fill={CORAL}>tracer B</text>
    </g>
  );
}

/** nifti2dicom: research volume and mask in, DICOM out. */
function Nifti() {
  const file = (x: number, label: string, sub: string, stroke: string) => (
    <g>
      <path d={`M${x} 52 H${x + 62} L${x + 80} 70 V148 H${x} Z`} fill="none" stroke={stroke} strokeWidth={1.4} />
      <path d={`M${x + 62} 52 V70 H${x + 80}`} fill="none" stroke={stroke} strokeWidth={1.2} />
      <text x={x + 40} y={108} fontSize={13} fill={INK} textAnchor="middle">{label}</text>
      <text x={x + 40} y={126} fontSize={11} fill={SUB} textAnchor="middle">{sub}</text>
    </g>
  );
  return (
    <g>
      {file(46, ".nii.gz", "image + mask", SUB)}
      <path d="M140 100 H178" stroke={DIM} strokeWidth={1.2} />
      <path d="M174 95 L180 100 L174 105" fill="none" stroke={DIM} strokeWidth={1.2} />
      {file(194, "DICOM", "SEG", CORAL)}
    </g>
  );
}

/** MOSAICX: sentences on the left, fields with source links on the right. */
function Mosaicx() {
  const bars = [
    [40, 150, 0],
    [40, 120, 1],
    [40, 160, 0],
    [40, 90, 2],
    [40, 140, 0],
  ];
  return (
    <g>
      {bars.map(([x, w, hl], i) => (
        <g key={i}>
          <rect x={x} y={44 + i * 24} width={w} height={8} fill={DIM} />
          {hl > 0 && <rect x={x + 30} y={44 + i * 24} width={56} height={8} fill={CORAL} opacity={0.85} />}
        </g>
      ))}
      {[0, 1].map((k) => (
        <g key={k}>
          <path d={`M${126 + (k ? -30 : 0)} ${k ? 120 : 72} C 200 ${k ? 120 : 72} 196 ${k ? 116 : 70} 224 ${k ? 116 : 70}`} fill="none" stroke={CORAL} strokeWidth={1} opacity={0.8} />
          <rect x={226} y={(k ? 106 : 60) as number} width={70} height={20} fill="none" stroke={SUB} />
          <rect x={232} y={(k ? 113 : 67) as number} width={k ? 34 : 46} height={6} fill={INK} />
        </g>
      ))}
    </g>
  );
}

/** ANNOTATEX: an expert labels spans of text. */
function Annotatex() {
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={48} y={46 + i * 28} width={[200, 170, 214, 120][i]} height={8} fill={DIM} />
      ))}
      <rect x={92} y={41} width={62} height={18} fill="none" stroke={CORAL} strokeWidth={1.4} />
      <rect x={60} y={97} width={78} height={18} fill="none" stroke={BLUE} strokeWidth={1.4} />
      <rect x={154} y={125} width={52} height={18} fill="none" stroke={GREEN} strokeWidth={1.4} />
      <text x={158} y={36} fontSize={11} fill={CORAL}>finding</text>
      <text x={142} y={93} fontSize={11} fill={BLUE}>site</text>
      <text x={210} y={138} fontSize={11} fill={GREEN}>status</text>
    </g>
  );
}

/** TAIPAN: every voxel carries a time course; parameters become maps. */
function Taipan() {
  const cells = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const v = Math.max(0, 1 - Math.hypot(r - 3.2, c - 4.6) / 5.2) * (0.6 + rand(r * 8 + c) * 0.4);
      cells.push(<rect key={`${r}${c}`} x={44 + c * 15} y={40 + r * 15} width={14} height={14} fill={CORAL} opacity={0.08 + v * 0.9} />);
    }
  }
  return (
    <g>
      {cells}
      <rect x={44 + 4 * 15} y={40 + 3 * 15} width={14} height={14} fill="none" stroke={INK} strokeWidth={1.4} />
      <line x1={180} y1={150} x2={290} y2={150} stroke={SUB} />
      <line x1={180} y1={150} x2={180} y2={50} stroke={SUB} />
      <path d="M180 150 C194 150 196 64 208 64 C222 64 228 112 290 118" fill="none" stroke={INK} strokeWidth={1.6} />
      <path d="M124 52 L180 70" stroke={DIM} strokeDasharray="2 3" />
    </g>
  );
}

/** Lumos: a document with highlighted passages and a side panel. */
function Lumos() {
  return (
    <g>
      <rect x={60} y={30} width={120} height={150} fill="none" stroke={SUB} strokeWidth={1.2} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={74} y={48 + i * 17} width={[86, 70, 90, 60, 84, 72, 50][i]} height={6} fill={i === 2 || i === 5 ? CORAL : DIM} opacity={i === 2 || i === 5 ? 0.85 : 1} />
      ))}
      <rect x={196} y={30} width={74} height={150} fill="none" stroke={LINE} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={206} y={46 + i * 34} width={54} height={6} fill={INK} opacity={0.85} />
          <rect x={206} y={58 + i * 34} width={36} height={5} fill={DIM} />
        </g>
      ))}
    </g>
  );
}

/** GALAH: an image and its report read side by side. */
function Galah() {
  return (
    <g>
      <rect x={40} y={34} width={116} height={132} fill="none" stroke={LINE} />
      <ellipse cx={98} cy={100} rx={34} ry={52} fill="none" stroke={SUB} strokeWidth={1.4} />
      <circle cx={110} cy={86} r={8} fill={CORAL} opacity={0.85} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={182} y={48 + i * 22} width={[96, 80, 104, 70, 88][i]} height={7} fill={i === 1 ? INK : DIM} opacity={i === 1 ? 0.9 : 1} />
      ))}
      <path d="M118 86 C 150 86 150 73 180 73" fill="none" stroke={CORAL} strokeWidth={1} />
    </g>
  );
}

const glyphs: Record<string, () => JSX.Element> = {
  moose: Moose,
  lion: Lion,
  falcon: Falcon,
  puma: Puma,
  nifti2dicom: Nifti,
  mosaicx: Mosaicx,
  annotatex: Annotatex,
  taipan: Taipan,
  lumos: Lumos,
  galah: Galah,
};

export function ToolGlyph({ slug, className = "" }: { slug: string; className?: string }) {
  const G = glyphs[slug];
  if (!G) return null;
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <G />
    </svg>
  );
}
