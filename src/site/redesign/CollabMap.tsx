import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from "react";
import land from "./world-land.json";
import "./collab-map.css";

/** The collaboration map: a flat world panel in ink on ivory, landmass
 * filled lightly, flight arcs curving home to Munich with inbound pulses.
 * Centres are aggregated into unnamed nodes sized by how many collaborating
 * centres they hold, so the worldwide reach reads at a glance. */

const LON_MIN = -130;
const LON_MAX = 157;
const LAT_MIN = -45;
const LAT_MAX = 71;
const W = 710;
const H = Math.round((W * (LAT_MAX - LAT_MIN)) / (LON_MAX - LON_MIN));

const HUB: [number, number] = [48.1375, 11.575];

/* Aggregated nodes: lat, lon, number of collaborating centres they stand
   for. 17 centres in all; one Munich partner sits inside the hub itself.
   Germany = Berlin, Wiesbaden, Hannover, Magdeburg, Leipzig, Essen,
   Muenster, Tuebingen (centroid). Australia = Melbourne + Sydney. */
const NODES: [number, number, number][] = [
  [51.3, 9.9, 8],        // Germany
  [51.92, 4.48, 1],      // Rotterdam
  [48.57, 7.75, 1],      // Strasbourg
  [47.27, 11.39, 1],     // Innsbruck
  [43.77, 11.25, 1],     // Florence
  [60.45, 22.27, 1],     // Turku
  [38.55, -121.74, 1],   // Davis
  [23.13, 113.26, 1],    // Guangzhou
  [-35.84, 148.09, 2],   // Melbourne + Sydney
];

const projectX = (lon: number) => ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
const projectY = (lat: number) => ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;

/* Flight arc: a quadratic curve bowing upward on its way home. */
function arc(x: number, y: number, hx: number, hy: number): string {
  const distance = Math.hypot(hx - x, hy - y);
  const lift = Math.min(72, 10 + distance * 0.22);
  const cx = (x + hx) / 2;
  const cy = Math.min(y, hy) - lift;
  return `M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)}`;
}

