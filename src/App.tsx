import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Careers from "./pages/Careers";
import JobDetail from "./pages/JobDetail";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/careers/:id" element={<JobDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
