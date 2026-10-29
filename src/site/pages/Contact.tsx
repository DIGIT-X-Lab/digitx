import { contactPage as copy } from "@/content/contact";
import { contactEmail } from "@/content/site";
import { Arrow, Tape } from "../components/primitives";
import "./inner-pages.css";

export default function Contact({ embedded = false }: { embedded?: boolean }) {
  return (
    <section className="shell page-intro contact-page">
      <Tape as={embedded ? "h2" : "h1"} size="display" className="contact-title" id="contact-title">{copy.title}</Tape>
      <div className="contact-invitation">
        <p className="contact-copy page-lead">{copy.body}</p>
        <a href={`mailto:${contactEmail}`} className="contact-email-link"><span>{copy.cta}</span><Arrow direction="diagonal" /></a>
      </div>
    </section>
  );
}
