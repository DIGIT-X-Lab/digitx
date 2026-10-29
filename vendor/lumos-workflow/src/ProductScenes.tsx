import React, {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  MODE_FRAMES,
  paintFrame,
  resolvePreset,
  type OrbState,
} from "thinking-orbs/engine";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  ArrowRight,
  ArrowUp,
  Check,
  CheckSquare,
  Circle,
  Cpu,
  Cursor,
  Desktop,
  DownloadSimple,
  FileText,
  Folder,
  GearSix,
  HardDrives,
  Paperclip,
  Pause,
  ShieldCheck,
  SquaresFour,
  Stack,
  Table,
} from "@phosphor-icons/react";

/** Film-only reconstructions. All documents, values and timings are fictional. */
export const SETUP_DURATION = 360;
export const EXTRACT_DURATION = 420;
export const ASK_DURATION = 480;

const c = {
  bg: "#0b0a09",
  surface: "#11100e",
  ink: "#eeece6",
  muted: "#aaa69e",
  rule: "#302d28",
  faint: "#68645d",
  amber: "#d5aa67",
};
const clamp = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
const ease = (n: number) => 1 - Math.pow(1 - n, 3);
const enter = (frame: number, start = 0, length = 18): CSSProperties => ({
  opacity: clamp(frame, start, start + length),
  transform: `translateY(${(1 - ease(clamp(frame, start, start + length))) * 12}px)`,
});
const rule = `1px solid ${c.rule}`;
const common: CSSProperties = {
  fontFamily: "Inter, sans-serif",
  color: c.ink,
  background: c.bg,
  fontWeight: 400,
  fontVariantNumeric: "tabular-nums",
  boxSizing: "border-box",
};
const row: CSSProperties = { display: "flex", alignItems: "center" };

function Mark({ size = 42, style }: { size?: number; style?: CSSProperties }) {
  return (
    <Img
      src={staticFile("lumos-logo.svg")}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        filter: "grayscale(1) brightness(0) invert(0.93)",
        ...style,
      }}
    />
  );
}

/** The desktop's orb engine and presets, sampled on the film clock. */
export function FilmOrb({
  frame,
  size = 100,
  state = "solving",
}: {
  frame: number;
  size?: number;
  state?: OrbState;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pixels = Math.round(size * 2);
  useLayoutEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    const preset = resolvePreset(state, 64);
    context.setTransform(pixels / 64, 0, 0, pixels / 64, 0, 0);
    context.clearRect(0, 0, 64, 64);
    paintFrame(
      context,
      MODE_FRAMES[preset.mode](64, (frame / 30) * preset.speed, preset.opts),
      true,
      state === "solving"
        ? { r: 235, g: 232, b: 223 }
        : { r: 233, g: 228, b: 218 },
    );
  }, [frame, pixels, state]);
  return (
    <canvas
      ref={canvas}
      width={pixels}
      height={pixels}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

function FilmPointer({
  frame,
  clickAt,
  style,
}: {
  frame: number;
  clickAt: number;
  style?: CSSProperties;
}) {
  if (frame < clickAt - 26 || frame >= clickAt + 12) return null;
  const arrival = ease(clamp(frame, clickAt - 26, clickAt - 5));
  const pulse = clamp(frame, clickAt, clickAt + 12);
  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        zIndex: 20,
        width: 43,
        height: 50,
        opacity: clamp(frame, clickAt - 26, clickAt - 20) * (1 - pulse),
        transform: `translate(${(1 - arrival) * 55}px, ${(1 - arrival) * 65}px)`,
        ...style,
      }}
    >
      {frame >= clickAt && (
        <span
          style={{
            position: "absolute",
            left: -9 - pulse * 16,
            top: -9 - pulse * 16,
            width: 28 + pulse * 32,
            height: 28 + pulse * 32,
            border: `2px solid ${c.ink}`,
            borderRadius: "50%",
            opacity: 1 - pulse,
          }}
        />
      )}
      <Cursor
        size={43}
        weight="fill"
        color={c.ink}
        style={{
          filter:
            "drop-shadow(1px 1px 0 #0b0a09) drop-shadow(-1px -1px 0 #0b0a09)",
        }}
      />
    </div>
  );
}

