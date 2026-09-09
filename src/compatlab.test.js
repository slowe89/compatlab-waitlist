import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BANDS,
  KEYS,
  ajaxFormUrl,
  bandFor,
  isAcknowledgedSuccess,
  scoreFromAnswers,
} from "./compatlab.js";

describe("score bands", () => {
  it("keeps ten checklist keys and four renamed bands", () => {
    assert.equal(KEYS.length, 10);
    assert.deepEqual(
      BANDS.map((band) => band.label),
      [
        "Baseline not established",
        "Some checks covered",
        "Most checks covered",
        "Checklist largely covered",
      ],
    );
  });

  it("maps completed totals to the revised thresholds", () => {
    assert.equal(bandFor(0), "Baseline not established");
    assert.equal(bandFor(30), "Baseline not established");
    assert.equal(bandFor(39), "Baseline not established");
    assert.equal(bandFor(40), "Some checks covered");
    assert.equal(bandFor(60), "Some checks covered");
    assert.equal(bandFor(69), "Some checks covered");
    assert.equal(bandFor(70), "Most checks covered");
    assert.equal(bandFor(80), "Most checks covered");
    assert.equal(bandFor(89), "Most checks covered");
    assert.equal(bandFor(90), "Checklist largely covered");
    assert.equal(bandFor(100), "Checklist largely covered");
  });

  it("counts Yes as 10 and No as 0 without completing a partial band", () => {
    const none = scoreFromAnswers(Array(10).fill(null));
    assert.equal(none.answered, 0);
    assert.equal(none.complete, false);
    assert.equal(none.band, null);

    const oneYes = scoreFromAnswers(["Y", ...Array(9).fill(null)]);
    assert.equal(oneYes.answered, 1);
    assert.equal(oneYes.total, 10);
    assert.equal(oneYes.complete, false);
    assert.equal(oneYes.band, null);

    const oneNo = scoreFromAnswers(["N", ...Array(9).fill(null)]);
    assert.equal(oneNo.total, 0);
    assert.equal(oneNo.complete, false);
    assert.equal(oneNo.band, null);

    const allNo = scoreFromAnswers(Array(10).fill("N"));
    assert.equal(allNo.total, 0);
    assert.equal(allNo.complete, true);
    assert.equal(allNo.band, "Baseline not established");

    const allYes = scoreFromAnswers(Array(10).fill("Y"));
    assert.equal(allYes.total, 100);
    assert.equal(allYes.band, "Checklist largely covered");

    const seventy = scoreFromAnswers([
      "Y",
      "Y",
      "Y",
      "Y",
      "Y",
      "Y",
      "Y",
      "N",
      "N",
      "N",
    ]);
    assert.equal(seventy.total, 70);
    assert.equal(seventy.band, "Most checks covered");
    assert.equal(seventy.vector, "Y/Y/Y/Y/Y/Y/Y/N/N/N");
  });
});

describe("FormSubmit acknowledgment", () => {
  it("requires both HTTP success and a provider success body", () => {
    assert.equal(isAcknowledgedSuccess(true, { success: true }), true);
    assert.equal(isAcknowledgedSuccess(true, { success: "true" }), true);
    assert.equal(isAcknowledgedSuccess(true, { success: false }), false);
    assert.equal(isAcknowledgedSuccess(true, { success: "false" }), false);
    assert.equal(isAcknowledgedSuccess(true, { message: "ok" }), false);
    assert.equal(isAcknowledgedSuccess(true, null), false);
    assert.equal(isAcknowledgedSuccess(false, { success: true }), false);
    assert.equal(isAcknowledgedSuccess(true, "true"), false);
  });

  it("keeps the FormSubmit AJAX destination", () => {
    assert.equal(
      ajaxFormUrl("https://formsubmit.co/thespencerlowe@gmail.com"),
      "https://formsubmit.co/ajax/thespencerlowe@gmail.com",
    );
  });
});
