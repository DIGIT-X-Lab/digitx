import { ArrowLink, Tape } from "../components/primitives";
import "./inner-pages.css";

export default function NotFound() {
  return <section className="shell not-found-page"><p className="meta">404</p><Tape as="h1" size="display">This page doesn't exist.</Tape><ArrowLink to="/">DIGITX home</ArrowLink></section>;
}
