export class ExplanationStrategy {
  generate() {
    return [];
  }
}

export class BaselineSummary extends ExplanationStrategy {
  generate(suggestion) {
    const lines = [];
    const summary = suggestion.summary || "";
    const intro = suggestion.intro || "";
    const reason = suggestion.reason || "";

    if (summary) {
      lines.push(`Here’s the direction I’d start with: ${summary}`);
    } else if (suggestion.title) {
      lines.push(`I’d begin with ${suggestion.title.toLowerCase()}.`);
    }

    if (intro) {
      lines.push(intro);
    } else if (reason) {
      lines.push(`Why it helps: ${reason}`);
    }

    if (suggestion.practice) {
      lines.push(`At a high level, think about: ${suggestion.practice}`);
    }

    return lines;
  }
}

export class TextReason extends ExplanationStrategy {
  generate(suggestion) {
    const lines = [];
    if (suggestion.intro) lines.push(suggestion.intro);
    if (suggestion.reason) lines.push(`Why this fits: ${suggestion.reason}`);
    if (suggestion.practice) lines.push(`How it might look in practice: ${suggestion.practice}`);
    if (Array.isArray(suggestion.tips) && suggestion.tips.length) {
      lines.push("Here’s how I’d start exploring it:");
      suggestion.tips.forEach((tip, idx) => {
        const label = ["First", "Next", "Then", "After that", "Finally"][Math.min(idx, 4)];
        lines.push(`${label}, ${tip}`);
      });
    }
    return lines;
  }
}

export class ProsCons extends ExplanationStrategy {
  generate(suggestion) {
    const lines = [];
    if (Array.isArray(suggestion.pros) && suggestion.pros.length) {
      lines.push(`Upsides I’m noticing: ${suggestion.pros.join(" ")}`);
    }
    if (Array.isArray(suggestion.cons) && suggestion.cons.length) {
      lines.push(`Tradeoffs to watch: ${suggestion.cons.join(" ")}`);
    }
    return lines;
  }
}

