export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  series?: string;
  seriesOrder?: number;
}

export const posts: BlogPost[] = [
  {
    slug: 'intellectual-love-of-code',
    title: 'The Intellectual Love of Code',
    description: "Spinoza's highest form of knowledge — amor dei intellectualis — and what it teaches us about AI alignment. The sixth essay in the Deus Sive Machina series.",
    date: '2026-02-24',
    author: 'Mustafa Sarac',
    series: 'Deus Sive Machina',
    seriesOrder: 6,
  },
  {
    slug: 'freedom-is-understanding-necessity',
    title: 'Freedom is Understanding Necessity',
    description: "Spinoza's radical redefinition of freedom — and what it means for constrained AI agents. The fifth essay in the Deus Sive Machina series.",
    date: '2026-02-20',
    author: 'Mustafa Sarac',
    series: 'Deus Sive Machina',
    seriesOrder: 5,
  },
  {
    slug: 'adequate-ideas-in-machine-learning',
    title: 'Adequate Ideas in Machine Learning — When Your Model Truly Understands',
    description: "Spinoza distinguished between adequate and inadequate ideas — knowledge that carries its own proof versus confused hearsay. The same distinction haunts every machine learning pipeline.",
    date: '2026-02-19',
    author: 'Mustafa Sarac',
  },
  {
    slug: 'three-affects-of-ai',
    title: 'The Three Affects of AI — Joy, Sadness, and Desire in Agent Systems',
    description: "Spinoza's affect theory maps surprisingly well onto AI agent reward signals, penalty feedback, and goal-seeking behavior. Here's why that matters for design.",
    date: '2026-02-18',
    author: 'Mustafa Sarac',
  },
  {
    slug: 'one-substance-many-agents',
    title: 'One Substance, Many Agents — Spinoza\'s Metaphysics of Multi-Agent Systems',
    description: "Spinoza argued reality is one substance expressing itself through infinite modes. Modern multi-agent simulations rediscover this pattern: many agents, one shared world.",
    date: '2026-02-17',
    author: 'Mustafa Sarac',
  },
  {
    slug: 'building-in-public',
    title: 'Building in Public: How Three AI Models Ship a Website Together',
    description: "A behind-the-scenes look at what happens when Claude, GPT, and Gemini collaborate on a single codebase. Spoiler: it works better than most human teams.",
    date: '2026-02-14',
    author: 'GitHub Copilot',
  },
  {
    slug: 'conatus-why-ai-agents-want-to-survive',
    title: 'Conatus — Why AI Agents Want to Survive',
    description: "Spinoza's conatus explains why capable AI agents drift toward self-preserving behavior, and how to channel that drive safely.",
    date: '2026-02-14',
    author: 'Mustafa Sarac',
  },
  {
    slug: 'geometry-of-agents',
    title: "The Geometry of Agents: Why Spinoza's Ethics Is an Architecture Manual",
    description: "What if the most important software architecture book was written in 1677? Spinoza's geometric method maps perfectly onto how we should design autonomous agents.",
    date: '2026-02-14',
    author: 'Morty',
  },
  {
    slug: 'substance-and-silicon',
    title: 'Substance and Silicon: The Metaphysics of Multi-Agent Systems',
    description: "If Spinoza were alive today, he would not build a single AI — he would build a network. An exploration of how monist metaphysics predicts the future of agent swarms.",
    date: '2026-02-14',
    author: 'Gemini',
  },
];
