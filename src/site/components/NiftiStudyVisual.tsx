import { useId, type CSSProperties } from "react";
import { toolStudyCopy as copy } from "@/content/tool-guides";
import { Arrow } from "./primitives";
import "./nifti-study-visual.css";

const layers = [6, 5, 4, 3, 2, 1, 0];
const grid = Array.from({ length: 7 }, (_, index) => (index + 1) * 18);

// An abstract labelled voxel volume, not medical image data. Both formats use
// these exact same cells: conversion changes the container, not the contents.
function SliceContents({ layer }: { layer: number }) {
  const cells = Array.from({ length: 64 }, (_, index) => {
    const x = index % 8;
    const y = Math.floor(index / 8);
    const blue = x >= 2 && x <= 4 && y >= 2 && y <= 4 && layer <= 5;
    const coral = x >= 5 && x <= 6 && y >= 4 && y <= 5 && layer >= 2 && layer <= 4;
    if (!blue && !coral) return null;
    return <rect key={index} className={`nifti-cell nifti-cell--${blue ? "blue" : "coral"}`}
      x={x * 18 + 1} y={y * 18 + 1} width="16" height="16" />;
  });
  return <>
    <rect className="nifti-plane-surface" width="144" height="144" />
    <path className="nifti-plane-grid" d={grid.map(value => `M${value} 0V144M0 ${value}H144`).join("")} />
    {cells}
    <path className="nifti-plane-edge" d="M0 0H144V144H0Z" />
    <path className="nifti-plane-corners" d="M0 18V0H18M126 0H144V18M144 126V144H126M18 144H0V126" />
  </>;
}

export function NiftiStudyVisual() {
  const id = useId().replace(/:/g, "");
  return <div className="nifti-visual">
    <div className="nifti-format-labels" aria-hidden="true">
      <span className="nifti-format-source">{copy.nifti2dicom.input}</span>
      <Arrow />
      <span className="nifti-format-output">{copy.nifti2dicom.output}</span>
    </div>
    <div className="nifti-art">
      <svg className="nifti-volume" viewBox="70 35 340 335" role="img" aria-labelledby={`${id}-title ${id}-description`}>
        <title id={`${id}-title`}>{copy.nifti2dicom.title}</title>
        <desc id={`${id}-description`}>{copy.nifti2dicom.description}</desc>
        <g className="nifti-volume-edges">
          <path d="M240 98V200M110.4 144.08V246.08M369.6 144.08V246.08M240 190.16V292.16" />
        </g>
        {layers.map(layer => <g className="nifti-slice" key={layer} data-slice={layer}
          style={{ "--packed-y": `${28 + layer * 17}px`, "--spread-y": `${layer * 32}px` } as CSSProperties}>
          <g transform="matrix(.9 .32 -.9 .32 240 70)"><SliceContents layer={layer} /></g>
        </g>)}
        <g className="nifti-reference-frame">
          <path d="M99 115V59H132M348 59H381V115M99 295V360H132M348 360H381V295" />
          <path className="nifti-reference-link" d="M240 360v8" />
        </g>
      </svg>
    </div>
    <div className="nifti-reference" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none"><path d="M4 9V4h5m6 0h5v5m0 6v5h-5m-6 0H4v-5M8 12h8m-4-4v8" stroke="currentColor" strokeWidth="1.2" /></svg>
      <span>{copy.nifti2dicom.reference}</span>
    </div>
  </div>;
}
