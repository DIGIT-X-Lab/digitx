import { useId } from "react";
import { toolStudyCopy as copy } from "@/content/tool-guides";
import "./falcon-study-visual.css";

const human = "/illustrations/anatomy/front-clean.webp";

/** One coordinate system is shared by every frame. The final image is drawn
 * once, so the aligned hold cannot acquire doubled outlines or colour fringes.
 * The parent Study owns visibility, pause and reduced-motion preferences. */
export function FalconStudyVisual() {
  const id = useId().replace(/:/g, "");
  const body = <image href={human} width="1024" height="1536" />;

  return <div className="falcon-visual" role="img" aria-label={copy.falcon.description}>
    <svg className="falcon-definitions" width="0" height="0" aria-hidden="true"><defs>
      <filter id={`${id}-motion`} colorInterpolationFilters="sRGB">
        <feFlood floodColor="#e36b63" />
        <feComposite in2="SourceAlpha" operator="in" />
      </filter>
      <filter id={`${id}-alignment`} colorInterpolationFilters="sRGB">
        <feFlood floodColor="#a9bbc9" />
        <feComposite in2="SourceAlpha" operator="in" />
      </filter>
    </defs></svg>

    <div className="falcon-comparison" aria-hidden="true">
      <div className="falcon-pane falcon-pane--before">
        <div className="falcon-art">
          <svg viewBox="100 -45 824 1620" preserveAspectRatio="xMidYMid meet">
            <g className="falcon-frame falcon-frame--early" filter={`url(#${id}-motion)`}>{body}</g>
            <g className="falcon-frame falcon-frame--late" filter={`url(#${id}-motion)`}>{body}</g>
            <g className="falcon-frame falcon-frame--reference">{body}</g>
          </svg>
        </div>
        <span className="falcon-label">{copy.falcon.before}</span>
      </div>

      <svg className="falcon-direction" viewBox="0 0 32 24" fill="none">
        <path d="M3 12h24m-8-8 8 8-8 8" stroke="currentColor" strokeWidth="1.25" />
      </svg>

      <div className="falcon-pane falcon-pane--after">
        <div className="falcon-art">
          <svg viewBox="100 -45 824 1620" preserveAspectRatio="xMidYMid meet">
            <g className="falcon-aligning">
              <g className="falcon-frame falcon-frame--early" filter={`url(#${id}-alignment)`}>{body}</g>
              <g className="falcon-frame falcon-frame--late" filter={`url(#${id}-alignment)`}>{body}</g>
              <g className="falcon-frame falcon-frame--reference">{body}</g>
            </g>
            <g className="falcon-aligned">{body}</g>
          </svg>
        </div>
        <span className="falcon-label">{copy.falcon.after}</span>
      </div>
    </div>
  </div>;
}
