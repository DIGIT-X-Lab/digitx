import React from "react";
import { PdfEvidence } from "./PdfEvidence";
import {
  ArrowRight,
  Check,
  Circle,
  Desktop,
  FilePdf,
  FileText,
  HardDrives,
  ShieldCheck,
  X,
} from "@phosphor-icons/react";
import { FilmOrb } from "../ProductScenes";
import {
  Button,
  C,
  Composer,
  Done,
  Mark,
  Pointer,
  Rail,
  Shell,
  Words,
  flex,
  lerp,
  line,
  p,
  visible,
  type Study,
} from "./FilmKit";

export function Onboarding({ t }: { t: number }) {
  const phase = t < 3.5 ? 0 : t < 6.6 ? 1 : 2;
  const phases = [
    {
      start: 0,
      end: 3.8,
      title: "Where should the AI run?",
      detail: "Your projects and documents stay on this computer.",
    },
    {
      start: 3.5,
      end: 6.9,
      title: "Checking your setup.",
      detail: "Your local AI is connected. Let’s check it can respond.",
    },
    {
      start: 6.6,
      end: 9.4,
      title: "Your workspace is ready.",
      detail: "Create a schema. Define what you need.",
    },
  ];
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: "92px 0 42px",
          borderTop: line,
          borderBottom: line,
          display: "flex",
        }}
      >
        <aside
          style={{
            width: 375,
            padding: "56px 48px",
            borderRight: line,
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          <div style={{ ...flex, gap: 19 }}>
            <Mark size={52} />
            <span
              style={{ fontSize: 38, fontWeight: 600, letterSpacing: -1.4 }}
            >
              Lumos
            </span>
          </div>
          <div style={{ marginTop: 97, fontSize: 23, color: C.muted }}>
            Set up your workspace
          </div>
          {["AI location", "Configuration", "Final checks"].map((label, i) => (
            <div
              key={label}
              style={{
                ...flex,
                gap: 22,
                marginTop: 34,
                fontSize: 25,
                color: i <= (phase ? 2 : 0) ? C.ink : C.muted,
              }}
            >
              <span style={{ width: 26, fontSize: 20, color: C.muted }}>
                {phase && i < 2 ? (
                  <Check size={24} />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              {label}
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              ...flex,
              gap: 11,
              fontSize: 21,
              color: C.muted,
            }}
          >
            <ShieldCheck size={26} />
            Workspace stays here
          </div>
        </aside>
        <div style={{ flex: 1, position: "relative", margin: "64px 90px" }}>
          {phases.map((ph, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                opacity: visible(t, ph.start, ph.end),
              }}
            >
              <h1
                style={{
                  fontSize: 50,
                  fontWeight: 600,
                  letterSpacing: -1.8,
                  margin: 0,
                }}
              >
                {ph.title}
              </h1>
              <p style={{ fontSize: 26, color: C.muted, marginTop: 22 }}>
                {ph.detail}
              </p>
              <div style={{ position: "absolute", right: 0, top: -20 }}>
                {i === 0 ? (
                  <FilmOrb frame={t * 30} size={112} state="composing" />
                ) : (
                  <Mark size={80} />
                )}
              </div>
              {i === 0 ? (
                <div style={{ marginTop: 57 }}>
                  {[
                    {
                      Icon: Desktop,
                      title: "On this computer",
                      body: "Run the AI using this computer’s graphics and memory.",
                    },
                    {
                      Icon: HardDrives,
                      title: "On another computer",
                      body: "Use your workstation, server, or cloud.",
                    },
                  ].map(({ Icon, title, body }, j) => {
                    const selected = j === 0 && t >= 1.2;
                    return (
                      <div
                        key={title}
                        style={{
                          ...flex,
                          gap: 25,
                          padding: "31px 28px",
                          border: `1px solid ${selected ? C.ink : C.rule}`,
                          background: selected ? "#1b1915" : "transparent",
                          marginBottom: 22,
                        }}
                      >
                        <Icon size={38} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 30, fontWeight: 600 }}>
                            {title}
                          </div>
                          <div
                            style={{
                              fontSize: 24,
                              color: C.muted,
                              marginTop: 12,
                            }}
                          >
                            {body}
                          </div>
                        </div>
                        <Circle
                          size={25}
                          weight={selected ? "fill" : "regular"}
                        />
                      </div>
                    );
                  })}
                  <div
                    style={{
                      ...flex,
                      justifyContent: "flex-end",
                      marginTop: 35,
                    }}
                  >
                    <Button pressed={t >= 2.9}>
                      Continue <ArrowRight size={25} />
                    </Button>
                  </div>
                </div>
              ) : i === 1 ? (
                <div style={{ marginTop: 56 }}>
                  {["Model files", "AI service", "Workspace connection"].map(
                    (label, j) => (
                      <div
                        key={label}
                        style={{
                          ...flex,
                          gap: 21,
                          height: 104,
                          borderBottom: line,
                          fontSize: 28,
                        }}
                      >
                        <span
                          style={{
                            width: 64,
                            height: 64,
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          {t > 4.15 + j * 0.6 ? (
                            <Check size={28} />
                          ) : t >= 3.55 + j * 0.6 ? (
                            <FilmOrb frame={t * 30} size={64} state="working" />
                          ) : (
                            <Circle size={22} color={C.muted} />
                          )}
                        </span>
                        <span>{label}</span>
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: 23,
                            color: C.muted,
                          }}
                        >
                          {t > 4.15 + j * 0.6
                            ? "Ready"
                            : t >= 3.55 + j * 0.6
                              ? "Checking…"
                              : "Waiting"}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div style={{ marginTop: 83 }}>
                  <div
                    style={{
                      ...flex,
                      gap: 33,
                      paddingBottom: 47,
                      borderBottom: line,
                    }}
                  >
                    <Mark size={109} />
                    <div>
                      <div style={{ fontSize: 36, fontWeight: 600 }}>
                        Ready when you are.
                      </div>
                      <div
                        style={{ fontSize: 26, color: C.muted, marginTop: 17 }}
                      >
                        One workspace, from records to results.
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 39 }}>
                    <Done>AI and workspace on this computer</Done>
                  </div>
                  <div
                    style={{
                      ...flex,
                      justifyContent: "flex-end",
                      marginTop: 75,
                    }}
                  >
                    <Button pressed={t >= 8.5}>
                      Open workspace <ArrowRight size={26} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Pointer
        t={t}
        x={lerp(1680, 1625, p(t, 0.55, 1.1))}
        y={lerp(490, 423, p(t, 0.55, 1.1))}
        click={1.2}
        opacity={visible(t, 0.5, 1.85)}
      />
      <Pointer
        t={t}
        x={lerp(1640, 1680, p(t, 2, 2.65))}
        y={lerp(440, 684, p(t, 2, 2.65))}
        click={2.9}
        opacity={visible(t, 1.95, 3.5)}
      />
      <Pointer
        t={t}
        x={lerp(1450, 1660, p(t, 7.65, 8.25))}
        y={lerp(860, 666, p(t, 7.65, 8.25))}
        click={8.5}
        opacity={visible(t, 7.65, 9.2)}
      />
    </>
  );
}

const fields = [
  ["Patient ID", "Text", "Participant identifier"],
  ["Age", "Number", "Age at baseline · years"],
  ["Treatment", "Text", "Recorded treatment group"],
  ["Baseline score", "Number", "Score before treatment"],
  ["Follow-up score", "Number", "Score at follow-up"],
  ["Follow-up weeks", "Number", "Weeks since baseline"],
];
export function Intake({ t, study }: { t: number; study: Study }) {
  const drag = p(t, 1.1, 3.2),
    release = p(t, 3.4, 4),
    ready = p(t, 4.25, 4.7),
    hover = p(t, 2.0, 2.6) * (1 - release);
  const dx = lerp(232, 1110, drag),
    dy = lerp(758, 565, drag);
  return (
    <>
      <Shell
        documentCount={t < 3.4 ? 0 : 480}
        status={
          t >= 6.5
            ? "Starting extraction"
            : t >= 4.2
              ? "Ready to extract"
              : "Add documents"
        }
        facts={
          t < 3.4
            ? "Add your reports to the project."
            : "480 documents · 6 fields · schema v1"
        }
        action={
          <div style={{ opacity: ready }}>
            <Button pressed={t >= 6.5}>
              Start extraction <ArrowRight size={24} />
            </Button>
          </div>
        }
      >
        <div
          style={{
            position: "absolute",
            top: 259,
            left: 38,
            right: 38,
            height: 330,
            border: `1.5px dashed ${hover > 0.3 ? C.ink : C.faint}`,
            background: `rgba(238,236,230,${hover * 0.045})`,
            opacity: 1 - release,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              transform: `translateY(${-hover * 20}px)`,
            }}
          >
            <div style={{ fontSize: 38, fontWeight: 600, letterSpacing: -1 }}>
              Drop PDFs or a folder
            </div>
            <div
              style={{
                fontSize: 25,
                color: C.muted,
                lineHeight: 1.5,
                marginTop: 20,
              }}
            >
              Folders are read all the way through.
              <br />
              Extraction starts when you are ready.
            </div>
            <div
              style={{
                fontSize: 23,
                color: C.muted,
                marginTop: 26,
                textDecoration: "underline",
                textUnderlineOffset: 7,
              }}
            >
              Browse PDFs <span style={{ margin: "0 17px" }}>or</span> choose a
              folder
            </div>
          </div>
        </div>
        <div style={{ margin: "0 38px", opacity: release }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 200px 210px",
              height: 54,
              alignItems: "center",
              padding: "0 22px",
              fontSize: 21,
              color: C.muted,
              borderBottom: line,
            }}
          >
            <span>Document</span>
            <span>Type</span>
            <span>Status</span>
          </div>
          {study.rows.map((r, i) => (
            <div
              key={r.patient_id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 200px 210px",
                height: 54,
                alignItems: "center",
                padding: "0 22px",
                borderBottom: line,
                opacity: p(t, 3.75 + i * 0.09, 4.1 + i * 0.09),
              }}
            >
              <div style={{ ...flex, gap: 20 }}>
                <span style={{ fontSize: 19, color: C.faint, width: 25 }}>
                  0{i + 1}
                </span>
                <FilePdf size={25} color={C.muted} />
                <span style={{ fontSize: 25 }}>
                  {r.patient_id}_followup.pdf
                </span>
              </div>
              <span style={{ fontSize: 23, color: C.muted }}>PDF</span>
              <Done>Ready</Done>
            </div>
          ))}
          <div
            style={{
              ...flex,
              justifyContent: "space-between",
              height: 80,
              opacity: ready,
            }}
          >
            <Done>480 PDFs added. Ready to extract.</Done>
            <span style={{ color: C.muted, fontSize: 22 }}>
              Showing 1–8 of 480 documents
            </span>
          </div>
        </div>
      </Shell>
      <div
        style={{
          position: "absolute",
          left: 159,
          top: 714,
          width: 420,
          height: 221,
          border: line,
          background: C.bg,
          opacity: 1 - release,
        }}
      >
        <div
          style={{
            padding: "17px 25px",
            borderBottom: line,
            fontSize: 22,
            color: C.muted,
          }}
        >
          Your files
        </div>
        <div
          style={{ opacity: 1 - drag * 0.8, padding: "25px", ...flex, gap: 20 }}
        >
          <FilePdf size={41} />
          <span style={{ fontSize: 26 }}>Research records</span>
        </div>
      </div>
      {[4, 3, 2, 1, 0].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: dx + i * 19 * drag,
            top: dy - i * 14 * drag,
            width: 342,
            height: 115,
            background: C.surface,
            border: `1px solid ${i === 0 ? C.muted : C.rule}`,
            transform: `rotate(${(i - 2) * 3.5 * drag * (1 - release)}deg) scale(${1 - release * 0.13})`,
            opacity: (i === 0 ? 1 : drag * 0.85) * (1 - release),
            ...flex,
            gap: 18,
            padding: "0 24px",
            boxSizing: "border-box",
            boxShadow: "0 14px 35px #0005",
          }}
        >
          <FilePdf size={41} />
          <div>
            <div style={{ fontSize: 25, fontWeight: 600 }}>
              Research records
            </div>
            <div style={{ fontSize: 21, color: C.muted, marginTop: 12 }}>
              480 PDFs
            </div>
          </div>
        </div>
      ))}
      <Pointer
        t={t}
        x={dx + 232}
        y={dy + 75}
        click={t < 3 ? 1.05 : 3.4}
        opacity={visible(t, 0.4, 4.1)}
      />
      <Pointer
        t={t}
        x={lerp(1380, 1770, p(t, 5.1, 6.15))}
        y={lerp(754, 190, p(t, 5.1, 6.15))}
        click={6.5}
        opacity={visible(t, 5.1, 7.3)}
      />
    </>
  );
}

