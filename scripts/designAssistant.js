export class DesignAssistant {
  constructor(policy) {
    this.policy = policy;
  }

  render(ctx) {
    return this.policy
      .selectStrategies(ctx)
      .flatMap(strategy => strategy.generate(ctx.suggestion));
  }
}

