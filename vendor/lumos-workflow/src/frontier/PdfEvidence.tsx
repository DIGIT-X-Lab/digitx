import React from "react";
import { staticFile } from "remotion";
import { Check } from "@phosphor-icons/react";
import { C, flex, line, p } from "./FilmKit";

/** VerifyReport's field ledger, document pane and native proven-evidence tint. */
export function PdfEvidence({ t, opacity }: { t: number; opacity: number }) {
  const scale = 380 / 420,
    highlight = p(t, 8.6, 9.05),
    verified = t >= 11.2;
  const rows = [
    ["patient_id", "SYN-001"],
    ["age", "36"],
    ["treatment", "Enhanced care"],
    ["baseline_score", "55.0"],
    ["followup_score", "40.9"],
    ["followup_weeks", "12"],
  ];
  return (
    <div
      style={{
        position: "absolute",
        inset: "228px 0 0",
        padding: "18px 38px",
        background: C.bg,
        opacity,
      }}
    >
      <div style={{ ...flex, gap: 15, height: 38, fontSize: 19 }}>
        <span
          style={{
            border: line,
            padding: "8px 14px",
            background: t >= 12.15 ? C.surface : C.bg,
          }}
        >
          ← all reports
        </span>
        <span style={{ border: line, padding: "8px 14px" }}>
          Why Lumos chose this &nbsp;{" "}
          <span style={{ color: C.muted }}>Space</span>
        </span>
        <span style={{ marginLeft: "auto", color: C.muted }}>
          start of reports &nbsp;&nbsp; 1 / 480 &nbsp;&nbsp; next report →
        </span>
      </div>
      <div
        style={{
          ...flex,
          justifyContent: "space-between",
          height: 55,
          fontSize: 21,
        }}
      >
        <span style={{ fontFamily: "monospace" }}>
          SYN-001_followup.pdf{" "}
          <span style={{ fontFamily: "Inter", color: C.muted }}>
            {" "}
            &nbsp; · follow-up report
          </span>
        </span>
        <span style={{ color: C.muted }}>6 proven · 0 need you · 0 absent</span>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr .95fr", gap: 34 }}
      >
        <div>
          <div
            style={{
              fontSize: 17,
              letterSpacing: 2,
              color: C.muted,
              margin: "14px 0",
            }}
          >
            EXTRACTED FIELDS
          </div>
          {rows.map(([key, value], i) => (
            <div
              key={key}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 220px 90px",
                alignItems: "center",
                height: 66,
                borderTop: line,
                borderBottom: i === 5 ? line : undefined,
                borderLeft: `2px solid ${i === 4 ? C.ink : "transparent"}`,
                padding: "0 16px",
                background: i === 4 ? "#1b1a16" : "transparent",
              }}
            >
              <span style={{ fontFamily: "monospace", fontSize: 21 }}>
                {key}
              </span>
              <span style={{ fontSize: 25, fontWeight: i === 4 ? 600 : 400 }}>
                {value}
              </span>
              <span
                style={{
                  fontSize: 18,
                  color: i === 4 && verified ? "#a4c7b0" : C.muted,
                }}
              >
                {i === 4 && verified ? "verified" : "proven"}
              </span>
            </div>
          ))}
          <div style={{ ...flex, gap: 24, marginTop: 22, fontSize: 19 }}>
            <span
              style={{
                display: "grid",
                gridTemplateColumns: "19px 1fr 18px",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                width: 244,
                height: 42,
                flexShrink: 0,
                whiteSpace: "nowrap",
                lineHeight: "24px",
                boxSizing: "border-box",
                border: line,
                background: verified ? C.ink : "transparent",
                color: verified ? C.bg : C.ink,
              }}
            >
              <Check size={19} style={{ opacity: verified ? 1 : 0 }} />
              <span>Verify original</span>
              <span>A</span>
            </span>
            <span>Edit value &nbsp; E</span>
            <span>Unsure &nbsp; F</span>
            <span>Undo &nbsp; U</span>
          </div>
          <div style={{ marginTop: 22, fontSize: 18, color: C.muted }}>
            ↑ ↓ move between fields &nbsp; · &nbsp; Esc returns to all reports
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            background: "#13120f",
            border: line,
            height: 574,
            paddingTop: 10,
          }}
        >
          <div
            style={{
              width: 380,
              height: 595 * scale,
              position: "relative",
              background: "white",
              boxShadow: "0 4px 25px #0004",
            }}
          >
            <img
              src={staticFile("source-report.png")}
              style={{ width: "100%", height: "100%" }}
            />
            <div
              style={{
                position: "absolute",
                left: 26 * scale,
                top: 282 * scale,
                width: 368 * scale,
                height: 34 * scale,
                background: "oklch(0.84 0.09 152 / 0.30)",
                boxShadow: "0 0 0 1px oklch(0.58 0.10 152 / 0.42)",
                opacity: highlight,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 18 * scale,
                top: 282 * scale,
                width: 3,
                height: 34 * scale,
                background: "oklch(0.54 0.11 152)",
                opacity: highlight,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 7,
              fontSize: 16,
              color: C.muted,
            }}
          >
            Original PDF · Page 1 of 1
          </div>
        </div>
      </div>
    </div>
  );
}