function Primary({
  children,
  width,
  frame,
  clickAt,
}: {
  children: ReactNode;
  width?: number;
  frame?: number;
  clickAt?: number;
}) {
  return (
    <div
      style={{
        ...row,
        justifyContent: "center",
        gap: 16,
        width,
        padding: "18px 26px",
        background: c.ink,
        color: c.bg,
        fontSize: 25,
        fontWeight: 600,
        position: "relative",
      }}
    >
      {children}
      <ArrowRight size={25} />
      {frame !== undefined && clickAt !== undefined && (
        <FilmPointer
          frame={frame}
          clickAt={clickAt}
          style={{ right: 50, top: 25 }}
        />
      )}
    </div>
  );
}

function Scene({ children }: { children: ReactNode }) {
  return <AbsoluteFill style={common}>{children}</AbsoluteFill>;
}

function SetupRow({
  label,
  detail,
  done,
  live = false,
}: {
  label: string;
  detail?: string;
  done: boolean;
  live?: boolean;
}) {
  return (
    <div style={{ ...row, gap: 20, padding: "24px 0", borderBottom: rule }}>
      <span
        style={{ color: done ? c.ink : live ? c.amber : c.faint, width: 28 }}
      >
        {done ? (
          <Check size={28} />
        ) : (
          <Circle size={25} weight={live ? "fill" : "regular"} />
        )}
      </span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 27,
            fontWeight: 500,
            color: live ? c.amber : c.ink,
          }}
        >
          {label}
        </div>
        {detail && (
          <div style={{ fontSize: 23, marginTop: 7, color: c.muted }}>
            {detail}
          </div>
        )}
      </div>
      <span
        style={{
          fontSize: 23,
          color: done ? c.muted : live ? c.amber : c.faint,
        }}
      >
        {done ? "Ready" : live ? "Checking" : "Waiting"}
      </span>
    </div>
  );
}

