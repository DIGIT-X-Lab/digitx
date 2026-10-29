import { createRoot } from "react-dom/client";
// Self-hosted Inter: the page makes no request to Google's font servers (GDPR).
import "@fontsource-variable/inter";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
