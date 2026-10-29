import { useEffect, useId, useRef, useState } from "react";
import { Maximize2, Pause, Play, RotateCcw } from "lucide-react";
import { lumosWorkflow as copy, toolPreview } from "@/content/tool-validation";
import { usePreview } from "../hooks/usePreviewClock";

/** Original Lumos HTML scenes in an isolated viewport, driven by the shared clock. */
export function LumosWorkflow() {
  const preview = usePreview(24700);
  const frame = useRef<HTMLIFrameElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const id = useId();
  const active = copy.chapters.reduce((current, chapter, i) => preview.time >= chapter.start * 1000 ? i : current, 0);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin === location.origin && event.source === frame.current?.contentWindow && event.data?.type === "lumos:ready") setReady(true);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  useEffect(() => {
    if (ready) frame.current?.contentWindow?.postMessage({ type: "lumos:frame", time: preview.time / 1000 }, location.origin);
  }, [ready, preview.time]);
  const fullscreen = () => { void viewport.current?.requestFullscreen?.(); };
  return <div className="tool-workflow lumos-workflow" ref={preview.element} data-step={active} data-playing={!preview.paused && !preview.ended && !preview.reduced}>
    <div className="tool-workflow-chrome"><span className="tool-workflow-name">Lumos</span><div className="lumos-workflow-actions"><span>{toolPreview.preview}</span><button type="button" onClick={fullscreen} aria-label={copy.fullscreen}><Maximize2 aria-hidden="true" /></button></div></div>
    <div className="tool-workflow-stage lumos-workflow-body">
      <div className="lumos-workflow-viewport" ref={viewport}><iframe ref={frame} src={copy.source} title={copy.title} aria-describedby={`${id}-description`} tabIndex={-1} /></div>
    </div>
    <div className="tool-workflow-controls lumos-workflow-controls">
      <div className="tool-workflow-chapters" role="group" aria-label="Lumos preview steps">{copy.chapters.map((chapter, i) => <button type="button" key={chapter.name} aria-pressed={i === active} onClick={() => preview.reduced ? preview.seek(chapter.still * 1000) : preview.start(chapter.start * 1000)}><span className="tool-workflow-step-dot" aria-hidden="true" />{chapter.name}</button>)}</div>
      {!preview.reduced && <button className="tool-workflow-play" type="button" onClick={preview.toggle} aria-label={preview.ended ? toolPreview.replay : preview.paused ? toolPreview.resume : toolPreview.pause}>{preview.ended ? <RotateCcw /> : preview.paused ? <Play /> : <Pause />}</button>}
    </div>
    <p id={`${id}-description`} className="sr-only">{copy.chapters.map(chapter => chapter.caption).join(" ")} This browser demonstration reuses the original Lumos scenes and their fictional research study.</p>
  </div>;
}