export function SetupScene() {
  const f = useCurrentFrame();
  const phase = f < 78 ? 0 : f < 144 ? 1 : f < 257 ? 2 : f < 316 ? 3 : 4;
  const start = [0, 78, 144, 257, 316][phase];
  const progress = Math.round(ease(clamp(f, 153, 245)) * 100);
  const titles = [
    "Where should the AI run?",
    "A fit for your server.",
    "Preparing AI on your server.",
    "Checking your setup.",
    "Your AI server is ready.",
  ];
  const descriptions = [
    "Your projects and documents stay on this computer.",
    "Review the hardware and AI configuration.",
    "Files download directly to the server.",
    "A few checks confirm that everything can respond.",
    "Lumos is connected. You can start working.",
  ];
  const currentStep = phase === 0 ? 0 : phase === 1 ? 1 : 2;
  return (
    <Scene>
      <div
        style={{
          position: "absolute",
          left: 130,
          top: 115,
          width: 1660,
          height: 850,
          border: rule,
          display: "flex",
        }}
      >
        <aside
          style={{
            width: 338,
            borderRight: rule,
            padding: "47px 39px",
            flexShrink: 0,
          }}
        >
          <div style={{ ...row, gap: 18 }}>
            <Mark size={49} />
            <span
              style={{ fontSize: 35, letterSpacing: "-1.2px", fontWeight: 600 }}
            >
              Lumos
            </span>
          </div>
          <div style={{ marginTop: 90, color: c.muted, fontSize: 23 }}>
            Set up your workspace
          </div>
          <div style={{ marginTop: 36 }}>
            {["AI location", "Configuration", "Final checks"].map(
              (label, index) => (
                <div
                  key={label}
                  style={{
                    ...row,
                    gap: 20,
                    marginBottom: 35,
                    color: index === currentStep ? c.ink : c.muted,
                    fontSize: 24,
                    fontWeight: index === currentStep ? 600 : 400,
                  }}
                >
                  <span
                    style={{
                      fontSize: 21,
                      width: 28,
                      color: index < currentStep ? c.ink : c.faint,
                    }}
                  >
                    {index < currentStep ? (
                      <Check size={24} />
                    ) : (
                      `0${index + 1}`
                    )}
                  </span>
                  {label}
                </div>
              ),
            )}
          </div>
          <div
            style={{
              position: "absolute",
              left: 40,
              bottom: 42,
              color: c.muted,
              fontSize: 21,
              ...row,
              gap: 12,
            }}
          >
            <ShieldCheck size={25} /> Workspace stays here
          </div>
        </aside>
        <main style={{ padding: "69px 70px", flex: 1, position: "relative" }}>
          <div style={{ ...enter(f, start, 12), height: 166 }}>
            <h1
              style={{
                fontSize: 47,
                lineHeight: 1.13,
                letterSpacing: "-1.7px",
                fontWeight: 600,
                margin: 0,
                maxWidth: 940,
              }}
            >
              {titles[phase]}
            </h1>
            <p
              style={{
                fontSize: 25,
                color: c.muted,
                margin: "20px 0 0",
                maxWidth: 870,
              }}
            >
              {descriptions[phase]}
            </p>
          </div>
          {phase === 0 && (
            <div style={enter(f, start + 8, 18)}>
              {[
                {
                  icon: Desktop,
                  title: "On this computer",
                  body: "Run the AI using this computer’s graphics and memory.",
                  selected: false,
                },
                {
                  icon: HardDrives,
                  title: "On another computer",
                  body: "Use your workstation, server, or cloud.",
                  selected: true,
                },
              ].map(({ icon: Icon, title, body, selected }) => (
                <div
                  key={title}
                  style={{
                    ...row,
                    gap: 23,
                    border: `1px solid ${selected ? c.muted : c.rule}`,
                    padding: "28px 25px",
                    marginBottom: 18,
                    background: selected ? "#171511" : "transparent",
                  }}
                >
                  <Icon size={35} weight="regular" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 29, fontWeight: 600 }}>{title}</div>
                    <div
                      style={{
                        fontSize: 23,
                        lineHeight: 1.4,
                        color: c.muted,
                        marginTop: 10,
                      }}
                    >
                      {body}
                    </div>
                  </div>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      border: `1px solid ${selected ? c.ink : c.faint}`,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {selected && (
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: c.ink,
                        }}
                      />
                    )}
                  </span>
                </div>
              ))}
              <div
                style={{ ...row, justifyContent: "flex-end", marginTop: 32 }}
              >
                <Primary frame={f} clickAt={74}>
                  Continue
                </Primary>
              </div>
              <p style={{ fontSize: 22, color: c.muted, marginTop: 32 }}>
                You can change this later in AI settings.
              </p>
            </div>
          )}
          {phase === 1 && (
            <div style={enter(f, start, 15)}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr 1fr",
                  borderTop: rule,
                  borderBottom: rule,
                  padding: "27px 0",
                  gap: 25,
                }}
              >
                {[
                  ["Computer", "DGX Spark"],
                  ["Memory", "128 GB"],
                  ["Hardware check", "Passed"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: 22, color: c.muted }}>{label}</div>
                    <div
                      style={{ fontSize: 30, marginTop: 12, fontWeight: 500 }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "36px 0 30px" }}>
                <div style={{ fontSize: 34, fontWeight: 600 }}>Qwen3.8 27B</div>
                <div style={{ fontSize: 25, color: c.muted, marginTop: 13 }}>
                  For document extraction and Ask Lumos.
                </div>
                <div style={{ fontSize: 22, color: c.muted, marginTop: 20 }}>
                  Research configuration for one DGX Spark.
                </div>
              </div>
              <div
                style={{ ...row, justifyContent: "flex-end", marginTop: 14 }}
              >
                <Primary frame={f} clickAt={140}>
                  Install and connect
                </Primary>
              </div>
              <p
                style={{
                  fontSize: 22,
                  lineHeight: 1.5,
                  color: c.muted,
                  marginTop: 29,
                  maxWidth: 900,
                }}
              >
                Projects stay on this computer. Content sent for extraction
                <br />
                or Ask Lumos is processed on your server.
              </p>
            </div>
          )}
          {phase === 2 && (
            <div style={enter(f, start, 15)}>
              <div
                style={{
                  ...row,
                  justifyContent: "space-between",
                  marginBottom: 25,
                }}
              >
                <div>
                  <div style={{ fontSize: 30, fontWeight: 500 }}>
                    Downloading model files
                  </div>
                  <div style={{ fontSize: 23, color: c.muted, marginTop: 14 }}>
                    Qwen3.8 27B
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 58,
                    fontWeight: 500,
                    letterSpacing: "-2px",
                    color: progress < 100 ? c.amber : c.ink,
                  }}
                >
                  {progress}
                  <span style={{ fontSize: 28, letterSpacing: 0 }}>%</span>
                </span>
              </div>
              <div
                style={{ height: 5, background: c.rule, margin: "37px 0 23px" }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: progress < 100 ? c.amber : c.ink,
                  }}
                />
              </div>
              <div
                style={{
                  ...row,
                  justifyContent: "space-between",
                  fontSize: 23,
                  color: c.muted,
                }}
              >
                <span>
                  {progress === 100
                    ? "Files downloaded and verified"
                    : "Downloading and verifying files"}
                </span>
                <span>On DGX Spark</span>
              </div>
              <div
                style={{
                  ...row,
                  gap: 24,
                  marginTop: 59,
                  paddingTop: 30,
                  borderTop: rule,
                }}
              >
                <FilmOrb frame={f} size={94} state="searching" />
                <div>
                  <div style={{ fontSize: 27 }}>
                    {progress === 100
                      ? "Preparing the AI runtime"
                      : "Your setup is in progress"}
                  </div>
                  <div style={{ fontSize: 23, color: c.muted, marginTop: 12 }}>
                    Verified downloads can resume if interrupted.
                  </div>
                </div>
              </div>
            </div>
          )}
          {phase === 3 && (
            <div style={enter(f, start, 12)}>
              <SetupRow
                label="Model files"
                detail="Downloaded and verified on the server"
                done
              />
              <SetupRow
                label="AI service"
                detail="The model is loaded and responding"
                done={f >= 277}
                live={f < 277}
              />
              <SetupRow
                label="Workspace connection"
                detail="Lumos can reach your AI service"
                done={f >= 299}
                live={f >= 277 && f < 299}
              />
            </div>
          )}
          {phase === 4 && (
            <div style={enter(f, start, 15)}>
              <div
                style={{
                  ...row,
                  gap: 34,
                  padding: "24px 0 41px",
                  borderBottom: rule,
                }}
              >
                <Mark size={102} />
                <div>
                  <div style={{ fontSize: 32, fontWeight: 600 }}>
                    Ready when you are.
                  </div>
                  <div style={{ fontSize: 25, color: c.muted, marginTop: 14 }}>
                    Create a project. Bring your documents.
                  </div>
                </div>
              </div>
              <div
                style={{
                  ...row,
                  gap: 14,
                  fontSize: 24,
                  color: c.muted,
                  margin: "35px 0 54px",
                }}
              >
                <Check size={27} /> AI on DGX Spark{" "}
                <span style={{ margin: "0 10px" }}>·</span> Workspace on this
                computer
              </div>
              <div style={{ ...row, justifyContent: "flex-end" }}>
                <Primary frame={f} clickAt={350}>
                  Open workspace
                </Primary>
              </div>
            </div>
          )}
        </main>
      </div>
    </Scene>
  );
}

