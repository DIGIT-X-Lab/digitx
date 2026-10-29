import { useId, useState } from "react";
import "./demonstrations.css";

/** A deterministic synthetic phantom, not a scan or a validated segmentation. */
const SIZE = 32;
const PIXEL_MM = 0.78;
const MUSCLE: [number, number] = [-29, 150];
const SAMPLE = { row: 11, col: 8, size: 3 };

function noise(row: number, col: number) {
  const value = Math.sin(row * 127.1 + col * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const pixels = Array.from({ length: SIZE }, (_, row) =>
  Array.from({ length: SIZE }, (_, col) => {
    const distance = Math.hypot((col - 15.5) / 14.2, (row - 15.5) / 15);
    const bone = Math.hypot((col - 18.5) / 3.4, (row - 18) / 4.4);
    const value = noise(row, col);
    if (distance > 1) return -900;
    if (distance > 0.81) return Math.round(-112 + value * 34);
    if (bone < 1) return Math.round(380 + value * 320);
    return Math.round(32 + value * 40);
  }),
);
const inRange = (value: number) => value >= MUSCLE[0] && value <= MUSCLE[1];
const selectedCount = pixels.flat().filter(inRange).length;
const pixelArea = PIXEL_MM * PIXEL_MM;
const area = selectedCount * pixelArea;
const sampleValues = pixels.slice(SAMPLE.row, SAMPLE.row + SAMPLE.size)
  .map((row) => row.slice(SAMPLE.col, SAMPLE.col + SAMPLE.size));

function grey(value: number) {
  if (value === -900) return "#0b0a09";
  // Fixed soft-tissue display window: level 40, width 400.
  const intensity = Math.round(20 + Math.max(0, Math.min(1, (value + 160) / 400)) * 210);
  return `rgb(${intensity}, ${intensity - 3}, ${intensity - 6})`;
}

const steps = ["Pixel values", "Muscle range", "Derived measure"];

export function PixelToMeasure() {
  const [step, setStep] = useState(0);
  const id = useId();
  const description = step === 0
    ? "A synthetic image made of 32 by 32 fixed pixel values. A three by three region is outlined and its stored values are shown alongside."
    : `The same synthetic image, with ${selectedCount} pixels in the range ${MUSCLE[0]} to ${MUSCLE[1]} Hounsfield units highlighted. This is a range selection, not a validated segmentation.`;

  return (
    <div className="dx-demo dx-pixel-demo">
      <div className="dx-demo-steps" role="group" aria-label="Explore the image measurement">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={step === index}
            aria-controls={`${id}-view`}
            onClick={() => setStep(index)}
          >
            <span className="dx-step-number" aria-hidden="true">{index + 1}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="dx-pixel-view" id={`${id}-view`}>
        <figure className="dx-pixel-figure">
          <svg viewBox="0 0 320 320" role="img" aria-labelledby={`${id}-title ${id}-description`}>
            <title id={`${id}-title`}>Synthetic image crop</title>
            <desc id={`${id}-description`}>{description}</desc>
            {pixels.map((row, rowIndex) => row.map((value, colIndex) => (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * 10}
                y={rowIndex * 10}
                width="10"
                height="10"
                fill={step > 0 && inRange(value) ? "#e36b63" : grey(value)}
                opacity={step > 0 && !inRange(value) && value !== -900 ? 0.55 : 1}
                className="dx-phantom-pixel"
              />
            )))}
            {step === 0 && (
              <g fill="none" stroke="#f1eeea" strokeWidth="1.5">
                <rect x={SAMPLE.col * 10} y={SAMPLE.row * 10} width={SAMPLE.size * 10} height={SAMPLE.size * 10} />
                <path d={`M${(SAMPLE.col + SAMPLE.size) * 10} ${SAMPLE.row * 10} L250 48 H294`} />
                <circle cx={(SAMPLE.col + SAMPLE.size) * 10} cy={SAMPLE.row * 10} r="2.5" fill="#f1eeea" />
              </g>
            )}
          </svg>
          <figcaption className="dx-image-key">
            <span className={`dx-image-swatch${step > 0 ? " is-selected" : ""}`} aria-hidden="true" />
            {step === 0 ? "Synthetic image crop" : "Pixels within the selected range"}
          </figcaption>
        </figure>

        <div className="dx-pixel-detail" aria-live="polite" aria-atomic="true">
          {step === 0 && (
            <div className="dx-detail-content">
              <p className="dx-demo-label">Hounsfield units, as stored</p>
              <table className="dx-value-matrix" aria-label="Stored Hounsfield units in the outlined three by three region">
                <tbody>
                  {sampleValues.map((row, rowIndex) => (
                    <tr key={rowIndex}>{row.map((value, colIndex) => <td key={colIndex}>{value}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              <p className="dx-demo-note">Each pixel already contains a number.</p>
            </div>
          )}
          {step === 1 && (
            <div className="dx-detail-content">
              <p className="dx-demo-label">Muscle range</p>
              <p className="dx-demo-measure dx-range-measure">−29 <span>to</span> 150 <small>HU</small></p>
              <p className="dx-selection-count"><span className="dx-image-swatch is-selected" aria-hidden="true" />{selectedCount} selected pixels</p>
              <p className="dx-demo-note">Range selection only; not a validated segmentation.</p>
            </div>
          )}
          {step === 2 && (
            <div className="dx-detail-content">
              <p className="dx-demo-label">Area in this crop</p>
              <p className="dx-demo-measure">{area.toFixed(1)} <small>mm²</small></p>
              <p className="dx-area-formula">{selectedCount} pixels × {pixelArea.toFixed(4)} mm²</p>
              <p className="dx-demo-note">Pixel spacing: {PIXEL_MM} × {PIXEL_MM} mm.<br />Area is derived from the selected pixels.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
