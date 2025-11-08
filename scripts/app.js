import { simulateSuggestion } from "./suggestions.js";
import { policyFor } from "./policies.js";
import { DesignAssistant } from "./designAssistant.js";

const projectEl = document.getElementById("project");
const modeEl = document.getElementById("mode");
const btn = document.getElementById("btnSuggest");
const output = document.getElementById("output");
const suggestionText = document.getElementById("suggestionText");
const explanationsDiv = document.getElementById("explanations");
const formLink = document.getElementById("formLink");

const GOOGLE_FORM_BASE = "https://docs.google.com/forms/d/e/1FAIpQLSeNWkS0yATOr62S3TjJtbf4NzJKlVW7MYKqgIt0mnbY2eeNHA/viewform?usp=header";

btn.addEventListener("click", () => {
  const text = projectEl.value.trim();
  if (!text) {
    projectEl.focus();
    return;
  }

  const suggestion = simulateSuggestion(text);
  suggestionText.textContent = suggestion.summary
    ? `${suggestion.title} — ${suggestion.summary}`
    : suggestion.title;
  explanationsDiv.innerHTML = "";

  const mode = modeEl.value;
  const assistant = new DesignAssistant(policyFor(mode));
  const lines = assistant.render({ suggestion, text });

  lines.filter(Boolean).forEach(line => {
    const p = document.createElement("p");
    p.textContent = line;
    explanationsDiv.appendChild(p);
  });

  const params = new URLSearchParams({
    mode,
    suggestion: suggestion.title,
    project: text
  }).toString();
  formLink.href = `${GOOGLE_FORM_BASE}?${params}`;

  output.classList.remove("hidden");
});