export function Extraction({ t, study }: { t: number; study: Study }) {
  // Shared uninterrupted table geometry across processing, review and the Ask-tab click.
  const completed = Math.round(480 * p(t, 0.6, 5.6)),
    review = p(t, 8.0, 8.8) * (1 - p(t, 12.5, 13.1));
  const columns = "minmax(275px,1.55fr) .62fr 1.12fr .83fr .83fr .8fr .6fr";
  return (
    <>
      <Shell
        status={t < 5.7 ? "Extracting" : "Ready to explore"}
        facts={`${completed} of 480 documents · 6 fields · schema v1`}
        action={
          <div
            style={{
              ...flex,
              gap: 13,
              fontSize: 22,
              color: C.muted,
              marginTop: 13,
            }}
          >
            {t < 5.7 ? (
              <>
                <FilmOrb frame={t * 30} size={32} />
                Extracting
              </>
            ) : (
              <>
                <Check size={24} />
                Extraction complete
              </>
            )}
          </div>
        }
      >
        <div style={{ margin: "0 38px", opacity: 1 - review * 0.27 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: columns,
              alignItems: "center",
              height: 62,
              padding: "0 21px",
              borderBottom: line,
              fontSize: 21,
              color: C.muted,
            }}
          >
            {[
              "Document",
              "Age",
              "Treatment",
              "Baseline",
              "Follow-up",
              "Weeks",
              "Source",
            ].map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
          {study.rows.map((r, i) => {
            const at = 0.8 + i * 0.48,
              done = p(t, at, at + 0.6);
            return (
              <div
                key={r.patient_id}
                style={{
                  display: "grid",
                  gridTemplateColumns: columns,
                  alignItems: "center",
                  height: 61,
                  padding: "0 21px",
                  borderBottom: line,
                  position: "relative",
                  background: i === 0 && t > 7.8 ? "#1e1c17" : "transparent",
                  fontSize: 25,
                }}
              >
                <div style={{ ...flex, gap: 18 }}>
                  <span style={{ fontSize: 19, color: C.faint }}>0{i + 1}</span>
                  <span>{r.patient_id}_followup</span>
                </div>
                {[
                  r.age,
                  r.treatment,
                  r.baseline_score,
                  r.followup_score,
                  12,
                  "p. 1",
                ].map((value, j) => (
                  <div key={j} style={{ position: "relative", height: 30 }}>
                    <div
                      style={{
                        opacity: done,
                        textDecoration: j === 3 ? "underline" : undefined,
                        textUnderlineOffset: 7,
                        textDecorationColor: C.faint,
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 15,
                        width: Math.min(110, 60 + j * 10),
                        height: 2,
                        opacity: 1 - done,
                        background: C.rule,
                      }}
                    >
                      <div
                        style={{
                          width: `${p(t, at - 0.65, at + 0.2) * 100}%`,
                          height: 2,
                          background: C.muted,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
          <div
            style={{
              ...flex,
              gap: 14,
              height: 78,
              color: C.muted,
              fontSize: 22,
            }}
          >
            <Mark size={25} />
            <span>
              {t < 5.7
                ? "Reading reports and grounding extracted values"
                : "2,880 values extracted · 480 reports"}
            </span>
            <span style={{ marginLeft: "auto" }}>AI on this computer</span>
          </div>
        </div>
        <PdfEvidence t={t} opacity={review} />
      </Shell>
      <Pointer
        t={t}
        x={lerp(1140, 1370, p(t, 6.8, 7.65))}
        y={lerp(834, 411, p(t, 6.8, 7.65))}
        click={7.9}
        opacity={visible(t, 6.8, 9.1)}
      />
      <Pointer
        t={t}
        x={lerp(530, 211, p(t, 10.3, 10.95))}
        y={lerp(775, 911, p(t, 10.3, 10.95))}
        click={11.2}
        opacity={visible(t, 10.2, 11.8)}
      />
      <Pointer
        t={t}
        x={lerp(410, 182, p(t, 11.7, 12.15))}
        y={lerp(890, 350, p(t, 11.7, 12.15))}
        click={12.45}
        opacity={visible(t, 11.7, 13)}
      />
      <Pointer
        t={t}
        x={lerp(1340, 580, p(t, 12.7, 13.55))}
        y={lerp(576, 293, p(t, 12.7, 13.55))}
        click={13.75}
        opacity={p(t, 12.7, 13.1)}
      />
    </>
  );
}
