import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./site/components/Layout";
import Landing from "./site/pages/Landing";
import { showDevicePreview, showPeoplePreview, showReviewPrototype } from "./site/env";
import { ReviewLayout } from "./site/pages/review/ReviewLayout";

const ToolDetail = lazy(() => import("./site/pages/ToolDetail"));
const Job = lazy(() => import("./site/pages/Job"));
const PeoplePreview = lazy(() => import("./site/pages/PeoplePreview"));
const NotFound = lazy(() => import("./site/pages/NotFound"));
const ReviewPrototype = lazy(() => import("./site/pages/review/ReviewPrototype"));
const DevicePreview = lazy(() => import("./site/pages/DevicePreview"));

function SiteFrame({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  if (showDevicePreview && pathname === "/device-preview") return <>{children}</>;
  return showReviewPrototype && (pathname === "/review-prototype" || pathname.startsWith("/review-prototype/"))
    ? <ReviewLayout>{children}</ReviewLayout> : <Layout>{children}</Layout>;
}

/** Preserve existing bookmarks, including links to projects and individual pillars. */
function SectionRedirect({ id }: { id: string }) {
  const { hash } = useLocation();
  return <Navigate to={{ pathname: "/", hash: hash || `#${id}` }} replace />;
}

const App = () => (
  <BrowserRouter>
    <SiteFrame>
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          {showDevicePreview && <Route path="/device-preview" element={<DevicePreview />} />}
          {showReviewPrototype && <>
            <Route path="/publications-preview" element={<SectionRedirect id="publications" />} />
            <Route path="/review-prototype" element={<ReviewPrototype />} />
            <Route path="/review-prototype/tools/:slug" element={<ToolDetail />} />
            <Route path="/review-prototype/careers/:id" element={<Job />} />
          </>}
          <Route path="/research" element={<SectionRedirect id="research" />} />
          <Route path="/tools" element={<SectionRedirect id="tools" />} />
          <Route path="/tools/:slug" element={<ToolDetail />} />
          <Route path="/projects" element={<SectionRedirect id="projects" />} />
          <Route path="/publications" element={<SectionRedirect id="publications" />} />
          <Route path="/people" element={<SectionRedirect id="people" />} />
          {showPeoplePreview && <Route path="/people-preview" element={<PeoplePreview />} />}
          <Route path="/contact" element={<SectionRedirect id="contact" />} />
          <Route path="/careers" element={<SectionRedirect id="opportunities" />} />
          <Route path="/careers/:id" element={<Job />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </SiteFrame>
  </BrowserRouter>
);

export default App;
