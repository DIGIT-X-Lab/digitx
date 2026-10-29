import type { CSSProperties } from "react";
import "./identity-mark.css";

type Mark = { file: string; source: number; bounds: readonly [number, number, number] };
// Optical square bounds omit empty alpha padding without changing the originals.
const marks: Record<string, Mark> = {
  moose: { file: "moose", source: 1254, bounds: [38, 38.5, 1177] },
  lion: { file: "lion", source: 1254, bounds: [101.5, 97, 1061] },
  falcon: { file: "falcon", source: 1254, bounds: [137, 161, 993] },
  puma: { file: "puma", source: 1254, bounds: [158, 132, 1001] },
  nifti2dicom: { file: "nifti2dicom", source: 1254, bounds: [108, 108, 1038] },
  mosaicx: { file: "mosaicx", source: 1254, bounds: [92, 93.5, 1077] },
  annotatex: { file: "annotatex", source: 1254, bounds: [152, 151, 950] },
  taipan: { file: "taipan", source: 1254, bounds: [162, 187.5, 956] },
  lumos: { file: "/brand/lumos-logo.svg", source: 1024, bounds: [98, 76, 836] },
  galah: { file: "galah", source: 1254, bounds: [286, 289, 792] },
  physiology: { file: "physiology", source: 1254, bounds: [95, 85, 1090] },
  computable: { file: "computability", source: 1254, bounds: [97.5, 79, 1059] },
  systems: { file: "discovery", source: 1254, bounds: [84, 77.5, 1064] },
};

/** Decorative identity: the adjacent native title supplies the accessible name. */
export function IdentityMark({ name, className = "" }: { name: string; className?: string }) {
  const mark = marks[name];
  if (!mark) return null;
  const [x, y, size] = mark.bounds;
  const remaining = mark.source - size;
  const src = mark.file.startsWith("/") ? mark.file : `/brand/identities/${mark.file}.png`;
  const style = {
    "--identity-image": `url("${src}")`,
    "--identity-scale": `${mark.source / size * 100}%`,
    "--identity-position": `${x / remaining * 100}% ${y / remaining * 100}%`,
  } as CSSProperties;
  return <span className={`identity-mark ${className}`} data-identity={name} style={style} aria-hidden="true" />;
}
