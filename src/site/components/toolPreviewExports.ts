import { toolPreview } from "@/content/tool-validation";

/** Match GALAH's browser export: open the report's print view for Save as PDF. */
export function exportGalahPreviewPdf() {
  const popup = window.open("", "galah-preview-report", "width=800,height=900");
  if (!popup) return;
  const doc = popup.document;
  doc.open();
  doc.write('<!doctype html><html lang="en"><head><title>GALAH preview report</title><style>body{font:16px/1.6 Arial,sans-serif;max-width:680px;margin:56px auto;padding:0 28px;color:#222}h1{font-size:28px;font-weight:500}h2{font-size:18px;margin-top:32px}footer{margin-top:48px;border-top:1px solid #ccc;padding-top:16px;font-size:12px;color:#555}@media print{body{margin:20mm 10mm}}</style></head><body></body></html>');
  doc.close();
  const add = (tag: string, text: string) => { const element = doc.createElement(tag); element.textContent = text; doc.body.append(element); };
  add("h1", toolPreview.galah.report);
  add("p", toolPreview.galah.status);
  add("h2", toolPreview.galah.section);
  toolPreview.galah.findings.forEach(finding => add("p", finding));
  add("footer", "GALAH workflow preview. Fictional example, not a patient report.");
  popup.focus();
  popup.print();
}
