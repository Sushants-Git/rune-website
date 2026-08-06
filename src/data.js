export const REPO = "https://github.com/Sushants-Git/Rune";
export const RELEASES = `${REPO}/releases`;

/* Only a fallback label. The button's real href and version come from the
   Releases API at run time (see useRelease.js), because a version baked in here
   is wrong the moment the next tag ships, and this page already shipped three
   releases out of date. */
export const VERSION = "0.7.6";

/* Rune is ad-hoc signed, not signed with a Developer ID, so macOS quarantines
   the download and refuses the first launch. Saying so plainly beats letting
   someone meet "Rune is damaged" with no explanation and conclude the download
   is broken — it isn't, it's unsigned, which is a different and fixable thing.

   The Control-click → Open route quietly stopped working in macOS 15, so the
   command is the answer that holds everywhere and the Settings path is the
   one for people who would rather not paste a command. */
export const QUARANTINE = "xattr -dr com.apple.quarantine /Applications/Rune.app";

/* The states in Sources/Rune/Activity.swift.

   Two and silence, which is the whole set. There is no "a command is running":
   knowing that needs shell integration, not a guess. And there is no third
   "needs you" either — for triage, an agent blocked on a question and an agent
   that has finished are the same instruction, so what it's stuck on is the
   detail beside the label rather than a colour of its own. */
export const ACTIVITY = {
  idle: { label: null, tone: null, pulses: false },
  working: { label: "working", tone: "var(--working-lit)", pulses: true },
  waiting: { label: "your turn", tone: "var(--turn-lit)", pulses: false },
};

/* The same, in the darker tones that survive on paper, and what each one means
   on a row. Three lines is the entire vocabulary you have to learn. */
export const STATES = [
  {
    key: "working",
    name: "working",
    tone: "var(--working-ink)",
    desc: "Mid-turn, with the clock running. Nothing needs you.",
  },
  {
    key: "waiting",
    name: "your turn",
    tone: "var(--turn-ink)",
    desc: "It stopped, at its prompt or on a question. Nothing happens until you go there.",
  },
  {
    key: "idle",
    name: "nothing at all",
    tone: "var(--muted)",
    desc: "A shell, or an agent that publishes no state. Rune stays quiet rather than guessing.",
  },
];

/* The three axes, which is the whole layout model in three lines. */
export const AXES = [
  {
    key: "⌘D",
    name: "Splits",
    desc: "Divide the pane you are in. Side by side, as many as the window will hold.",
  },
  {
    key: "⌘T",
    name: "Tabs",
    desc: "A strip inside the title bar, beside the window controls. It costs no vertical space.",
  },
  {
    key: "⌘N",
    name: "Workspaces",
    desc: "A whole set of tabs and splits, reachable only from ⌘K. The list never reshuffles.",
  },
];

/* What Rune does not do, which for a program that watches your terminals is the
   more useful half of the story. Every line here is checkable in the source:

     - the only hosts in Sources/Rune are api.github.com and github.com for
       updates, and opencode.ai once, to fetch the plugin you asked for
     - grepping for analytics, telemetry, posthog, segment, mixpanel or sentry
       across Sources/Rune returns nothing
     - `ghostty_surface_read_text` appears once, in ZoomScrollTest.swift; the
       agent-state path never calls it
     - Updater.checkInterval is 60 * 60 */
export const LIMITS = [
  {
    name: "It doesn't read your screen",
    desc: "Rune asks each agent what it is doing. It never scrapes the rendered terminal, which it tried once and abandoned: the read takes the same lock the IO thread holds, so it stalled under exactly the busy agent you wanted to watch.",
  },
  {
    name: "It doesn't phone home",
    desc: "No analytics, no telemetry, no account. The only thing Rune ever sends is a request to the GitHub Releases API, once an hour, to see whether a newer version exists.",
  },
];

/* Where each agent's state comes from. All three publish now: opencode gained a
   plugin in 0.8.x, so the old "publishes nothing" line is no longer true. */
