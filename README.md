# rune-website

Landing page for [Rune](https://github.com/Sushants-Git/Rune), a macOS terminal
built on libghostty.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview
```

Vite + React, plain CSS with custom properties in `styles.css`. No framework, no
CSS-in-JS, no state library. Colours are OKLCH where they need mixing.

## What's here

Warm paper, small type, and one dark thing: the ⌘K panel, because that is the
app itself. Everything on the page is a row — a mono key on the left, plain
words on the right — and every section carries a keyboard shortcut, because a
page about never leaving the keyboard should not need a mouse to read.

The interactive pieces are real rather than screenshots:

| | |
| --- | --- |
| `components/TerminalDemo.jsx` | The hero. Plays one round on load, arrowing through the switcher and previewing each workspace behind it, then hands over: the panel stays up, the field takes focus, and typing filters. |
| `components/CommandPalette.jsx` | The switcher itself. Filtering uses `fuzzy()` in `data.js`, ported line for line from `FuzzyMatch` in `SwitcherPalette.swift`, so `usl` ranks `usr-local` the way the terminal does. |
| `components/StatusPanel.jsx` | The same panel, still, in the states section. |
| `components/KeyBar.jsx` | The page's own hint bar, shaped like the one at the foot of ⌘K. |
| `components/Badge.jsx` | The activity readout, mirroring `ActivityBadge` in `Activity.swift`: the agent's own words when they are short enough, the elapsed clock only while `working`. |

## Keeping it true

Most of what this page claims is checkable against the app, and several claims
have been wrong at some point because they were written from the source rather
than from the data:

- **`data.js` is the file to change** when `Activity.swift` gains or loses a
  state. It carries the two states and silence, and the comments record why
  there is no third.
- **`components/ProgramIcons.jsx` is generated**, not hand-written. The marks
  are extracted from `Sources/Rune/ProgramIcon.swift` so the site cannot show a
  mark the app does not ship. Only the ones a demo row flies are included; Rune
  itself knows 24.
- **Details on a row are only what an agent really publishes.** Claude Code
  writes a bare status, so its rows say `working` and the clock. Codex is the
  one that names a tool. Read a real `~/.claude/sessions/<pid>.json` before
  adding a string to a badge.

## The download button

`useRelease.js` asks the GitHub Releases API on load and points the button at
whatever `.dmg` is latest, because a version baked into the page is wrong the
moment the next tag ships. If the call fails it falls back to
`/releases/latest`, which never 404s.

A static permalink would be better still, but GitHub's
`/releases/latest/download/<name>` needs a fixed asset name and Rune's carries
the version. Upload a second, version-less copy of the dmg in the release
workflow and this file can go.
