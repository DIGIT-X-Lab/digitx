import React from "react";
import {
  CaretDown,
  Check,
  DownloadSimple,
  FileText,
  ShieldCheck,
} from "@phosphor-icons/react";
import { FilmOrb } from "../ProductScenes";
import {
  C,
  Composer,
  Done,
  Mark,
  Pointer,
  Shell,
  Words,
  flex,
  lerp,
  line,
  p,
  visible,
  type Study,
} from "./FilmKit";

function Forest({ t, study }: { t: number; study: Study }) {
  const x = (v: number) => 470 + (Math.log(v / 0.4) / Math.log(4 / 0.4)) * 730;
  return (
    <svg viewBox="0 0 1450 310" width="100%" height={310}>
      {[0.5, 1, 2, 4].map((v) => (
        <g key={v}>
          <path
            d={`M${x(v)} 25V242`}
            stroke={v === 1 ? C.muted : C.rule}
            strokeDasharray={v === 1 ? "5 6" : undefined}
          />
          <text
            x={x(v)}
            y={273}
            fill={C.muted}
            textAnchor="middle"
            fontSize={22}
          >
            {v}
          </text>
        </g>
      ))}
      {study.coefficients.map((r, i) => {
        const reveal = p(t, 0.15 + i * 0.22, 1.05 + i * 0.22),
          yy = 62 + i * 74;
        return (
          <g key={r.label} opacity={reveal}>
            <text x={0} y={yy + 8} fill={C.ink} fontSize={26}>
              {r.label}
            </text>
            <path
              d={`M${lerp(x(r.or), x(r.low), reveal)} ${yy}H${lerp(x(r.or), x(r.high), reveal)}`}
              stroke={C.ink}
              strokeWidth={2.5}
            />
            <path
              d={`M${x(r.low)} ${yy - 9}V${yy + 9}M${x(r.high)} ${yy - 9}V${yy + 9}`}
              stroke={C.muted}
              strokeWidth={2}
            />
            <circle cx={x(r.or)} cy={yy} r={7} fill={C.ink} />
            <text x={1310} y={yy + 7} fill={C.ink} fontSize={23}>
              {r.or.toFixed(2)}
            </text>
          </g>
        );
      })}
      <text x={800} y={308} fill={C.muted} fontSize={20} textAnchor="middle">
        Adjusted odds ratio · 95% confidence interval
      </text>
    </svg>
  );
}
export function ROC({
  study,
  t,
  mini = false,
}: {
  study: Study;
  t: number;
  mini?: boolean;
}) {
  const left = mini ? 20 : 115,
    top = mini ? 12 : 16,
    w = mini ? 420 : 530,
    h = mini ? 240 : 220;
  const path = study.roc
    .map(([a, b], i) => `${i ? "L" : "M"}${left + a * w} ${top + (1 - b) * h}`)
    .join(" ");
  return (
    <svg
      width="100%"
      height={mini ? 270 : 315}
      viewBox={`0 0 ${mini ? 470 : 1450} ${mini ? 270 : 315}`}
    >
      {!mini &&
        [0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <path
              d={`M${left} ${top + (1 - v) * h}H${left + w}`}
              stroke={C.rule}
            />
            <text
              x={left - 20}
              y={top + (1 - v) * h + 7}
              textAnchor="end"
              fontSize={20}
              fill={C.muted}
            >
              {v === 0 ? "0" : v === 1 ? "1" : v}
            </text>
            <text
              x={left + v * w}
              y={top + h + 31}
              textAnchor="middle"
              fontSize={20}
              fill={C.muted}
            >
              {v === 0 ? "0" : v === 1 ? "1" : v}
            </text>
          </g>
        ))}
      <path
        d={`M${left} ${top}V${top + h}H${left + w}`}
        fill="none"
        stroke={C.faint}
      />
      <path
        d={`M${left} ${top + h}L${left + w} ${top}`}
        stroke={C.faint}
        strokeDasharray="6 8"
      />
      <path
        d={path}
        stroke={C.ink}
        strokeWidth={mini ? 3 : 3.7}
        fill="none"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p(t, 0, 1.8)}
      />
      {!mini && (
        <>
          <text
            x={left + w / 2}
            y={top + h + 67}
            textAnchor="middle"
            fontSize={21}
            fill={C.muted}
          >
            False positive rate
          </text>
          <text
            transform={`translate(18 ${top + h / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize={21}
            fill={C.muted}
          >
            True positive rate
          </text>
          <g opacity={p(t, 0.8, 1.45)}>
            <text x={845} y={66} fontSize={25} fill={C.muted}>
              HELD-OUT PATIENTS
            </text>
            <text
              x={842}
              y={160}
              fontSize={105}
              fontWeight={600}
              letterSpacing={-5}
              fill={C.ink}
            >
              {study.auc.toFixed(2)}
            </text>
            <text x={1120} y={160} fontSize={29} fill={C.muted}>
              ROC AUC
            </text>
            <text x={847} y={204} fontSize={25} fill={C.muted}>
              95% bootstrap CI {study.aucCI[0].toFixed(2)}–
              {study.aucCI[1].toFixed(2)}
            </text>
            <path d="M847 225H1390" stroke={C.rule} />
            <text x={847} y={260} fontSize={26} fill={C.ink}>
              360 to train. 120 to test.
            </text>
            <text x={847} y={298} fontSize={22} fill={C.muted}>
              Brier score {study.brier.toFixed(3)} · Synthetic cohort
            </text>
          </g>
        </>
      )}
    </svg>
  );
}

function AssistantIdentity({ t }: { t: number }) {
  const working =
    1 - p(t, 6.95, 7.19) + p(t, 15.1, 15.34) * (1 - p(t, 16.5, 16.74));
  return (
    <>
      <div
        style={{
          position: "absolute",
          opacity: working,
          transform: `scale(${0.55 + working * 0.45})`,
        }}
      >
        <FilmOrb frame={t * 30} size={73} state="solving" />
      </div>
      <div
        style={{
          position: "absolute",
          opacity: 1 - working,
          transform: `scale(${1 - working * 0.3})`,
        }}
      >
        <Mark size={43} />
      </div>
    </>
  );
}

export function Research({ t: clock, study }: { t: number; study: Study }) {
  // Two quiet seconds introduce the assistant; the approved analysis keeps its timing.
  const t = clock - 2;
  const first =
    "Define response as ≥25% score reduction. Which baseline factors predict it?";
  const second = "How well does it predict in held-out patients?";
  const initial = 1 - p(t, 2.75, 3.3),
    code = visible(t, 3.1, 7.1),
    forest = p(t, 6.9, 7.3) * (1 - p(t, 14.75, 15.05)),
    follow = p(t, 15.1, 15.4) * (1 - p(t, 16.35, 16.6)),
    roc = p(t, 16.65, 17.05);
  const sending = t < 3 ? 2.8 : 14.75;
  return (
    <>
      <Shell
        lane="Ask Lumos"
        facts="480 documents · 2,880 extracted values · Ready to explore"
      >
        <div
          style={{
            position: "absolute",
            top: 259,
            left: 125,
            right: 90,
            height: 470,
            opacity: initial,
          }}
        >
          <div style={{ ...flex, gap: 26, marginTop: 30 }}>
            <Mark size={92} />
            <h2 style={{ fontSize: 47, letterSpacing: -1.5, margin: 0 }}>
              Hi, I’m Lumos.
            </h2>
          </div>
          <div
            style={{
              fontSize: 28,
              color: C.muted,
              lineHeight: 1.75,
              marginTop: 35,
            }}
          >
            Your research companion.
            <br />
            Explore your data. Run an analysis. Test an idea.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 125,
            right: 74,
            top: 248,
            opacity: p(t, 2.85, 3.3) * (1 - p(t, 14.75, 15.05)),
          }}
        >
          <div style={{ fontSize: 20, color: C.muted, marginBottom: 12 }}>
            You
          </div>
          <div style={{ fontSize: 27, fontWeight: 600 }}>{first}</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 341,
            width: 65,
            height: 75,
            display: "grid",
            placeItems: "center",
            opacity: p(t, 3, 3.4),
          }}
        >
          <AssistantIdentity t={t} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 125,
            right: 95,
            top: 351,
            opacity: code,
          }}
        >
          <div style={{ fontSize: 28 }}>Running Python</div>
          <div style={{ fontSize: 23, color: C.muted, marginTop: 16 }}>
            Define the endpoint. Fit the model. Keep 120 patients held out.
          </div>
          <div
            style={{
              ...flex,
              gap: 10,
              fontFamily: "monospace",
              fontSize: 20,
              color: C.muted,
              marginTop: 29,
            }}
          >
            <CaretDown size={20} />
            SHOW THE CODE{" "}
            <span style={{ marginLeft: 14 }}>Python · analysis excerpt</span>
          </div>
          <pre
            style={{
              fontFamily: "Menlo, monospace",
              fontSize: 21,
              lineHeight: 1.8,
              background: C.surface,
              borderTop: line,
              padding: "19px 26px",
              marginTop: 13,
              color: C.ink,
            }}
          >
            {
              "response = (baseline - followup) / baseline >= 0.25\ntrain, test = train_test_split(patient_ids, test_size=0.25, stratify=response, random_state=42)\nmodel = sm.Logit(response.loc[train], X.loc[train]).fit()\npredictions = model.predict(X.loc[test])"
            }
          </pre>
          <div style={{ opacity: p(t, 5.7, 6.2) }}>
            <Done>
              Endpoint derived from observations · Patient-level split
            </Done>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 125,
            right: 95,
            top: 350,
            opacity: forest,
          }}
        >
          <div style={{ fontSize: 33, fontWeight: 600, letterSpacing: -0.8 }}>
            Factors associated with response.
          </div>
          <div style={{ fontSize: 23, color: C.muted, marginTop: 12 }}>
            334 of 480 meet the study’s endpoint. Model fitted on 360 training
            patients.
          </div>
          <div style={{ borderTop: line, marginTop: 22, paddingTop: 8 }}>
            <Forest t={t - 7.2} study={study} />
          </div>
          <div
            style={{
              ...flex,
              justifyContent: "space-between",
              fontSize: 21,
              color: C.muted,
              marginTop: 13,
            }}
          >
            <span>
              Adjusted for age, baseline score and treatment. Association, not
              causation.
            </span>
            <span>
              Show the code <span style={{ marginLeft: 15 }}>1 run</span>
            </span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 125,
            right: 95,
            top: 250,
            opacity: p(t, 15.1, 15.45),
          }}
        >
          <div style={{ fontSize: 20, color: C.muted, marginBottom: 12 }}>
            You
          </div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>
            <Words text={second} t={t} start={15.1} duration={0.4} />
          </div>
        </div>
        <div
          style={{ position: "absolute", left: 125, top: 355, opacity: follow }}
        >
          <div style={{ fontSize: 28 }}>Evaluating on held-out patients</div>
          <div style={{ fontSize: 24, color: C.muted, marginTop: 19 }}>
            120 patients. No overlap with training data.
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 7 }}>
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: 38,
                  height: 90,
                  background: i < 18 ? C.faint : C.ink,
                  opacity: p(t, 15.1 + i * 0.035, 15.4 + i * 0.035),
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "810px 270px",
              fontSize: 22,
              color: C.muted,
              marginTop: 18,
            }}
          >
            <span>360 training</span>
            <span>120 held out</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 125,
            right: 95,
            top: 349,
            opacity: roc,
          }}
        >
          <div style={{ ...flex, justifyContent: "space-between" }}>
            <div style={{ fontSize: 33, fontWeight: 600, letterSpacing: -0.8 }}>
              A prediction you can evaluate.
            </div>
            <div
              style={{
                ...flex,
                gap: 10,
                padding: "8px 14px",
                width: 202,
                height: 44,
                boxSizing: "border-box",
                justifyContent: "center",
                flexShrink: 0,
                whiteSpace: "nowrap",
                fontSize: 21,
                border: line,
                background: t >= 21.3 ? C.ink : "transparent",
                color: t >= 21.3 ? C.bg : C.muted,
              }}
            >
              {t >= 21.3 ? (
                <>
                  <Check size={22} />
                  Figure saved
                </>
              ) : (
                <>
                  <DownloadSimple size={23} />
                  Save figure
                </>
              )}
            </div>
          </div>
          <div style={{ fontSize: 23, color: C.muted, marginTop: 12 }}>
            ROC curve · held-out evaluation · fictional research demonstration
          </div>
          <div style={{ borderTop: line, marginTop: 15, paddingTop: 7 }}>
            <ROC study={study} t={t - 16.7} />
          </div>
          <div
            style={{
              ...flex,
              justifyContent: "space-between",
              fontSize: 20,
              color: C.muted,
            }}
          >
            <span>
              Internal hold-out evaluation. External validation is still needed.
            </span>
            <span>Show the code · 2 runs</span>
          </div>
        </div>
        <Composer
          t={t}
          text={
            t < 3
              ? first
              : t < 11.5
                ? "Ask a follow-up question…"
                : t < 15.1
                  ? second
                  : ""
          }
          placeholder={t >= 3 && (t < 11.5 || t >= 15.1)}
          start={t < 3 ? 0.35 : 11.5}
          duration={t < 3 ? 1.8 : 1}
          busy={(t >= 3 && t < 7) || (t >= 15.1 && t < 16.65)}
          sendAt={sending}
        />
      </Shell>
      <Pointer
        t={t}
        x={lerp(1710, 1835, p(t, 1.9, 2.55))}
        y={lerp(880, 963, p(t, 1.9, 2.55))}
        click={2.8}
        opacity={visible(t, 1.8, 3.5)}
      />
      <Pointer
        t={t}
        x={lerp(1770, 1835, p(t, 13.75, 14.4))}
        y={lerp(904, 963, p(t, 13.75, 14.4))}
        click={14.75}
        opacity={visible(t, 13.7, 15.5)}
      />
      <Pointer
        t={t}
        x={lerp(1590, 1737, p(t, 19.8, 20.85))}
        y={lerp(784, 462, p(t, 19.8, 20.85))}
        click={21.3}
        opacity={visible(t, 19.8, 22.9)}
      />
    </>
  );
}

export function Wider({ t, study }: { t: number; study: Study }) {
  const draw = p(t, 0.6, 2.2);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "108px 130px",
        opacity: p(t, 0, 0.55) * (1 - p(t, 5.7, 6)),
      }}
    >
      <div style={{ fontSize: 66, fontWeight: 600, letterSpacing: -2.5 }}>
        One workflow. Many questions.
      </div>
      <div style={{ fontSize: 29, color: C.muted, marginTop: 24 }}>
        Adapt the schema. Follow the question across healthcare.
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 61,
          marginTop: 95,
        }}
      >
        <div>
          <div style={{ fontSize: 31, fontWeight: 600, marginBottom: 15 }}>
            Research
          </div>
          <div style={{ fontSize: 24, color: C.muted }}>
            What predicts response?
          </div>
          <div style={{ borderTop: line, marginTop: 28, paddingTop: 30 }}>
            <ROC mini study={study} t={t - 1} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 31, fontWeight: 600, marginBottom: 15 }}>
            Clinical quality
          </div>
          <div style={{ fontSize: 24, color: C.muted }}>
            Where does follow-up break down?
          </div>
          <svg
            viewBox="0 0 470 290"
            width="100%"
            style={{ borderTop: line, marginTop: 28, paddingTop: 30 }}
          >
            {[
              ["Referral", 0.93],
              ["Visit", 0.74],
              ["Follow-up", 0.55],
            ].map(([label, value], i) => (
              <g key={label}>
                <text x={0} y={43 + i * 85} fill={C.muted} fontSize={21}>
                  {label}
                </text>
                <path
                  d={`M0 ${62 + i * 85}H460`}
                  stroke={C.rule}
                  strokeWidth={10}
                />
                <path
                  d={`M0 ${62 + i * 85}H${460 * Number(value) * draw}`}
                  stroke={i === 2 ? C.ink : C.muted}
                  strokeWidth={10}
                />
              </g>
            ))}
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 31, fontWeight: 600, marginBottom: 15 }}>
            Operations
          </div>
          <div style={{ fontSize: 24, color: C.muted }}>
            What extends a hospital stay?
          </div>
          <svg
            viewBox="0 0 470 290"
            width="100%"
            style={{ borderTop: line, marginTop: 28, paddingTop: 30 }}
          >
            <path d="M15 238H455" stroke={C.faint} />
            {[24, 46, 89, 149, 213, 190, 122, 78, 44, 22, 12].map((h, i) => (
              <rect
                key={i}
                x={20 + i * 39}
                y={238 - h * draw}
                width={24}
                height={h * draw}
                fill={i < 4 ? C.muted : C.ink}
              />
            ))}
            <text
              x={230}
              y={278}
              textAnchor="middle"
              fill={C.muted}
              fontSize={21}
            >
              Length of stay
            </text>
          </svg>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 155,
          left: 130,
          right: 130,
          borderTop: line,
          paddingTop: 31,
          ...flex,
          justifyContent: "space-between",
          fontSize: 28,
          color: C.muted,
        }}
      >
        <span>Oncology</span>
        <span>Cardiology</span>
        <span>Neurology</span>
        <span>Your field.</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 65,
          left: 130,
          fontSize: 18,
          color: C.faint,
        }}
      >
        Illustrative research, quality and operations questions. Adapt to the
        study and its data.
      </div>
    </div>
  );
}