export const SOURCES = [
  {
    name: "Claude Code",
    detail: "~/.claude/sessions/<pid>.json, keyed by process id",
  },
  {
    name: "Codex",
    detail: "the progress spinner it animates in the terminal title",
  },
  {
    name: "opencode",
    detail: "a plugin, installed with one command",
  },
];

/* The three agents AgentIcon.swift knows how to spot, by the process running in
   the terminal. Their marks live in src/components/AgentIcon.jsx. */
export const AGENTS = {
  claude: { name: "claude" },
  codex: { name: "codex" },
  opencode: { name: "opencode" },
};

/* What the ⌘K list holds: workspaces, in creation order, never reshuffled.

   Five, one per kind of mark: a multiplexer, a Claude task, an editor, a Codex
   task, an opencode task. Enough to show that a row can be a command you ran or
   a job you handed off, without a list long enough to need scrolling. */
export const WORKSPACES = [
  {
    id: "scratch",
    name: "tmux a",
    pinned: true,
    path: "~",
    agent: null,
    program: "tmux",
    activity: "idle",
  },
  {
    id: "auth-refactor",
    name: "Implement wide event logging",
    pinned: true,
    path: "~/api",
    agent: "claude",
    // Claude publishes `busy` and nothing else, so a working row is the plain
    // word plus the clock. Only its `waiting` states carry a reason.
    activity: "working",
    elapsed: "2m 14s",
  },
  {
    id: "dotfiles",
    name: "nvim .",
    path: "~/.config",
    agent: null,
    program: "neovim",
    activity: "idle",
  },
  {
    id: "search-ranking",
    name: "Find the memory spike using logs",
    path: "~/api",
    agent: "codex",
    activity: "working",
    elapsed: "1m 8s",
  },
  {
    id: "design-system",
    name: "design-system",
    path: "~/web",
    agent: "opencode",
    // Since 0.8.x opencode reports through a plugin rather than being guessed
    // at, so its rows carry a state like any other agent's.
    activity: "waiting",
  },
];

/* What each workspace looks like when you land in it. Kinds: `cmd` is a shell
   prompt, `agent` a line the agent printed, `out` its quieter output, `ask` the
   question that leaves the row stuck on you, and `caret` a waiting cursor. */
export const SESSIONS = {
  "auth-refactor": [
    ["cmd", "claude"],
    ["agent", "✳ Adding one wide event per request."],
    ["out", "edited  src/log/event.ts          +96   −4"],
    ["out", "edited  src/middleware/log.ts     +41  −58"],
    ["out", "edited  src/api/charge.ts         +12   −7"],
    ["dim", ""],
    ["agent", "✳ One line per request carrying everything,"],
    ["agent", "  rather than five you have to join up later."],
    ["dim", ""],
    ["out", "running 41 tests…"],
    ["out", "✓ 38 passed    · 3 running"],
  ],
  "design-system": [
    ["cmd", "opencode"],
    ["agent", "◼ Porting the last six components off the old tokens."],
    ["dim", ""],
    ["out", "Button   ✓      Select   ✓      Dialog   ✓"],
    ["out", "Popover  ✓      Tabs     ✓      Tooltip  …"],
    ["dim", ""],
    ["agent", "◼ Tooltip still hard-codes two greys. Checking"],
    ["agent", "  whether anything depends on the old values."],
    ["out", "grep -r 'tooltip-bg'   14 matches"],
  ],
  dotfiles: [
    ["cmd", "nvim ."],
    ["dim", ""],
    ["out", "  ~/.config"],
    ["out", "  ├  ghostty/"],
    ["out", "  ├  nvim/"],
    ["out", "  ├  zsh/"],
    ["out", "  └  starship.toml"],
    ["dim", ""],
    ["out", "  4 directories, 1 file"],
    ["caret", ""],
  ],
  "search-ranking": [
    ["cmd", "codex"],
    ["agent", "◇ Reading 40k lines either side of the spike."],
    ["dim", ""],
    ["out", "14:02   rss  412MB"],
    ["out", "14:09   rss  1.1GB   after /v1/export"],
    ["out", "14:11   rss  1.4GB"],
    ["dim", ""],
    ["agent", "◇ /v1/export builds the whole CSV in memory"],
    ["agent", "  before it writes a byte. Streaming would flatten it."],
    ["dim", ""],
    ["out", "grep -c '/v1/export' api.log    1,204"],
  ],
  // A workspace whose name is the command you ran in it, which is what most of
  // them look like once you stop naming things after repositories.
  scratch: [
    ["cmd", "tmux a"],
    ["dim", ""],
    ["out", "[0] 0:zsh  1:api*  2:worker"],
    ["dim", ""],
    ["cmd", "pnpm dev"],
    ["out", "▲ ready on http://localhost:3000"],
    ["out", "○ compiling /api/charge …"],
    ["caret", ""],
  ],
};

