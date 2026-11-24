import type { Action, State } from "@/features/prototype/model";

type AnalyticsValue = boolean | number | string;
type AnalyticsProperties = Record<string, AnalyticsValue | undefined>;

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const apiHost = import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com";
type PostHogClient = (typeof import("posthog-js"))["default"];
let client: PostHogClient | undefined;
let initialization: Promise<void> | undefined;

export function initializeAnalytics() {
  if (!projectToken) return Promise.resolve();
  initialization ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(projectToken, {
      api_host: apiHost,
      ui_host: "https://eu.posthog.com",
      defaults: "2026-08-30",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      capture_dead_clicks: false,
      capture_exceptions: false,
      capture_heatmaps: false,
      capture_performance: false,
      disable_persistence: true,
      disable_session_recording: true,
      disable_surveys: true,
      disable_external_dependency_loading: true,
      advanced_disable_feature_flags: true,
      advanced_disable_flags: true,
      person_profiles: "never",
      ip: false,
      mask_all_text: true,
      mask_all_element_attributes: true,
      property_denylist: [
        "$current_url",
        "$pathname",
        "$host",
        "$title",
        "$referrer",
        "$referring_domain",
        "$initial_current_url",
        "$initial_referrer",
        "$initial_referring_domain",
      ],
    });
    client = posthog;
  });
  return initialization;
}

export function captureAnalytics(event: string, properties: AnalyticsProperties = {}) {
  if (!projectToken) return;
  void initializeAnalytics().then(() => client?.capture(event, properties));
}

export function routeGroup(pathname: string) {
  const path = pathname.split(/[?#]/, 1)[0];
  if (path === "/") return "home";
  if (path === "/oferty") return "job_listing";
  if (/^\/oferty\/[^/]+$/.test(path)) return "job_detail";
  if (/^\/firmy\/[^/]+$/.test(path)) return "company_detail";
  if (/^\/aplikuj\/[^/]+$/.test(path)) return "application_form";
  if (/^\/app\/aplikacje\/[^/]+/.test(path)) return "candidate_application_detail";
  if (/^\/app\/kandydaci\/[^/]+/.test(path)) return "employer_application_detail";
  if (path.startsWith("/app/")) return `workspace_${path.split("/")[2] || "home"}`;
  if (path === "/app") return "workspace_home";
  if (path.startsWith("/auth/")) return "person_picker";
  return "other";
}

export function captureDomainAction(action: Action, before: State, after: State) {
  const role = before.people.find((person) => person.id === before.activePersonId)?.role;

  switch (action.type) {
    case "select_person": {
      const selectedRole = after.people.find((person) => person.id === after.activePersonId)?.role;
      captureAnalytics("persona_selected", { role: selectedRole });
      break;
    }
    case "toggle_saved": {
      const wasSaved = before.saved.some(
        (item) => item.candidateId === before.activePersonId && item.jobId === action.jobId,
      );
      captureAnalytics(wasSaved ? "job_unsaved" : "job_saved", { job_id: action.jobId, role });
      break;
    }
    case "draft":
      captureAnalytics("application_draft_saved", {
        job_id: action.jobId,
        answer_length: action.answer.length,
        role,
      });
      break;
    case "submit":
      captureAnalytics("application_submitted", {
        job_id: action.jobId,
        answer_length: action.answer.length,
        role,
      });
      break;
    case "stage":
      captureAnalytics("application_stage_changed", { stage: action.stage, role });
      break;
    case "withdraw":
      captureAnalytics("application_withdrawn", { role });
      break;
    case "profile":
      captureAnalytics("candidate_profile_saved", { role });
      break;
    case "publish":
      captureAnalytics("job_record_saved", {
        publication_status: action.job.publicationStatus,
        role,
      });
      break;
    case "company":
      captureAnalytics("company_profile_saved", { role });
      break;
  }
}