const reports = [
  { id: "01", name: "LFP cycle study 01", chem: "LFP", cycles: 2200, page: 4 },
  { id: "02", name: "LFP cycle study 02", chem: "LFP", cycles: 2500, page: 6 },
  { id: "03", name: "LFP cycle study 03", chem: "LFP", cycles: 2800, page: 5 },
  { id: "04", name: "LFP cycle study 04", chem: "LFP", cycles: 2900, page: 4 },
  { id: "05", name: "NMC cycle study 01", chem: "NMC", cycles: 1100, page: 7 },
  { id: "06", name: "NMC cycle study 02", chem: "NMC", cycles: 1200, page: 5 },
  { id: "07", name: "NMC cycle study 03", chem: "NMC", cycles: 1400, page: 4 },
  { id: "08", name: "NMC cycle study 04", chem: "NMC", cycles: 1500, page: 6 },
];

function ProjectShell({
  children,
  lane,
  active,
  facts,
  action,
  askAvailable = true,
  stateLabel,
}: {
  children: ReactNode;
  lane: "Grid" | "Ask Lumos";
  active?: boolean;
  facts: ReactNode;
  action?: ReactNode;
  askAvailable?: boolean;
  stateLabel?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 130,
        top: 115,
        width: 1660,
        height: 850,
        border: rule,
        display: "flex",
      }}
    >
      <aside
        style={{
          width: 86,
          flexShrink: 0,
          borderRight: rule,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 35,
          paddingTop: 23,
        }}
      >
        <Mark size={41} />
        <div
          style={{
            width: 30,
            height: 1,
            background: c.rule,
            margin: "3px 0 1px",
          }}
        />
        {[Folder, Stack, Cpu].map((Icon, i) => (
          <Icon key={i} size={27} color={i === 0 ? c.ink : c.muted} />
        ))}
        <GearSix
          size={27}
          color={c.muted}
          style={{ marginTop: "auto", marginBottom: 28 }}
        />
      </aside>
      <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
        <div
          style={{
            height: 60,
            ...row,
            gap: 16,
            padding: "0 35px",
            borderBottom: rule,
            fontSize: 21,
            color: c.muted,
          }}
        >
          <span>Projects</span>
          <span style={{ color: c.faint }}>/</span>
          <span>Battery cycle study</span>
          <span style={{ marginLeft: 20, color: active ? c.amber : c.muted }}>
            {stateLabel ?? (active ? "Extracting" : "Ready to explore")}
          </span>
          <span style={{ marginLeft: "auto" }}>schema v1</span>
        </div>
        <div
          style={{
            height: 118,
            padding: "21px 35px 0",
            ...row,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 43,
                fontWeight: 600,
                letterSpacing: "-1.4px",
                margin: 0,
              }}
            >
              Battery cycle study
            </h1>
            <div style={{ fontSize: 23, color: c.muted, marginTop: 12 }}>
              {facts}
            </div>
          </div>
          {action}
        </div>
        <div
          style={{
            ...row,
            padding: "0 35px",
            height: 50,
            gap: 41,
            borderBottom: rule,
          }}
        >
          <div style={{ ...row, gap: 11, color: c.muted, fontSize: 23 }}>
            <SquaresFour size={25} />
            Overview
          </div>
          <div
            style={{
              ...row,
              gap: 11,
              height: "100%",
              borderBottom:
                lane === "Grid"
                  ? `2px solid ${c.ink}`
                  : "2px solid transparent",
              color: lane === "Grid" ? c.ink : c.muted,
              fontSize: 23,
            }}
          >
            <Table size={25} />
            Grid<span style={{ color: c.muted, marginLeft: 3 }}>8</span>
          </div>
          {askAvailable && (
            <div
              style={{
                ...row,
                gap: 11,
                height: "100%",
                borderBottom:
                  lane === "Ask Lumos"
                    ? `2px solid ${c.ink}`
                    : "2px solid transparent",
                color: lane === "Ask Lumos" ? c.ink : c.muted,
                fontSize: 23,
              }}
            >
              <Mark size={24} />
              Ask Lumos
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

const columns = "minmax(310px, 1.7fr) 0.85fr 1.05fr 0.92fr 0.65fr 0.9fr";
const gridRow: CSSProperties = {
  display: "grid",
  gridTemplateColumns: columns,
  alignItems: "center",
  gap: 16,
  padding: "0 22px",
  position: "relative",
};
const begin = [45, 45, 45, 146, 162, 176, 261, 269];
const finish = [145, 161, 175, 260, 268, 282, 310, 322];

function RowSweep({ frame, index }: { frame: number; index: number }) {
  const progress = ((frame - begin[index]) % 62) / 62;
  const skeletons = [
    { x: 424, width: 60 },
    { x: 633, width: 90 },
    { x: 888, width: 72 },
    { x: 1112, width: 36 },
    { x: 1276, width: 74 },
  ];
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      viewBox="0 0 1502 50"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`silver-${index}`}>
          <stop offset="0" stopColor={c.ink} stopOpacity="0" />
          <stop offset=".5" stopColor={c.ink} stopOpacity=".7" />
          <stop offset="1" stopColor={c.ink} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`pending-${index}`}>
          {skeletons.map(({ x, width }) => (
            <rect key={x} x={x} y={22} width={width} height={7} />
          ))}
        </clipPath>
      </defs>
      <g fill="#36332d">
        {skeletons.map(({ x, width }) => (
          <rect key={x} x={x} y={22} width={width} height={7} />
        ))}
      </g>
      <g clipPath={`url(#pending-${index})`}>
        <rect
          x={290 + progress * 1250}
          y={0}
          width={270}
          height={50}
          fill={`url(#silver-${index})`}
        />
      </g>
    </svg>
  );
}

