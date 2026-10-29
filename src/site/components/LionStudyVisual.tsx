import { useId } from "react";
import { toolStudyCopy as copy } from "@/content/tool-guides";
import "./lion-study-visual.css";

const tumourAtlas = "/illustrations/anatomy/puma-rgb-tumours-v1.png";

// These are illustrative placements on the existing patient figures, not LION
// inference results. Reuse the approved raster masks rather than draw lesions.
const lesionPlacements = {
  FDG: [
    { id: "breast", x: 527, y: 350, size: 96, source: "330 480 230 205" },
    { id: "axillary-upper", x: 611, y: 313, size: 44, source: "350 315 160 145" },
    { id: "axillary-lower", x: 617, y: 359, size: 40, source: "475 690 145 145" },
  ],
  PSMA: [
    { id: "pelvis", x: 463, y: 699, size: 94, source: "330 480 230 205" },
    { id: "pelvic-node-left", x: 420, y: 639, size: 56, source: "350 315 160 145" },
    { id: "pelvic-node-right", x: 547, y: 640, size: 52, source: "475 690 145 145" },
    { id: "spine-lower", x: 488, y: 549, size: 56, source: "350 315 160 145" },
    { id: "spine-middle", x: 487, y: 448, size: 52, source: "475 690 145 145" },
    { id: "spine-upper", x: 488, y: 354, size: 50, source: "350 315 160 145" },
    { id: "rib-right", x: 583, y: 399, size: 58, source: "330 480 230 205" },
    { id: "rib-left", x: 386, y: 469, size: 56, source: "350 315 160 145" },
    { id: "proximal-femur", x: 391, y: 785, size: 68, source: "330 480 230 205" },
  ],
};

/** The Study wrapper controls playback. Focused demos reveal these fixed masks
 * in a loop; detail-page inspection and reduced motion show the complete result. */
export function LionStudyVisual() {
  const id = useId().replace(/:/g, "");

  return <div className="tool-study-tracers lion-study-tracers">
    {copy.lion.tracers.map(tracer => {
      const tracerName = tracer.name === "FDG" ? "FDG" : "PSMA";
      const filterId = `${id}-lion-${tracerName.toLowerCase()}`;
      const regions = [...new Set(lesionPlacements[tracerName].map(lesion => lesion.source))];

      return <div className={`tool-study-tracer-view tool-study-tracer-view--${tracerName.toLowerCase()}`} key={tracerName}>
        <div className="tool-study-tracer-art">
          <svg viewBox="200 8 630 1480" preserveAspectRatio="xMidYMid meet" role="img" aria-label={tracer.description}>
            <defs>
              {regions.map((source, index) => {
                const [x, y, width, height] = source.split(" ").map(Number);
                return <filter key={source} id={`${filterId}-${index}`} colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse" x={x} y={y} width={width} height={height}>
                  <feFlood className="lion-study-lesion-colour" />
                  <feComposite in2="SourceAlpha" operator="in" />
                </filter>;
              })}
            </defs>
            <image href={`/illustrations/anatomy/${tracer.asset}`} width="1024" height="1536" />
            {lesionPlacements[tracerName].map(lesion => <svg key={lesion.id}
              className="lion-study-lesion" data-lesion={lesion.id}
              x={lesion.x} y={lesion.y} width={lesion.size} height={lesion.size}
              viewBox={lesion.source} overflow="hidden" aria-hidden="true">
              <image href={tumourAtlas} width="1024" height="1536" filter={`url(#${filterId}-${regions.indexOf(lesion.source)})`} />
            </svg>)}
          </svg>
        </div>
        <span className="tool-study-tracer-label">{tracer.name}</span>
      </div>;
    })}
  </div>;
}
