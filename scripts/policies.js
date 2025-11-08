import { BaselineSummary, TextReason, ProsCons } from "./strategies.js";

export class ExplanationPolicy {
  selectStrategies() {
    return [];
  }
}

export class EmptyPolicy extends ExplanationPolicy {
  selectStrategies() {
    return [new BaselineSummary()];
  }
}

export class ReasonOnlyPolicy extends ExplanationPolicy {
  selectStrategies() {
    return [new TextReason()];
  }
}

export class ProsConsOnlyPolicy extends ExplanationPolicy {
  selectStrategies() {
    return [new ProsCons()];
  }
}

export class BothPolicy extends ExplanationPolicy {
  selectStrategies() {
    return [new TextReason(), new ProsCons()];
  }
}

export function policyFor(mode) {
  if (mode === "reason") return new ReasonOnlyPolicy();
  if (mode === "proscons") return new ProsConsOnlyPolicy();
  if (mode === "both") return new BothPolicy();
  return new EmptyPolicy();
}