export function ExtractScene() {
  // The preceding folder-drop scene already shows the Start extraction click.
  const f = useCurrentFrame() + 45;
  const count = finish.filter((n) => f >= n).length;
  const activeCount = begin.filter((n, i) => f >= n && f < finish[i]).length;
  const complete = count === 8;
  const evidence = clamp(f, 344, 367);
  return (
    <Scene>
      <ProjectShell
        lane="Grid"
        active={f >= 45 && !complete}
        askAvailable={complete}
        stateLabel={f < 45 ? "Ready to extract" : undefined}
        facts={
          <>
            <span style={{ color: !complete && f >= 45 ? c.amber : c.ink }}>
              {count * 4} values {complete ? "found" : "landed"}
            </span>
            <span style={{ margin: "0 15px" }}>·</span>
            {count} of 8 documents<span style={{ margin: "0 15px" }}>·</span>4
            fields
          </>
        }
        action={
          <div
            style={{
              ...row,
              gap: 12,
              border: rule,
              padding: "13px 20px",
              fontSize: 23,
              marginTop: 10,
            }}
          >
            {f < 45 ? (
              <>
                Start extraction
                <ArrowRight size={23} />
              </>
            ) : !complete ? (
              <>
                <Pause size={23} />
                Stop run
              </>
            ) : (
              <>
                <DownloadSimple size={23} />
                Export
              </>
            )}
          </div>
        }
      >
        <div style={{ margin: "0 35px" }}>
          <div
            style={{
              ...gridRow,
              height: 48,
              fontSize: 21,
              color: c.muted,
              borderBottom: rule,
            }}
          >
            {[
              "Document",
              "Chemistry",
              "Cycles to 80%",
              "Temperature",
              "Rate",
              "Evidence",
            ].map((t) => (
              <div key={t}>{t}</div>
            ))}
          </div>
          {reports.map((r, i) => {
            const done = f >= finish[i];
            const active = f >= begin[i] && !done;
            return (
              <div
                key={r.id}
                style={{
                  ...gridRow,
                  height: 50,
                  borderBottom: rule,
                  background:
                    i === 2 && evidence > 0
                      ? `rgba(238,236,230,${evidence * 0.055})`
                      : "transparent",
                  fontSize: 23,
                }}
              >
                <div style={{ ...row, gap: 15 }}>
                  <span style={{ color: c.faint, fontSize: 19, width: 25 }}>
                    {r.id}
                  </span>
                  <span>{r.name}</span>
                </div>
                {done ? (
                  <>
                    <span style={enter(f, finish[i], 10)}>{r.chem}</span>
                    <span
                      style={{
                        ...enter(f, finish[i], 10),
                        textDecoration: "underline",
                        textDecorationColor: "#68645d",
                        textUnderlineOffset: 6,
                        position: "relative",
                      }}
                    >
                      {r.cycles.toLocaleString("en-US")}
                      {i === 2 && (
                        <FilmPointer
                          frame={f}
                          clickAt={340}
                          style={{ left: 19, top: 5 }}
                        />
                      )}
                    </span>
                    <span style={enter(f, finish[i], 10)}>25 °C</span>
                    <span style={enter(f, finish[i], 10)}>1C</span>
                    <span
                      style={{
                        ...enter(f, finish[i], 10),
                        color: c.muted,
                        ...row,
                        gap: 9,
                      }}
                    >
                      <FileText size={20} />
                      p. {r.page}
                    </span>
                  </>
                ) : active ? (
                  <RowSweep frame={f} index={i} />
                ) : (
                  <>
                    <span style={{ color: c.faint }}>—</span>
                    <span style={{ color: c.faint }}>—</span>
                    <span style={{ color: c.faint }}>—</span>
                    <span style={{ color: c.faint }}>—</span>
                    <span style={{ color: c.faint }}>Queued</span>
                  </>
                )}
              </div>
            );
          })}
          <div
            style={{
              height: 59,
              ...row,
              gap: 13,
              fontSize: 23,
              color: complete ? c.ink : activeCount ? c.amber : c.muted,
            }}
          >
            {complete ? <Check size={24} /> : <Mark size={23} />}
            <span>
              {complete
                ? "Extraction complete"
                : activeCount
                  ? `Extracting ${activeCount} documents in parallel`
                  : "Eight reports, ready to extract"}
            </span>
            <span style={{ marginLeft: "auto", color: c.muted, fontSize: 21 }}>
              AI on DGX Spark
            </span>
          </div>
          <div
            style={{
              borderTop: rule,
              padding: "20px 22px",
              opacity: evidence,
              transform: `translateY(${(1 - ease(evidence)) * 14}px)`,
            }}
          >
            <div style={{ ...row, gap: 14, color: c.muted, fontSize: 21 }}>
              <FileText size={23} />
              <span>Source evidence</span>
              <span style={{ marginLeft: 7, color: c.ink }}>
                LFP cycle study 03
              </span>
              <span>·</span>
              <span>Page 5</span>
            </div>
            <p style={{ fontSize: 24, lineHeight: 1.4, margin: "13px 0 0" }}>
              “At 25 °C and a 1C cycling rate, the cell reached 80% capacity
              after{" "}
              <span style={{ background: "#36322b", padding: "3px 6px" }}>
                2,800 cycles
              </span>
              .”
            </p>
          </div>
        </div>
      </ProjectShell>
    </Scene>
  );
}

