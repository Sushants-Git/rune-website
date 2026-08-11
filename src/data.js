export const REPO = "https://github.com/Sushants-Git/Rune";
export const RELEASES = `${REPO}/releases`;

/* The thing doing the hard part. Named twice on the page — once at the top and
   once at the bottom — so the address lives here rather than in two places that
   can disagree. */
export const GHOSTTY = "https://github.com/ghostty-org/ghostty";

/* Only a fallback label. The button's real href and version come from the
   Releases API at run time (see useRelease.js), because a version baked in here
   is wrong the moment the next tag ships, and this page already shipped three
   releases out of date. */
export const VERSION = "0.13.7";

/* Rune is ad-hoc signed, not signed with a Developer ID, so macOS quarantines
   the download and refuses the first launch. Saying so plainly beats letting
   someone meet "Rune is damaged" with no explanation and conclude the download
   is broken — it isn't, it's unsigned, which is a different and fixable thing.

   The Control-click → Open route quietly stopped working in macOS 15, so the
   command is the answer that holds everywhere and the Settings path is the
   one for people who would rather not paste a command. */
export const QUARANTINE = "xattr -dr com.apple.quarantine /Applications/Rune.app";

/* What happens after the download, on its own page.

   Four steps, because there are four: the dmg, the drag, the flag, the launch.
   Three of them are what every unsigned Mac app asks of you and the fourth is
   the one that goes wrong — and a person who has just clicked Download is
   exactly the person who needs them, which is why the button goes here rather
   than leaving the instructions further down a page they have stopped reading.

   `shot` is where each step's picture goes. Drop a file at that path in
   `public/` and it appears; until then the frame stays empty rather than
   showing a broken image.

   `shotWidth` caps one of them. The first two are whole windows and the last is
   a patch of a Finder window, so left at the same width its icons came out
   twice the size of the same icon two steps above — the pictures have to agree
   about how big a Mac is. */
export const INSTALL_STEPS = [
  {
    title: "Open Rune.dmg",
    desc: "From your Downloads folder, or the browser's download list.",
    shot: "/steps/1-open-dmg.png",
    // 319px wide as captured; the frame would otherwise stretch it to 640 and
    // hand you a blurred picture of a crisp one.
    shotWidth: 320,
  },
  {
    title: "Drag Rune into Applications",
    desc: "Onto the folder beside it in the window that opens.",
    shot: "/steps/2-drag.png",
  },
  {
    title: "Clear the quarantine flag",
    desc: "Rune is signed ad-hoc, so macOS calls it damaged on first launch. It isn't. Run this once, or use System Settings → Privacy & Security → Open Anyway.",
    cmd: QUARANTINE,
    shot: "/steps/3-terminal.png",
  },
  {
    title: "Open Rune from Applications",
    desc: "It picks up the ~/.config/ghostty/config you already have.",
    shot: "/steps/4-open.png",
    shotWidth: 320,
  },
];

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

   One list, ordered by how often you reach for it rather than by what part of
   the app it belongs to. The four thematic groups this replaced read as a
   reference — you had to know which box a chord lived in before you could find
   it — and the chords you press fifty times a day were scattered one per box.
   Frequency puts them together at the top, where someone learning Rune will
   actually stop reading.

   ⌘W is one row rather than two. It closed a terminal in the Panes group and a
   ⌘K row in the switcher group, and since 0.13.7 those are the same key doing
   the same thing to whatever you are looking at. */
export const KEYS = [
  ["⌘K", "Switch to workspace…"],
  ["⌘N", "New workspace"],
  ["⌘W", "Close the terminal, or the ⌘K row"],
  ["⌘P", "Pin a workspace to the top of ⌘K"],
  ["⌘1–⌘9", "Jump to a workspace by position"],
  ["⌘R", "Rename a workspace, in place"],
  ["⌥1–⌥9", "Jump to a tab by position"],
  ["↑ ↓", "Move through ⌘K, previewing each one"],
  ["⌘T", "New tab"],
  ["⌘D / ⌘⇧D", "Split right / down"],
  ["⌘F", "Find in the scrollback"],
  ["⌘G / ⌘⇧G", "Next / previous match"],
  ["⌘⌥ ← ↑ ↓ →", "Focus the pane that way"],
  ["⌘⇧[ / ⌘⇧]", "Previous / next tab"],
  ["⌘⇧↵", "Zoom a pane, or put it back"],
  ["⌘⌥=", "Equalize the splits"],
  ["⌘⇧N", "New window"],
  ["⌘⇧W", "Close the window"],
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
