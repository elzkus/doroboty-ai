import { lazy } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router";
import { PrototypeProvider } from "./store";
import { Shell, NotFound } from "./shell";

const HomePage = lazy(() => import("./home"));
const MethodologyPage = lazy(() => import("./methodology"));
const JobsPage = lazy(() =>
  import("./marketplace").then((module) => ({ default: module.JobsPage })),
);
const JobPage = lazy(() => import("./marketplace").then((module) => ({ default: module.JobPage })));
const CompanyPage = lazy(() =>
  import("./marketplace").then((module) => ({ default: module.CompanyPage })),
);
const PersonPicker = lazy(() =>
  import("./workspace").then((module) => ({ default: module.PersonPicker })),
);
const RequireRole = lazy(() =>
  import("./workspace").then((module) => ({ default: module.RequireRole })),
);
const WorkspaceHome = lazy(() =>
  import("./workspace").then((module) => ({ default: module.WorkspaceHome })),
);
const ProfilePage = lazy(() =>
  import("./workspace").then((module) => ({ default: module.ProfilePage })),
);
const ProfileEditorPage = lazy(() =>
  import("./workspace").then((module) => ({ default: module.ProfileEditorPage })),
);
const SavedPage = lazy(() =>
  import("./workspace").then((module) => ({ default: module.SavedPage })),
);
const ApplyPage = lazy(() =>
  import("./workspace").then((module) => ({ default: module.ApplyPage })),
);
const ApplicationsPage = lazy(() =>
  import("./workspace").then((module) => ({ default: module.ApplicationsPage })),
);
const ApplicationDetail = lazy(() =>
  import("./workspace").then((module) => ({ default: module.ApplicationDetail })),
);
const AiExperienceQuestionnairePage = lazy(() =>
  import("./ai-experience-questionnaire").then((module) => ({
    default: module.AiExperienceQuestionnairePage,
  })),
);
const EmployerJobs = lazy(() =>
  import("./employer").then((module) => ({ default: module.EmployerJobs })),
);
const EmployerJobEditor = lazy(() =>
  import("./employer").then((module) => ({ default: module.EmployerJobEditor })),
);
const CompanyEditor = lazy(() =>
  import("./employer").then((module) => ({ default: module.CompanyEditor })),
);
const SettingsPage = lazy(() =>
  import("./settings").then((module) => ({ default: module.SettingsPage })),
);
const PrivacyPage = lazy(() =>
  import("./settings").then((module) => ({ default: module.PrivacyPage })),
);
const CasePage = lazy(() => import("./case").then((module) => ({ default: module.CasePage })));
function AppRoutes() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<HomePage />} />
        <Route path="oferty" element={<JobsPage />} />
        <Route path="oferty/:slug" element={<JobPage />} />
        <Route path="firmy/:slug" element={<CompanyPage />} />
        <Route path="metodologia" element={<MethodologyPage />} />
        <Route path="polityka-prywatnosci" element={<PrivacyPage />} />
        <Route path="auth/:mode" element={<PersonPicker />} />
        <Route
          path="aplikuj/:slug"
          element={
            <RequireRole role="candidate">
              <ApplyPage />
            </RequireRole>
          }
        />
        <Route
          path="app"
          element={
            <RequireRole>
              <WorkspaceHome />
            </RequireRole>
          }
        />
        <Route path="app/onboarding" element={<Navigate to="/app/profil" replace />} />
        <Route
          path="app/profil"
          element={
            <RequireRole role="candidate">
              <ProfilePage />
            </RequireRole>
          }
        />
        <Route
          path="app/profil/edytuj"
          element={
            <RequireRole role="candidate">
              <ProfileEditorPage />
            </RequireRole>
          }
        />
        <Route path="app/profil/podglad" element={<Navigate to="/app/profil" replace />} />
        <Route
          path="app/profil/doswiadczenie-ai"
          element={
            <RequireRole role="candidate">
              <AiExperienceQuestionnairePage />
            </RequireRole>
          }
        />
        <Route
          path="app/zapisane"
          element={
            <RequireRole role="candidate">
              <SavedPage />
            </RequireRole>
          }
        />
        <Route
          path="app/aplikacje"
          element={
            <RequireRole role="candidate">
              <ApplicationsPage />
            </RequireRole>
          }
        />
        <Route
          path="app/aplikacje/:id"
          element={
            <RequireRole role="candidate">
              <ApplicationDetail />
            </RequireRole>
          }
        />
        <Route
          path="app/aplikacje/:id/wyslano"
          element={
            <RequireRole role="candidate">
              <ApplicationDetail />
            </RequireRole>
          }
        />
        <Route
          path="app/oferty"
          element={
            <RequireRole role="employer">
              <EmployerJobs />
            </RequireRole>
          }
        />
        <Route
          path="app/oferty/:id"
          element={
            <RequireRole role="employer">
              <EmployerJobEditor />
            </RequireRole>
          }
        />
        <Route
          path="app/organizacja"
          element={
            <RequireRole role="employer">
              <CompanyEditor />
            </RequireRole>
          }
        />
        <Route
          path="app/kandydaci"
          element={
            <RequireRole role="employer">
              <ApplicationsPage employer />
            </RequireRole>
          }
        />
        <Route
          path="app/kandydaci/:id"
          element={
            <RequireRole role="employer">
              <ApplicationDetail employer />
            </RequireRole>
          }
        />
        <Route
          path="app/case"
          element={
            <RequireRole role="operator">
              <CasePage />
            </RequireRole>
          }
        />
        <Route path="app/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
export function App() {
  return (
    <PrototypeProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </PrototypeProvider>
  );
}
