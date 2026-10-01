import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Analytics only: no autocapture, no session replay, no flags, no surveys.
if (key) {
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    ui_host: "https://us.posthog.com",
    autocapture: false,
    capture_pageview: false, // pageviews are sent manually (see PostHogPageView)
    disable_session_recording: true,
  });
}