/* Only the ones Rune adds. Copy, paste, font size and the rest behave the way
   they do in every other terminal, and listing them is noise. */
/* Only the ones Rune adds. Copy, paste and font size behave the way they do in
   every other terminal, and listing them is noise. */
/* Only what Rune adds. Copy, paste, font size and the rest behave the way they
   do in every other terminal, and listing them is noise.

   Grouped by what you're trying to do, because a flat alphabet of sixteen
   chords is a reference and these four short lists are something you can
   actually learn. */
export const KEYGROUPS = [
  {
    name: "Get there",
    keys: [
      ["⌘K", "Switch to workspace…"],
      ["⌘1–⌘9", "Jump to a workspace by position"],
      ["⌥1–⌥9", "Jump to a tab by position"],
    ],
  },
  {
    name: "Inside ⌘K",
    keys: [
      ["↑ ↓", "Move, previewing each one behind the panel"],
      ["⌘R", "Rename, in place"],
      ["⌘P", "Pin to the top"],
      ["⌘C", "Close it, and everything in it"],
    ],
  },
  {
    name: "Make one",
    keys: [
      ["⌘N", "New workspace"],
      ["⌘T", "New tab"],
      ["⌘D / ⌘⇧D", "Split right / down"],
      ["⌘⇧N", "New window"],
    ],
  },
  {
    name: "Panes",
    keys: [
      ["⌘⌥ ← ↑ ↓ →", "Focus the pane that way"],
      ["⌘⇧↵", "Zoom it, or put it back"],
      ["⌘⌥=", "Equalize the splits"],
      ["⌘W / ⌘⇧W", "Close the terminal / the window"],
    ],
  },
];

/* ---------------------------------------------------------------------------
   Fuzzy match, ported from FuzzyMatch in Sources/Rune/SwitcherPalette.swift.

   Every occurrence of the first character is tried as an anchor and the best
   alignment wins. A single greedy pass takes the first candidate character it
   sees, which is how "pro" used to score `Workspace…frontend` as highly as
   `projectx`: the obvious answer lost to an accident of path spelling.
--------------------------------------------------------------------------- */

const BOUNDARY = new Set([" ", "/", "-", "_", ".", "@"]);

function align(needle, hay, start) {
  let score = 0;
  let ni = 0;
  let last = -1;
  const hits = [];

  for (let hi = start; hi < hay.length; hi++) {
    if (ni >= needle.length || hay[hi] !== needle[ni]) continue;
    score += 1;
    if (last === hi - 1) score += 6;
    if (hi === 0) score += 12;
    else if (BOUNDARY.has(hay[hi - 1])) score += 6;
    last = hi;
    hits.push(hi);
    ni += 1;
  }
  return ni === needle.length ? { score, hits } : null;
}

export function fuzzy(needle, haystack) {
  const n = needle.toLowerCase();
  const h = haystack.toLowerCase();
  if (!n) return { score: 0, hits: [] };

  let best = null;
  for (let i = 0; i < h.length; i++) {
    if (h[i] !== n[0]) continue;
    const got = align(n, h, i);
    if (got && (best === null || got.score > best.score)) best = got;
  }
  return best;
}
