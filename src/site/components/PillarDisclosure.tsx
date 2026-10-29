import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { IdentityMark } from "./IdentityMark";
import "./pillar-disclosure.css";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> & {
  title: string;
  meta: ReactNode;
  decorativeMeta?: boolean;
  identity?: string;
};

/** Shared heading, spacing and boxed +/− for Research and forthcoming tools. */
export const PillarDisclosure = forwardRef<HTMLButtonElement, Props>(function PillarDisclosure({ title, meta, identity, decorativeMeta = false, className = "", onClick, ...props }, ref) {
  return <button {...props} ref={ref} type="button" className={`pillar-disclosure-trigger ${className}`} onClick={event => { event.currentTarget.focus({ preventScroll: true }); onClick?.(event); }}>
    <span className="pillar-disclosure-meta" aria-hidden={decorativeMeta || undefined}>{meta}</span>
    <span className="pillar-disclosure-title" data-has-identity={identity ? true : undefined}>{identity && <IdentityMark name={identity} />}<span className="pillar-disclosure-label">{title}</span></span>
    <span className="pillar-disclosure-plus" aria-hidden="true" />
  </button>;
});