function Citation({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontSize: 21,
        color: c.muted,
        borderBottom: "1px solid #68645d",
        paddingBottom: 3,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function ComparisonChart({ frame }: { frame: number }) {
  const reveal = ease(clamp(frame, 214, 250));
  return (
    <div
      style={{
        borderTop: rule,
        paddingTop: 18,
        marginTop: 25,
        ...enter(frame, 200, 15),
      }}
    >
      <div
        style={{ ...row, justifyContent: "space-between", marginBottom: 15 }}
      >
        <span style={{ fontSize: 23, fontWeight: 500 }}>
          Mean cycle life to 80% capacity
        </span>
        <span style={{ fontSize: 20, color: c.muted }}>
          25 °C · 1C · 4 reports per chemistry
        </span>
      </div>
      <svg
        width="1180"
        height="161"
        viewBox="0 0 1180 161"
        style={{ display: "block", overflow: "visible" }}
      >
        {[0, 1000, 2000, 3000].map((n) => (
          <g key={n}>
            <line
              x1={135 + (n / 3000) * 865}
              x2={135 + (n / 3000) * 865}
              y1={4}
              y2={121}
              stroke={c.rule}
            />
            <text
              x={135 + (n / 3000) * 865}
              y={149}
              fill={c.muted}
              textAnchor="middle"
              fontSize={20}
            >
              {n.toLocaleString("en-US")}
            </text>
          </g>
        ))}
        {[
          ["LFP", 2600, c.ink],
          ["NMC", 1300, "#8c8880"],
        ].map(([label, n, fill], i) => (
          <g key={label}>
            <text
              x={0}
              y={38 + i * 62}
              fill={c.ink}
              fontSize={26}
              fontWeight={500}
            >
              {label}
            </text>
            <rect
              x={135}
              y={14 + i * 62}
              width={(Number(n) / 3000) * 865 * reveal}
              height={31}
              fill={String(fill)}
            />
            <text
              x={154 + (Number(n) / 3000) * 865 * reveal}
              y={39 + i * 62}
              fill={c.ink}
              fontSize={27}
              fontWeight={500}
              opacity={reveal}
            >
              {Number(n).toLocaleString("en-US")}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function AskScene() {
  const f = useCurrentFrame();
  const question = "How does cycle life compare between LFP and NMC?";
  const sent = f >= 72;
  const working = f >= 72 && f < 180;
  const answered = f >= 180;
  const typed = Math.floor(clamp(f, 13, 59) * question.length);
  const answerOpacity = clamp(f, 180, 198);
  const sourceOpen = f >= 343;
  const status =
    f < 109
      ? "Reading all eight reports"
      : f < 145
        ? "Checking test conditions"
        : "Comparing cycle life";
  return (
    <Scene>
      <ProjectShell
        lane="Ask Lumos"
        facts={
          <>
            8 documents<span style={{ margin: "0 15px" }}>·</span>32 extracted
            values<span style={{ margin: "0 15px" }}>·</span>Ready to explore
          </>
        }
      >
        <div style={{ position: "relative", height: 619, margin: "0 35px" }}>
          {!sent && (
            <div
              style={{
                position: "absolute",
                left: 91,
                right: 90,
                top: 86,
                ...enter(f, 0, 20),
              }}
            >
              <h2
                style={{
                  fontSize: 40,
                  fontWeight: 500,
                  letterSpacing: "-1px",
                  margin: "0 0 27px",
                }}
              >
                Start with a question.
              </h2>
              <div style={{ fontSize: 26, color: c.muted, lineHeight: 1.7 }}>
                Compare the chemistries.
                <br />
                Check the conditions. Follow the evidence.
              </div>
            </div>
          )}
          {sent && (
            <div
              style={{
                position: "absolute",
                left: 91,
                right: 70,
                top: 26,
                ...enter(f, 72, 14),
              }}
            >
              <div style={{ fontSize: 21, color: c.muted, marginBottom: 11 }}>
                You
              </div>
              <div style={{ fontSize: 28, fontWeight: 500 }}>{question}</div>
            </div>
          )}
          {sent && (
            <div
              style={{
                position: "absolute",
                left: 8,
                top: 129,
                width: 63,
                height: 66,
                display: "grid",
                placeItems: "center",
              }}
            >
              {working ? <FilmOrb frame={f} size={76} /> : <Mark size={48} />}
            </div>
          )}
          {working && (
            <div
              style={{
                position: "absolute",
                left: 91,
                top: 141,
                ...enter(f, 76, 12),
              }}
            >
              <div style={{ fontSize: 27, color: c.amber }}>{status}</div>
              <div style={{ fontSize: 23, color: c.muted, marginTop: 16 }}>
                {f < 109
                  ? "8 documents in this project"
                  : f < 145
                    ? "All reports: 25 °C, 1C, 80% capacity threshold"
                    : "4 LFP reports and 4 NMC reports"}
              </div>
              <div
                style={{
                  ...row,
                  gap: 16,
                  fontSize: 21,
                  color: c.muted,
                  marginTop: 33,
                }}
              >
                <CheckSquare size={23} />
                {f < 145
                  ? "Reading source-backed values"
                  : "8 of 8 reports included"}
              </div>
            </div>
          )}
          {answered && (
            <div
              style={{
                position: "absolute",
                left: 91,
                right: 90,
                top: 132,
                opacity: answerOpacity,
                transform: `translateY(${(1 - ease(answerOpacity)) * 10}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 33,
                  fontWeight: 600,
                  letterSpacing: "-0.65px",
                  lineHeight: 1.28,
                }}
              >
                LFP averaged twice the cycle life.
              </div>
              <p
                style={{
                  fontSize: 24,
                  lineHeight: 1.5,
                  margin: "12px 0 0",
                  color: c.muted,
                }}
              >
                In these 8 reports at 25 °C and 1C.{" "}
                <Citation>Reports 01–08</Citation>
              </p>
              {!sourceOpen ? (
                <ComparisonChart frame={f} />
              ) : (
                <div
                  style={{
                    ...enter(f, 343, 15),
                    marginTop: 25,
                    borderTop: rule,
                    paddingTop: 20,
                  }}
                >
                  <div
                    style={{ ...row, gap: 13, fontSize: 23, color: c.muted }}
                  >
                    <FileText size={25} />
                    <span>Source evidence</span>
                    <span style={{ marginLeft: "auto" }}>
                      Report 03 · Page 5
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: 28,
                      fontWeight: 500,
                      margin: "20px 0 13px",
                    }}
                  >
                    LFP cycle study 03
                  </h3>
                  <p
                    style={{
                      fontSize: 27,
                      lineHeight: 1.55,
                      margin: 0,
                      maxWidth: 1130,
                    }}
                  >
                    “At 25 °C and a 1C cycling rate, the cell reached 80%
                    <br />
                    capacity after{" "}
                    <span style={{ background: "#36322b", padding: "3px 7px" }}>
                      2,800 cycles
                    </span>
                    .”
                  </p>
                  <div style={{ fontSize: 22, color: c.muted, marginTop: 20 }}>
                    Included in the LFP mean · 4 reports ·{" "}
                    <Citation>Back to comparison</Citation>
                  </div>
                </div>
              )}
              {!sourceOpen && (
                <div
                  style={{
                    ...row,
                    justifyContent: "space-between",
                    marginTop: 12,
                    ...enter(f, 271, 15),
                  }}
                >
                  <span style={{ fontSize: 21, color: c.muted }}>
                    A descriptive comparison of these reports.
                  </span>
                  <span style={{ position: "relative" }}>
                    <Citation>Inspect source evidence</Citation>
                    <FilmPointer
                      frame={f}
                      clickAt={339}
                      style={{ left: 100, top: 5 }}
                    />
                  </span>
                </div>
              )}
            </div>
          )}
          <div
            style={{
              position: "absolute",
              left: 10,
              right: 10,
              bottom: 31,
              height: 74,
              border: rule,
              padding: "0 15px 0 20px",
              ...row,
              gap: 20,
              background: c.bg,
            }}
          >
            <Mark size={35} />
            <span
              style={{ fontSize: 25, flex: 1, color: sent ? c.muted : c.ink }}
            >
              {sent ? "Ask a follow-up question…" : question.slice(0, typed)}
              {!sent && f >= 13 && f < 66 && (
                <span
                  style={{ borderRight: `2px solid ${c.muted}`, marginLeft: 2 }}
                >
                  &nbsp;
                </span>
              )}
            </span>
            <Paperclip size={25} color={c.muted} />
            <div
              style={{
                width: 45,
                height: 45,
                display: "grid",
                placeItems: "center",
                background: working ? "transparent" : c.ink,
                border: working ? rule : "none",
                color: working ? c.muted : c.bg,
                position: "relative",
              }}
            >
              {working ? (
                <span style={{ width: 14, height: 14, background: c.muted }} />
              ) : (
                <ArrowUp size={26} />
              )}
              {!sent && (
                <FilmPointer
                  frame={f}
                  clickAt={68}
                  style={{ left: 19, top: 17 }}
                />
              )}
            </div>
          </div>
        </div>
      </ProjectShell>
    </Scene>
  );
}
