import {
  DEFAULT_FORM_ACTION,
  KEYS,
  ajaxFormUrl,
  isAcknowledgedSuccess,
  parseJsonSafe,
  revealPanel,
  scoreFromAnswers,
} from "./compatlab.js";

const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || DEFAULT_FORM_ACTION;

const form = document.getElementById("priestley-form");
const success = document.getElementById("form-success");
const formError = document.getElementById("form-error");
const submitBtn = document.getElementById("submit-btn");
const sourceField = document.getElementById("meta-source");
const scoreTotalField = document.getElementById("meta-score-total");
const scoreVectorField = document.getElementById("meta-score-vector");
const timestampField = document.getElementById("meta-timestamp");
const scoreTotalEl = document.getElementById("score-total");
const scoreBandEl = document.getElementById("score-band");
const scoreProgressEl = document.getElementById("score-progress");
const scoreInvite = document.getElementById("score-invite");
const scoreInviteText = document.getElementById("score-invite-text");
const scoreFinalEl = document.getElementById("score-final");

form.action = FORM_ENDPOINT;

function answers() {
  return KEYS.map((key) => {
    const checked = document.querySelector(`input[name="maturity-${key}"]:checked`);
    return checked ? checked.value : null;
  });
}

function syncScore() {
  const result = scoreFromAnswers(answers());

  scoreProgressEl.textContent = `${result.answered} / 10 answered`;

  if (!result.answered) {
    scoreTotalEl.textContent = "—";
    scoreBandEl.textContent = "Answer to see a running total";
    scoreBandEl.dataset.band = "";
    scoreInvite.hidden = true;
    scoreTotalField.value = "";
    scoreVectorField.value = "";
    return;
  }

  if (result.complete) {
    scoreTotalEl.textContent = `${result.total} / 100`;
    scoreBandEl.textContent = result.band;
    scoreBandEl.dataset.band = result.band;
    scoreInvite.hidden = false;
    scoreFinalEl.textContent = `${result.total} / 100`;
    scoreInviteText.textContent = `Your MCP Client Readiness Score is ${result.total} / 100 — ${result.band}. Share this self-assessment with the waitlist form.`;
    scoreTotalField.value = String(result.total);
    scoreVectorField.value = result.vector;
    sourceField.value = "compatlab-scorecard";
    return;
  }

  scoreTotalEl.textContent = String(result.total);
  scoreBandEl.textContent = "Partial — finish all 10 to see a completed band";
  scoreBandEl.dataset.band = "";
  scoreInvite.hidden = true;
  scoreTotalField.value = String(result.total);
  scoreVectorField.value = result.vector;
}

function setSource(source) {
  if (!scoreInvite || scoreInvite.hidden) {
    sourceField.value = source;
  }
}

function showFormError(message) {
  formError.hidden = false;
  formError.textContent = message;
  formError.focus();
}

document.querySelectorAll("[data-source]").forEach((link) => {
  link.addEventListener("click", () => {
    setSource(link.dataset.source);
  });
});

document.getElementById("score-items").addEventListener("change", syncScore);

let sending = false;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (sending) {
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    form.querySelector(":invalid")?.focus();
    return;
  }

  formError.hidden = true;
  timestampField.value = new Date().toISOString();

  if (!scoreVectorField.value) {
    scoreVectorField.value = scoreFromAnswers(answers()).vector;
  }

  if (!sourceField.value) {
    sourceField.value = "compatlab-waitlist";
  }

  sending = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";

  const payload = new FormData(form);

  try {
    const response = await fetch(ajaxFormUrl(FORM_ENDPOINT), {
      method: "POST",
      headers: { Accept: "application/json" },
      body: payload,
    });
    const body = await parseJsonSafe(response);

    if (!isAcknowledgedSuccess(response.ok, body)) {
      throw new Error("submit_failed");
    }

    form.hidden = true;
    revealPanel(success);
  } catch {
    showFormError(
      "We couldn't send your answers. Check your connection and try again.",
    );
  } finally {
    sending = false;
    submitBtn.disabled = false;
    submitBtn.textContent = "Join the waitlist";
  }
});

syncScore();
