import { useEffect, useRef, useState } from "react";
import { storyPlayer } from "@/content/home";

/** Reuse the approved film. Its own document owns playback and keyboard controls. */
export function ResearchStory({ presentation, active = true, onClose }: { presentation?: "research"; active?: boolean; onClose?: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const sizeObserver = useRef<ResizeObserver>();
  const [height, setHeight] = useState<number>();
  const [ready, setReady] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const fitFrame = () => {
    sizeObserver.current?.disconnect();
    const content = frame.current?.contentDocument?.querySelector("main");
    if (!content) return;
    const lead = presentation === "research" ? container.current?.closest(".research-page")?.querySelector(".research-opening-lead") : null;
    const resize = () => {
      if (lead) {
        const type = getComputedStyle(lead);
        const document = content.ownerDocument;
        const svg = document.querySelector<SVGSVGElement>("#scene > svg");
        const scale = svg?.getScreenCTM()?.a;
        if (scale && scale > 0) {
          // SVG units scale with the artwork. Cancel that scale so the chapter
          // heading matches the surrounding paragraph in rendered CSS pixels.
          const desktop = (document.defaultView?.innerWidth ?? 0) > 800;
          const style = document.documentElement.style;
          style.setProperty("--scene-title-size", desktop ? `${parseFloat(type.fontSize) / scale}px` : "36px");
          style.setProperty("--scene-title-spacing", desktop ? `${parseFloat(type.letterSpacing) / scale}px` : "-.72px");
          style.setProperty("--scene-mobile-title-size", type.fontSize);
        }
      }
      setHeight(Math.max(280, Math.min(2400, Math.ceil(content.getBoundingClientRect().height))));
    };
    // This is a local, same-origin document. Observing its content directly
    // also handles Safari's ResizeObserver message-source inconsistency.
    sizeObserver.current = new ResizeObserver(resize);
    sizeObserver.current.observe(content);
    if (lead) sizeObserver.current.observe(lead);
    resize();
  };

  useEffect(() => {
    let visible = false;
    const timeout = setTimeout(() => setDelayed(true), 15000);
    const sendVisibility = () => frame.current?.contentWindow?.postMessage(
      { type: "digitx-story-visibility", visible: active && visible && !document.hidden }, location.origin,
    );
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "digitx-story-ready") { clearTimeout(timeout); setReady(true); sendVisibility(); }
      if (event.data?.type === "digitx-story-close") onClose?.();
    };
    window.addEventListener("message", onMessage);
    document.addEventListener("visibilitychange", sendVisibility);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= .25;
      sendVisibility();
    }, { threshold: [0, .25] });
    if (container.current) observer.observe(container.current);
    sendVisibility();
    return () => {
      observer.disconnect(); clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
      document.removeEventListener("visibilitychange", sendVisibility);
    };
  }, [active, onClose]);
  useEffect(() => () => sizeObserver.current?.disconnect(), []);

  return <div className="research-story" ref={container}>
    <iframe ref={frame} onLoad={fitFrame} src={`/previews/digitx-story.html?embed=1${presentation === "research" ? "&layout=research" : ""}`} title={storyPlayer.title}
      className="research-story-frame" style={height ? { height } : undefined} />
    {!ready && <p className="story-load-status" role="status">{delayed ? storyPlayer.unavailable : storyPlayer.loading}</p>}
    {(presentation !== "research" || delayed) && <a className="story-open" href="/previews/digitx-story.html" target="_blank" rel="noopener noreferrer">{storyPlayer.open}<span aria-hidden="true"> ↗</span></a>}
  </div>;
}
