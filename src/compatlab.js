export const KEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"];

export const BANDS = [
  { max: 39, label: "Baseline not established" },
  { max: 69, label: "Some checks covered" },
  { max: 89, label: "Most checks covered" },
  { max: 100, label: "Checklist largely covered" },
];

export const DEFAULT_FORM_ACTION = "https://formsubmit.co/thespencerlowe@gmail.com";

export function bandFor(total) {
  return BANDS.find((band) => total <= band.max).label;
}

export function scoreFromAnswers(vector) {
  const answered = vector.filter((value) => value !== null);
  const yesCount = answered.filter((value) => value === "Y").length;
  const total = yesCount * 10;
  const complete = answered.length === KEYS.length;

  return {
    answered: answered.length,
    total,
    complete,
    band: complete ? bandFor(total) : null,
    vector: vector.map((value) => value ?? "-").join("/"),
  };
}

export function isAcknowledgedSuccess(httpOk, body) {
  if (!httpOk || !body || typeof body !== "object") {
    return false;
  }

  return body.success === true || body.success === "true";
}

export function ajaxFormUrl(endpoint) {
  return endpoint.includes("formsubmit.co/")
    ? endpoint.replace("formsubmit.co/", "formsubmit.co/ajax/")
    : endpoint;
}

export async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function revealPanel(panel) {
  panel.hidden = false;
  if (typeof panel.focus === "function") {
    panel.focus({ preventScroll: true });
  }

  const behavior = prefersReducedMotion() ? "auto" : "smooth";
  panel.scrollIntoView({ behavior, block: "center" });
}
