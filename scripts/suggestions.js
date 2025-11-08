export function simulateSuggestion(text) {
  const t = text.toLowerCase();
  const hasEmail = t.includes("email") || t.includes("notification");
  const hasUser = t.includes("user") || t.includes("auth") || t.includes("login");

  if (hasEmail && hasUser) {
    return {
      title: "Secure event-driven architecture",
      summary: "Combines decoupled messaging for high-volume emails with a dedicated identity boundary.",
      intro: "Because you’re blending transactional emails with sensitive account journeys, I’d lean on a secure event-driven architecture. It keeps responsibilities clean while letting the experiences feel coordinated and personal. The approach offers a narrative you can share with stakeholders: the identity core stays small and auditable, while the engagement layer experiments rapidly without risking exposure of critical data.",
      reason: "In this setup, your authentication service raises events—such as sign-ups, verification completions, or password resets—that a messaging worker consumes. That separation means the auth service stays lean and hardened, while the worker focuses on templates, throttling, localization, and compliance requirements for outbound mail. Crucially, the event payloads give you a consistent contract for trust-and-safety reviews, letting you trace who triggered what content and when.",
      practice: "Concretely, you might publish `UserRegistered`, `TwoFactorActivated`, and `EmailBounced` events to a message bus like SNS/SQS, Kafka, or Cloud Pub/Sub. A workflow processor enriches those events with profile data, logs activity for audit, and then triggers transactional campaigns through your email provider. Downstream services can subscribe without bolting new logic into the auth service. Over time you can layer in enriched personalization pipelines, real-time dashboards that watch drop-off rates, and simulation sandboxes to try new welcome journeys before going live.",
      tips: [
        "Map the lifecycle of an account—sign-up, verification, inactivity nudges, reactivation—and note which email moments matter most for trust and retention.",
        "Decide which events must be immediate versus which can be batched to control operational cost, deliverability quotas, and the perceived pace of the experience.",
        "Instrument both the auth boundary and the email worker with shared correlation IDs so you can trace a single user across the journey and satisfy compliance requests quickly.",
        "Stand up a weekly resilience review that checks queue depths, DLQ counts, and unusual bounce spikes so issues never surprise you.",
        "Document how marketing, security, and support teams collaborate when new triggers are added—shared rituals keep the architecture intentional instead of chaotic."
      ],
      pros: [
        "High resilience: bursts of sign-ups or password resets queue safely without overwhelming the mail provider, keeping the user-facing flow responsive.",
        "Stronger security posture: the authentication core stays minimal, making threat modeling and compliance reviews easier while giving you space to enforce rate limits.",
        "Future ready: new downstream consumers—analytics pipelines, notification hubs, partner integrations—can tap into the same events without reworking the auth layer."
      ],
      cons: [
        "Operational overhead: you’ll manage queues, dead-letter handling, and observability for at least two services, so plan for runbooks.",
        "Cross-service latency: emails depend on the queue and worker availability, so you need monitoring, retries, and fallbacks for degraded modes.",
        "Change coordination: schema updates to shared events require versioning and communication across teams to avoid breakage."
      ]
    };
  }

  if (hasEmail) {
    return {
      title: "Event-driven design with a message queue",
      summary: "Keeps core workflows fast while a background worker crafts polished emails.",
      intro: "Since email is front and center, I’d reach for an event-driven pattern. Your main app stays responsive, and a specialized worker can obsess over personalization, retries, and deliverability without risking user-facing latency. The approach also gives your product and lifecycle teams a clear sandbox where they can experiment with messaging tone, timing, and automation rules while engineers keep the checkout or onboarding flow silky smooth.",
      reason: "By recording intent in a queue—think `OrderPlaced`, `InvoiceReady`, or `ReminderDue`—you decouple the synchronous request from the heavier lifting of template rendering, asset fetching, and provider API calls. The queue also gives you breathing room if the email vendor slows down. You suddenly have the ability to replay events for backfill, inspect them for deliverability analysis, and plug in observability tools that highlight which scenarios drive the most engagement.",
      practice: "A lightweight producer emits structured events, while a dedicated email service pulls them, enriches with user context, and sends via your provider. You can slip in segmentation, A/B tests, or compliance checks without touching the core transaction. Think of the worker as a creative studio: it can handle localization rulebooks, track content experiments, and push real-time status updates back to the app so customers see consistent status messages.",
      tips: [
        "Define a stable contract for each email event so templates remain predictable and localization teams know exactly what data they receive and how to translate it.",
        "Set up retries with exponential backoff plus a dead-letter queue for problematic messages, then surface those to operations so they can remediate quickly.",
        "Log provider responses and bounce events in a central store so support and growth teams can act on deliverability issues and share insights with marketing.",
        "Create a message design checklist that covers accessibility (alt text, dark mode), regulatory disclaimers, and personalization tokens to avoid costly mistakes.",
        "Run dry-run load tests that queue thousands of messages to ensure the worker can keep pace with your biggest product launches."
      ],
      pros: [
        "Responsive UX: the primary request finishes quickly while the email is prepared asynchronously, keeping the UI snappy during peaks.",
        "Scalable foundation: you can scale workers horizontally or throttle sends during peak periods without redeploying the core app.",
        "Adaptable workflow: marketers and product teams can iterate on messaging logic in the worker without risking regressions elsewhere."
      ],
      cons: [
        "More infrastructure pieces: message brokers, worker fleets, and monitoring pipelines need care and feeding.",
        "Debugging requires robust tracing so you can follow an email from enqueue to provider handoff when something stalls.",
        "Eventually consistent experience: confirmations may appear a few seconds later, so provide inline feedback to reassure users."
      ]
    };
  }

  if (hasUser) {
    return {
      title: "MVC with a dedicated authentication service",
      summary: "Separates core product features from identity concerns, keeping everything testable and modular.",
      intro: "Given the strong focus on user journeys, I’d carve authentication and authorization into their own service while letting the MVC layer stay laser-focused on product behavior. Treat identity as a platform capability that other channels can reuse. This structure lets you articulate a crisp story to leadership: the identity domain becomes its own product with a roadmap, dedicated uptime targets, and a home for experts who live and breathe account safety.",
      reason: "The pattern keeps credentials, session policies, and audit logs inside a hardened perimeter. Meanwhile, the MVC app talks to the auth service through well-defined APIs or an SDK, so you can evolve sign-in flows, MFA steps, and recovery tooling without shaking the rest of the stack. It also unlocks a healthier experimentation culture—you can pilot passkeys, magic links, or adaptive MFA without the rest of the application noticing.",
      practice: "Expose endpoints for registration, login, refresh tokens, and role management backed by an identity store. The MVC app consumes those endpoints, caches tokens, and gates features based on claims or roles returned by the auth service, making authorization checks explicit. As you mature, layer in streaming events for audit dashboards, self-service admin consoles, and detailed telemetry that helps support diagnose sign-in friction faster.",
      tips: [
        "Sketch the user journeys you must support—SSO, passwordless, admin override—and ensure the auth service owns those flows end to end with clear SLAs.",
        "Feed domain events (account locked, permissions updated, device registered) back into the product app so it can react in real time and craft empathetic UI messaging.",
        "Automate contract tests between the MVC layer and the auth service to catch breaking changes before they reach production and to document agreed behaviors.",
        "Establish a quarterly threat-modeling ritual where identity and product engineers review new features together and confirm the boundary still holds.",
        "Document runbooks for lockouts, compromised accounts, and emergency credential resets so customer support can act confidently."
      ],
      pros: [
        "Clear ownership boundaries: identity specialists harden the auth surface while feature teams move quickly on product changes.",
        "Focused testing: you can run exhaustive identity tests in isolation and keep MVC test suites centered on business logic.",
        "Future integrations: partners, mobile clients, or internal tools can reuse the same identity APIs without duplicated logic."
      ],
      cons: [
        "Another service to maintain, complete with uptime targets, on-call rotations, and deployment pipelines.",
        "Cross-service latency and network quirks now influence your sign-in experience, so you need retries and graceful degradation.",
        "Requires disciplined observability to trace a single action across the MVC app and the auth boundary."
      ]
    };
  }

  return {
    title: "Layered architecture with repository pattern",
    summary: "Organizes the codebase so business rules stay clean while data access can evolve with confidence.",
      intro: "When requirements are broad or still taking shape, I like to reach for a layered architecture backed by the repository pattern. It empowers the domain layer to speak in business language, while infrastructure details sit behind clear interfaces. You end up with a system diagram that is easy to share with new teammates and stakeholders: each layer has a mission statement and the code mirrors that intent.",
      reason: "By structuring the project into presentation, application, domain, and infrastructure layers, you keep each concern focused. Repositories isolate persistence logic so you can swap data stores, experiment with caching, or add read models without unraveling core rules. The separation also makes design workshops more productive—domain experts stay in the conversation because the code honors the ubiquitous language you uncover together.",
      practice: "Let use-case services coordinate workflows, repositories interact with data stores, and domain models enforce invariants. When a feature grows complex, you can insert decorators for validation, caching, or instrumentation without rewriting everything. Over time, you can introduce CQRS read models for analytics, integrate feature flags for experimentation, and add domain events that keep other services in sync without copying logic.",
    tips: [
        "Start by identifying two or three core aggregates and define their repositories explicitly, documenting what each guarantees and which invariants they uphold.",
        "Lean on dependency inversion—pass repositories or gateways into services so unit tests can supply fakes while integration tests use real adapters and seeds.",
        "Write down the invariants your domain layer protects so newcomers know where to place logic, how to name concepts, and what must never be bypassed.",
        "Pair up with product owners to create domain glossaries and sequence diagrams that live alongside the code—they become onboarding gold.",
        "Schedule regular architecture reviews where you prune unused repositories or refactor boundaries before they calcify."
    ],
    pros: [
      "Maintainable structure: changes cluster within a layer instead of rippling across unrelated parts of the stack.",
      "Testable design: domain services run in lightweight unit tests while repositories receive dedicated integration coverage.",
      "Extensible foundation: adding a new data source or API becomes wiring a new repository implementation rather than refactoring business rules."
    ],
    cons: [
      "Additional boilerplate upfront, which can feel heavy for small teams or prototypes.",
      "Requires discipline so controllers resist the temptation to reach directly into persistence concerns.",
      "Onboarding can take longer if the team hasn’t worked with the pattern before, so budget for architectural documentation."
    ]
  };
}