export function CollabMap() {
  const [still, setStill] = useState(false);
  /* On small screens the svg renders at roughly half scale; strokes stay
     crisp via vector-effect, and the dots grow to compensate. */
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const media = matchMedia("(max-width: 999px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const dotScale = compact ? 1.8 : 1;
  /* Zoom: click or tap zooms toward that point, drag pans, click again
     resets; pinch works on touch. No wheel capture, so the page keeps
     scrolling normally past the figure. */
  const viewport = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [live, setLive] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ scale: number; x: number; y: number; distance: number } | null>(null);
  const movedBy = useRef(0);
  const clampView = (scale: number, x: number, y: number) => {
    const box = viewport.current?.getBoundingClientRect();
    if (!box) return { scale, x, y };
    return {
      scale,
      x: Math.min(0, Math.max(box.width * (1 - scale), x)),
      y: Math.min(0, Math.max(box.height * (1 - scale), y)),
    };
  };
  const localPoint = (event: { clientX: number; clientY: number }) => {
    const box = viewport.current!.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    try { viewport.current?.setPointerCapture(event.pointerId); } catch { /* already released */ }
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    movedBy.current = 0;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { scale: view.scale, x: view.x, y: view.y, distance: Math.hypot(a.x - b.x, a.y - b.y) };
      setLive(true);
    } else if (view.scale > 1) setLive(true);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    movedBy.current += Math.hypot(event.clientX - previous.x, event.clientY - previous.y);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const nextScale = Math.min(4, Math.max(1, pinch.current.scale * (distance / pinch.current.distance)));
      const box = viewport.current!.getBoundingClientRect();
      const mid = { x: (a.x + b.x) / 2 - box.left, y: (a.y + b.y) / 2 - box.top };
      const contentX = (mid.x - pinch.current.x) / pinch.current.scale;
      const contentY = (mid.y - pinch.current.y) / pinch.current.scale;
      setView(clampView(nextScale, mid.x - nextScale * contentX, mid.y - nextScale * contentY));
    } else if (pointers.current.size === 1 && view.scale > 1) {
      setView(value => clampView(value.scale, value.x + event.movementX, value.y + event.movementY));
    }
  };
  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size === 0) {
      setLive(false);
      pinch.current = null;
      setView(value => value.scale < 1.15 ? { scale: 1, x: 0, y: 0 } : value);
    }
  };
  const onClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (movedBy.current > 8) return;
    if (view.scale === 1) {
      const point = localPoint(event);
      setView(clampView(2.6, point.x * (1 - 2.6), point.y * (1 - 2.6)));
    } else setView({ scale: 1, x: 0, y: 0 });
  };
  /* Full-world closed rings; the viewBox does the cropping. Longitudes are
     unwrapped for continuity so antimeridian crossings leave the frame
     instead of streaking across it. */
  const landPath = useMemo(() => (land as number[][][]).map(ring => {
    let previousLon = 0;
    const points = ring.map(([lonScaled, latScaled], index) => {
      let lon = lonScaled / 100;
      if (index) {
        while (lon - previousLon > 180) lon -= 360;
        while (lon - previousLon < -180) lon += 360;
      }
      previousLon = lon;
      return [lon, latScaled / 100] as const;
    });
    /* Unwrapping keeps a ring continuous but can land it a full turn away;
       shift it back to whichever copy overlaps the crop window best. */
    let minLon = Infinity;
    let maxLon = -Infinity;
    for (const [lon] of points) { minLon = Math.min(minLon, lon); maxLon = Math.max(maxLon, lon); }
    let best = 0;
    let bestOverlap = -Infinity;
    for (const shift of [-360, 0, 360]) {
      const overlap = Math.min(maxLon + shift, LON_MAX) - Math.max(minLon + shift, LON_MIN);
      if (overlap > bestOverlap) { bestOverlap = overlap; best = shift; }
    }
    return points.map(([lon, lat], index) =>
      `${index ? "L" : "M"}${projectX(lon + best).toFixed(1)} ${projectY(lat).toFixed(1)}`).join("") + "Z";
  }).join(""), []);
  const hubX = projectX(HUB[1]);
  const hubY = projectY(HUB[0]);
  const nodes = useMemo(() => NODES.map(([lat, lon, count]) => {
    const x = projectX(lon);
    const y = projectY(lat);
    return { x, y, count, radius: Math.min(6.2, 2.6 * Math.sqrt(count) + 0.6), path: arc(x, y, hubX, hubY), distance: Math.hypot(hubX - x, hubY - y) };
  }), [hubX, hubY]);
  return <figure className="collab-map">
    <div ref={viewport} className="cm-viewport" data-zoomed={view.scale > 1 || undefined} data-live={live || undefined}
      style={{ touchAction: view.scale > 1 ? "none" : "pan-y" }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd} onClick={onClick}>
    <svg viewBox={`0 0 ${W} ${H}`} role="img"
      style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
      aria-label="World map: our collaborators, from Germany across Europe to North America, Asia and Australia, each connected to Munich.">
      <path className="cm-land" d={landPath} fillRule="evenodd" vectorEffect="non-scaling-stroke" />
      <g className="cm-lines">{nodes.map((node, index) => <path key={index} d={node.path} vectorEffect="non-scaling-stroke" />)}</g>
      <g className="cm-sites">{nodes.map((node, index) =>
        <circle key={index} cx={node.x.toFixed(1)} cy={node.y.toFixed(1)} r={(node.radius * dotScale).toFixed(1)} />)}</g>
      <circle className="cm-hub-ring" cx={hubX.toFixed(1)} cy={hubY.toFixed(1)} r={(8 * dotScale).toFixed(1)} vectorEffect="non-scaling-stroke" />
      <circle className="cm-hub" cx={hubX.toFixed(1)} cy={hubY.toFixed(1)} r={(3.2 * dotScale).toFixed(1)} />
      {!still && <g className="cm-pulses">{nodes.flatMap((node, index) => {
        const seconds = 1.7 + (node.distance / W) * 3.2;
        const trips = node.distance > 180 ? 2 : 1;
        return Array.from({ length: trips }, (_, trip) =>
          <circle key={`${index}-${trip}`} r={(2 * dotScale).toFixed(1)}>
            <animateMotion dur={`${seconds.toFixed(2)}s`} begin={`${(index * 0.53 + trip * seconds / 2).toFixed(2)}s`}
              repeatCount="indefinite" path={node.path} />
          </circle>);
      })}</g>}
    </svg>
    </div>
    <figcaption>Our collaborators come from all over the world. There&rsquo;s always room for one more.</figcaption>
  </figure>;
}
