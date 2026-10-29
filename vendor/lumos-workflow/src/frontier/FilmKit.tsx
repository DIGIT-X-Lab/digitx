import React, { type CSSProperties, type ReactNode } from "react";
import { Easing, interpolate, staticFile } from "remotion";
import {
  ArrowUp,
  Check,
  Cpu,
  Cursor,
  Folder,
  GearSix,
  Paperclip,
  SquaresFour,
  Stack,
  Table,
} from "@phosphor-icons/react";

export const C = {
  bg: "#0b0a09",
  surface: "#11100e",
  ink: "#eeece6",
  muted: "#aaa69e",
  rule: "#302d28",
  faint: "#68645d",
};
export const line = `1px solid ${C.rule}`;
export const flex: CSSProperties = { display: "flex", alignItems: "center" };
const clamped = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const p = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {
    ...clamped,
    easing: Easing.bezier(0.4, 0, 0.16, 1),
  });
export const lerp = (a: number, b: number, q: number) => a + (b - a) * q;
export const visible = (t: number, a: number, b: number) =>
  p(t, a, a + 0.4) * (1 - p(t, b - 0.4, b));
export function Mark({
  size = 40,
  color = C.ink,
}: {
  size?: number;
  color?: string;
}) {
  const src = `url("${staticFile("lumos-logo.svg")}")`;
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        background: color,
        maskImage: src,
        WebkitMaskImage: src,
        maskSize: "contain",
        maskPosition: "center",
        maskRepeat: "no-repeat",
      }}
    />
  );
}
export function Words({
  text,
  t,
  start = 0,
  duration = 1.2,
  style,
}: {
  text: string;
  t: number;
  start?: number;
  duration?: number;
  style?: CSSProperties;
}) {
  const words = text.split(" ");
  // All words participate in layout from frame one. Opacity changes never reflow text.
  return (
    <span style={style}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span
            style={{
              opacity: p(
                t,
                start + (i / words.length) * duration,
                start + (i / words.length) * duration + 0.24,
              ),
            }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </span>
  );
}
export function Pointer({
  t,
  x,
  y,
  click = -100,
  opacity = 1,
}: {
  t: number;
  x: number;
  y: number;
  click?: number;
  opacity?: number;
}) {
  const pulse = p(t, click, click + 0.55),
    press = p(t, click, click + 0.1) * (1 - p(t, click + 0.18, click + 0.38));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 80,
        pointerEvents: "none",
        opacity,
        transform: `scale(${1 - press * 0.14})`,
        transformOrigin: "0 0",
      }}
    >
      {t >= click && t < click + 0.55 && (
        <div
          style={{
            position: "absolute",
            left: -12 - pulse * 24,
            top: -12 - pulse * 24,
            width: 32 + pulse * 48,
            height: 32 + pulse * 48,
            border: `1.5px solid ${C.ink}`,
            borderRadius: "50%",
            opacity: 1 - pulse,
          }}
        />
      )}
      <Cursor
        size={39}
        weight="fill"
        color={C.ink}
        style={{
          filter:
            "drop-shadow(1px 1px 0 #0b0a09) drop-shadow(-1px -1px 0 #0b0a09)",
        }}
      />
    </div>
  );
}
export function Rail({ schema = false }: { schema?: boolean }) {
  return (
    <aside
      style={{
        width: 88,
        flexShrink: 0,
        borderRight: line,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 34,
        paddingTop: 19,
      }}
    >
      <Mark size={42} />
      <div
        style={{ width: 30, height: 1, background: C.rule, margin: "3px 0" }}
      />
      {[Folder, Stack, Cpu].map((Icon, i) => (
        <Icon
          key={i}
          size={28}
          color={i === (schema ? 1 : 0) ? C.ink : C.muted}
        />
      ))}
      <GearSix
        size={28}
        color={C.muted}
        style={{ marginTop: "auto", marginBottom: 26 }}
      />
    </aside>
  );
}
export function Caption({
  t,
  items,
}: {
  t: number;
  items: Array<[number, number, string, string?]>;
}) {
  return (
    <div
      style={{ position: "absolute", left: 43, right: 43, top: 23, height: 54 }}
    >
      {items.map(([start, end, title, detail]) => (
        <div
          key={start}
          style={{
            position: "absolute",
            inset: 0,
            ...flex,
            justifyContent: "space-between",
            opacity: visible(t, start, end),
          }}
        >
          <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: -0.7 }}>
            {title}
          </span>
          <span style={{ fontSize: 22, color: C.muted }}>{detail}</span>
        </div>
      ))}
    </div>
  );
}
export function Button({
  children,
  pressed = false,
  style,
}: {
  children: ReactNode;
  pressed?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        ...flex,
        justifyContent: "center",
        gap: 12,
        padding: "14px 22px",
        fontSize: 24,
        fontWeight: 600,
        border: `1px solid ${C.ink}`,
        background: pressed ? C.bg : C.ink,
        color: pressed ? C.ink : C.bg,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
export function Shell({
  children,
  lane = "Grid",
  status = "Ready to explore",
  facts = "480 documents · 6 fields · schema v1",
  action,
  documentCount = 480,
}: {
  children: ReactNode;
  lane?: "Grid" | "Ask Lumos";
  status?: string;
  facts?: string;
  action?: ReactNode;
  documentCount?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: "92px 0 42px",
        borderTop: line,
        borderBottom: line,
        display: "flex",
        background: C.bg,
      }}
    >
      <Rail />
      <main style={{ flex: 1, position: "relative", minWidth: 0 }}>
        <div
          style={{
            height: 53,
            ...flex,
            gap: 18,
            padding: "0 38px",
            borderBottom: line,
            fontSize: 21,
            color: C.muted,
          }}
        >
          <span>Projects</span>
          <span style={{ color: C.faint }}>/</span>
          <span>Treatment response</span>
          <span style={{ marginLeft: 18 }}>{status}</span>
          <span style={{ marginLeft: "auto" }}>schema v1</span>
        </div>
        <div
          style={{
            height: 122,
            boxSizing: "border-box",
            padding: "21px 38px",
            ...flex,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 43,
                letterSpacing: -1.4,
                margin: 0,
                fontWeight: 600,
              }}
            >
              Treatment response
            </h1>
            <div style={{ fontSize: 23, color: C.muted, marginTop: 11 }}>
              {facts}
            </div>
          </div>
          {action}
        </div>
        <div
          style={{
            ...flex,
            height: 52,
            padding: "0 38px",
            gap: 41,
            borderBottom: line,
          }}
        >
          <div style={{ ...flex, gap: 11, fontSize: 23, color: C.muted }}>
            <SquaresFour size={25} />
            Overview
          </div>
          <div
            style={{
              ...flex,
              gap: 11,
              fontSize: 23,
              height: "100%",
              borderBottom:
                lane === "Grid"
                  ? `2px solid ${C.ink}`
                  : "2px solid transparent",
              color: lane === "Grid" ? C.ink : C.muted,
            }}
          >
            <Table size={25} />
            Grid{" "}
            {documentCount > 0 && (
              <span style={{ color: C.muted }}>{documentCount}</span>
            )}
          </div>
          <div
            style={{
              ...flex,
              gap: 11,
              fontSize: 23,
              height: "100%",
              borderBottom:
                lane === "Ask Lumos"
                  ? `2px solid ${C.ink}`
                  : "2px solid transparent",
              color: lane === "Ask Lumos" ? C.ink : C.muted,
            }}
          >
            <Mark size={25} />
            Ask Lumos
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
export function Composer({
  text,
  t,
  start = 0,
  duration = 1,
  busy = false,
  placeholder = false,
  sendAt = -100,
  style,
}: {
  text: string;
  t: number;
  start?: number;
  duration?: number;
  busy?: boolean;
  placeholder?: boolean;
  sendAt?: number;
  style?: CSSProperties;
}) {
  const pressed = t >= sendAt && t < sendAt + 0.35;
  return (
    <div
      style={{
        position: "absolute",
        left: 38,
        right: 38,
        bottom: 25,
        height: 77,
        border: line,
        padding: "0 14px 0 20px",
        ...flex,
        gap: 18,
        boxSizing: "border-box",
        background: C.bg,
        ...style,
      }}
    >
      <Mark size={33} />
      <div
        style={{
          fontSize: 24,
          flex: 1,
          lineHeight: 1.35,
          color: placeholder ? C.faint : C.ink,
        }}
      >
        {placeholder ? (
          text
        ) : (
          <Words text={text} t={t} start={start} duration={duration} />
        )}
      </div>
      <Paperclip size={25} color={C.muted} />
      <span style={{ fontSize: 21, color: C.muted }}>Deep</span>
      <div
        style={{
          width: 44,
          height: 44,
          display: "grid",
          placeItems: "center",
          border: `1px solid ${placeholder && !busy ? C.rule : C.ink}`,
          background: pressed || busy || placeholder ? C.bg : C.ink,
          color: busy || pressed ? C.ink : placeholder ? C.faint : C.bg,
        }}
      >
        {busy ? (
          <div
            style={{ width: 13, height: 13, border: `1.5px solid ${C.ink}` }}
          />
        ) : (
          <ArrowUp size={26} />
        )}
      </div>
    </div>
  );
}
export function Footer() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 14,
        right: 32,
        fontSize: 16,
        color: C.faint,
      }}
    >
      Synthetic demonstration · Illustrative results · Time condensed
    </div>
  );
}
export function Done({ children }: { children: ReactNode }) {
  return (
    <div style={{ ...flex, gap: 11, color: C.muted, fontSize: 22 }}>
      <Check size={23} />
      {children}
    </div>
  );
}
export interface StudyRow {
  patient_id: string;
  age: number;
  treatment: string;
  baseline_score: number;
  followup_score: number;
  followup_weeks: number;
  response: number;
}
export interface Study {
  n: number;
  trainN: number;
  testN: number;
  responseN: number;
  auc: number;
  aucCI: number[];
  brier: number;
  roc: number[][];
  coefficients: { label: string; or: number; low: number; high: number }[];
  rows: StudyRow[];
}
