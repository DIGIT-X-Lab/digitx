import { useEffect, useMemo, useState } from "react";
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
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
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
    <svg viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label="World map: our collaborators, from Germany across Europe to North America, Asia and Australia, each connected to Munich.">
      <path className="cm-land" d={landPath} fillRule="evenodd" />
      <g className="cm-lines">{nodes.map((node, index) => <path key={index} d={node.path} />)}</g>
      <g className="cm-sites">{nodes.map((node, index) =>
        <circle key={index} cx={node.x.toFixed(1)} cy={node.y.toFixed(1)} r={node.radius.toFixed(1)} />)}</g>
      <circle className="cm-hub-ring" cx={hubX.toFixed(1)} cy={hubY.toFixed(1)} r="8" />
      <circle className="cm-hub" cx={hubX.toFixed(1)} cy={hubY.toFixed(1)} r="3.2" />
      {!still && <g className="cm-pulses">{nodes.flatMap((node, index) => {
        const seconds = 1.7 + (node.distance / W) * 3.2;
        const trips = node.distance > 180 ? 2 : 1;
        return Array.from({ length: trips }, (_, trip) =>
          <circle key={`${index}-${trip}`} r="2">
            <animateMotion dur={`${seconds.toFixed(2)}s`} begin={`${(index * 0.53 + trip * seconds / 2).toFixed(2)}s`}
              repeatCount="indefinite" path={node.path} />
          </circle>);
      })}</g>}
    </svg>
    <figcaption>Our collaborators come from all over the world. There&rsquo;s always room for one more.</figcaption>
  </figure>;
}
