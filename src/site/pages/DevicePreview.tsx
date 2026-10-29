import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useSearchParams } from "react-router-dom";
import { nav } from "@/content/site";
import { Arrow } from "../components/primitives";
import "./device-preview.css";

/* Local review utility: compare the original site's real responsive layouts.
   Its controls inherit DIGITX's neutral palette and type roles. The live page
   is the entire canvas; no duplicated content or simulated mobile CSS. */
const screens = {
  desktop: [{ width: 1440, height: 900 }, { width: 1920, height: 1080 }, { width: 1280, height: 800 }],
  mobile: [{ width: 390, height: 844 }, { width: 430, height: 932 }, { width: 375, height: 812 }, { width: 320, height: 740 }],
};
const sections = [...nav.filter(item => item.id !== "contact"), { id: "opportunities", label: "Opportunities" }, { id: "contact", label: "Contact" }];
type Device = keyof typeof screens;
type Mode = Device | "compare";
type Screen = { width: number; height: number };

function Viewport({ device, screen, section, actualSize, revision, onSizeChange }: {
  device: Device; screen: Screen; section: string;
  actualSize: boolean; revision: number; onSizeChange: (value: string) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const label = device === "desktop" ? "Desktop" : "Mobile";
  useEffect(() => {
    const container = stage.current!;
    const measure = () => {
      if (!container.clientWidth || !container.clientHeight) return;
      setScale(actualSize ? 1 : Math.min(1, container.clientWidth / screen.width, container.clientHeight / screen.height));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    measure();
    return () => observer.disconnect();
  }, [screen.width, screen.height, actualSize]);

  return <section className="dp-viewport" aria-label={`${label} preview`}>
    <header className="dp-viewport-header">
      <label htmlFor={`dp-${device}-size`}>{label}</label>
      <select id={`dp-${device}-size`} aria-label={`${label} screen size`} value={screen.width} onChange={event => onSizeChange(event.target.value)}>
        {screens[device].map(size => <option key={size.width} value={size.width}>{size.width} × {size.height}</option>)}
      </select>
      <span className="dp-scale">{Math.round(scale * 100)}%</span>
    </header>
    <div className="dp-stage" ref={stage} style={{ "--dp-ratio": screen.width / screen.height } as CSSProperties}>
      <div className="dp-frame-space" style={{ width: screen.width * scale, height: screen.height * scale }}>
        <iframe key={`${section}-${revision}`} title={`Original DIGITX site, ${label.toLowerCase()} viewport`} src={`/#${section}`}
          width={screen.width} height={screen.height}
          style={{ width: screen.width, height: screen.height, transform: `scale(${scale})` }} />
      </div>
    </div>
  </section>;
}

export default function DevicePreview() {
  const [params, setParams] = useSearchParams();
  const requestedMode = params.get("view");
  const mode: Mode = requestedMode === "desktop" || requestedMode === "mobile" ? requestedMode : "compare";
  const section = sections.find(item => item.id === params.get("section"))?.id ?? "home";
  const actualSize = params.get("zoom") === "actual";
  const [revision, setRevision] = useState(0);
  const choose = (key: string, value: string) => setParams(previous => {
    const next = new URLSearchParams(previous);
    next.set(key, value);
    return next;
  }, { replace: true });

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Original site · Desktop & mobile preview · DIGITX";
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const meta = existing ?? document.createElement("meta");
    const previousContent = meta.content;
    meta.name = "robots"; meta.content = "noindex, nofollow";
    if (!existing) document.head.append(meta);
    return () => {
      document.title = previousTitle;
      if (existing) meta.content = previousContent; else meta.remove();
    };
  }, []);

  return <main className="device-preview" data-view={mode}>
    <header className="dp-toolbar">
      <div className="dp-identity"><h1>Original site</h1><p>Desktop & mobile preview</p></div>
      <div className="dp-mode" role="group" aria-label="Preview layout">
        {([['desktop', 'Desktop'], ['mobile', 'Mobile'], ['compare', 'Side by side']] as const).map(([value, label]) =>
          <button key={value} type="button" aria-pressed={mode === value} onClick={() => choose("view", value)}>{label}</button>)}
      </div>
      <a className="dp-open" href={`/#${section}`} target="_blank" rel="noopener noreferrer">Open original <Arrow direction="diagonal" /></a>
    </header>
    <div className="dp-controls">
      <label className="dp-section">Jump to section
        <select value={section} onChange={event => choose("section", event.target.value)}>
          {sections.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </label>
      <div className="dp-controls-right">
        <div className="dp-zoom" role="group" aria-label="Preview scale">
          <button type="button" aria-pressed={!actualSize} onClick={() => choose("zoom", "fit")}>Fit</button>
          <button type="button" aria-pressed={actualSize} onClick={() => choose("zoom", "actual")}>100%</button>
        </div>
        <button className="dp-reload" type="button" onClick={() => setRevision(value => value + 1)}>Reload views</button>
      </div>
    </div>
    <div className="dp-workspace">
      {(["desktop", "mobile"] as const).filter(device => mode === "compare" || mode === device).map(device => <Viewport key={device} device={device}
        screen={screens[device].find(size => String(size.width) === params.get(device)) ?? screens[device][0]}
        section={section} revision={revision} actualSize={actualSize}
        onSizeChange={value => choose(device, value)} />)}
    </div>
    <p className="dp-footnote">Scroll and interact inside each view. Mobile shows the responsive layout; touch behaviour still needs a real phone.</p>
  </main>;
}
