import { useId, useState } from "react";
import "./demonstrations.css";

/** The source letter and fields are synthetic, and retain their original wording. */
const letterDate = "12 March 2026";
type Part = string | { text: string; ref: number; punctuation?: string };

const sentence: Part[] = [
  "She ",
  { text: "stopped smoking", ref: 1 },
  " ",
  { text: "last spring", ref: 2 },
  " and now ",
  { text: "walks to work most days", ref: 3, punctuation: "." },
  " ",
  { text: "No chest pain", ref: 4 },
  " since the last visit.",
];

const excerpt: Part[] = [
  "She ",
  { text: "stopped smoking", ref: 1 },
  " ",
  { text: "last spring", ref: 2, punctuation: "." },
  " ",
  { text: "No chest pain", ref: 4 },
  " since the last visit.",
];

const fields = [
  { ref: 1, field: "smoking_status", value: "former" },
  { ref: 2, field: "smoking_stopped", value: "spring 2025", note: "resolved against the letter date" },
  { ref: 3, field: "physical_activity", value: "walks to work, most days" },
  { ref: 4, field: "chest_pain", value: "absent", note: "negation kept" },
];

export function TextToField({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState(2);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const active = hovered ?? focused ?? selected;
  const id = useId();
  const parts = compact ? excerpt : sentence;
  const visibleFields = fields.filter(field => parts.some(part => typeof part !== "string" && part.ref === field.ref));
  const reference = (ref: number) => visibleFields.findIndex(field => field.ref === ref) + 1;
  const interaction = (ref: number) => ({
    onPointerEnter: () => setHovered(ref),
    onPointerLeave: () => setHovered(null),
    onFocus: () => {
      setHovered(null);
      setFocused(ref);
    },
    onBlur: () => setFocused(null),
    onClick: () => setSelected(ref),
  });

  return (
    <div className="dx-demo dx-text-demo">
      <div className="dx-source-column">
        <div className="dx-text-heading">
          <p className="dx-demo-label">Source text</p>
          <p className="dx-demo-note">Clinic letter · {letterDate}</p>
        </div>
        <blockquote className="dx-source-letter">
          {parts.map((part, index) => typeof part === "string" ? (
            <span key={index}>{part}</span>
          ) : (
            <button
              key={index}
              id={`${id}-source-${part.ref}`}
              type="button"
              className={`dx-source-phrase${active === part.ref ? " is-active" : ""}`}
              aria-pressed={selected === part.ref}
              aria-controls={`${id}-field-${part.ref}`}
              aria-label={`${part.text}, show linked field ${fields[part.ref - 1].field}`}
              {...interaction(part.ref)}
            >
              {part.text}<sup aria-hidden="true">{reference(part.ref)}</sup>{part.punctuation}
            </button>
          ))}
        </blockquote>
        <p className="dx-source-instruction">Select a phrase or field to trace its source.</p>
      </div>

      <div className="dx-fields-column">
        <div className="dx-text-heading">
          <p className="dx-demo-label">Structured fields</p>
          <p className="dx-demo-note">Each value points back to its sentence</p>
        </div>
        <div className="dx-field-list" role="group" aria-label="Fields linked to the source text">
          {visibleFields.map((field) => (
            <button
              key={field.ref}
              type="button"
              id={`${id}-field-${field.ref}`}
              className={`dx-field-row${active === field.ref ? " is-active" : ""}`}
              aria-pressed={selected === field.ref}
              aria-controls={`${id}-source-${field.ref}`}
              {...interaction(field.ref)}
            >
              <span className="dx-field-reference" aria-hidden="true">{reference(field.ref)}</span>
              <span className="dx-field-name">{field.field}</span>
              <span className="dx-field-value">
                {field.value}
                {field.note && !(compact && field.ref === 4) && <span className="dx-field-note">{field.note}</span>}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
