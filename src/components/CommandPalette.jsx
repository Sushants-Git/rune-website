import { useEffect, useMemo, useRef, useState } from "react";
import { WORKSPACES, fuzzy } from "../data";
import AgentIcon from "./AgentIcon";
import Badge from "./Badge";

/* The ⌘K switcher, working the way it does in the app: type to filter by the
   name on the row and nothing else, ↑/↓ to move, ⏎ to pick, ⎋ to clear.

   Filtering uses the same scoring function the terminal uses, ported from
   SwitcherPalette.swift, so `usl` really does find `usr-local` here too. */
export default function CommandPalette({
  onPick,
  onClose,
  onTakeover,
  onHighlight,
  inputRef,
  currentId,
  scripted = false,
  scriptSelection = 0,
  openToken = 0,
}) {
  const [query, setQuery] = useState("");
  const [ownSelection, setOwnSelection] = useState(0);
  const listRef = useRef(null);

  // While the demo is driving, the highlighted row comes from outside.
  const selection = scripted ? scriptSelection : ownSelection;
  const setSelection = scripted ? () => {} : setOwnSelection;

  const rows = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return WORKSPACES.map((w) => ({ ...w, hits: [] }));

    return WORKSPACES.map((w, index) => {
      const got = fuzzy(trimmed, w.name);
      return got ? { ...w, hits: got.hits, score: got.score, index } : null;
    })
      .filter(Boolean)
      .sort((a, b) => (a.score !== b.score ? b.score - a.score : a.index - b.index));
  }, [query]);

  // Filtering can shrink the list out from under the selection.
  useEffect(() => {
    setOwnSelection((s) => Math.min(s, Math.max(rows.length - 1, 0)));
  }, [rows.length]);

  /* Keep the highlighted row in view by scrolling the list, and only the list.

     This was `row.scrollIntoView({ block: "nearest" })`, which scrolls the
     nearest scrollable ancestor — and when the list is short enough not to
     overflow, that ancestor is the document. So every step of the opening
     demo, which walks the highlight down five rows, scrolled the page back up
     to the panel while you were reading something further down. */
  useEffect(() => {
    const list = listRef.current;
    const row = list?.children[selection];
    if (!list || !row) return;

    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = bottom - list.clientHeight;
    }
  }, [selection]);

  /* Every ⌘K starts on the workspace you are in, which the parent hands over as
     `scriptSelection`. Opening on the first row instead would mean the window
     behind the palette jumped somewhere else before you had pressed anything.

     Only ⌘K bumps the token. Typing must not, or the reset lands mid-word and
     clears the query out from under you. */
  useEffect(() => {
    if (!openToken) return;
    setQuery("");
    setOwnSelection(scriptSelection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openToken]);

  // Taking over some other way (clicking in, typing while the demo runs) keeps
  // the row the demo was on rather than snapping back to the top.
  const wasScripted = useRef(scripted);
  useEffect(() => {
    if (wasScripted.current && !scripted) setOwnSelection(scriptSelection);
    wasScripted.current = scripted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scripted]);

  // Whatever is highlighted is what the terminal behind shows, so moving the
  // selection is also a preview. Reported by id so a re-render of the same row
  // doesn't churn the parent.
  const highlighted = rows[selection] ?? null;
  useEffect(() => {
    onHighlight?.(highlighted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlighted?.id]);

  function handleKey(e) {
    if (e.key === "ArrowDown" || (e.ctrlKey && e.key === "n")) {
      e.preventDefault();
      if (rows.length) setSelection((s) => (s + 1) % rows.length);
    } else if (e.key === "ArrowUp" || (e.ctrlKey && e.key === "p")) {
      e.preventDefault();
      if (rows.length) setSelection((s) => (s - 1 + rows.length) % rows.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (rows[selection]) onPick?.(rows[selection]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      // Escape clears what you typed; a second one puts the palette away, which
      // is the order you'd want when you're halfway through a search.
      if (query) {
        setQuery("");
        setSelection(0);
      } else {
        onClose?.();
      }
    }
  }

  return (
    <div className="panel">
      <div className="pal__field">
        <Glass />
        <input
          ref={inputRef}
          className="pal__input"
          value={query}
          onChange={(e) => {
            onTakeover?.();
            setQuery(e.target.value);
            setOwnSelection(0);
          }}
          onFocus={() => onTakeover?.()}
          onKeyDown={handleKey}
          placeholder="Search workspaces…"
          spellCheck="false"
          autoComplete="off"
          role="combobox"
          aria-label="Search workspaces"
          aria-expanded={rows.length > 0}
          aria-controls="pal-list"
          aria-activedescendant={rows[selection] ? `pal-${rows[selection].id}` : undefined}
        />
        <span className="cap">⌘K</span>
      </div>

      <div className="panel__rule" />

      {rows.length === 0 ? (
        <p className="pal__empty">No workspaces match</p>
      ) : (
        <ul id="pal-list" className="pal__list" ref={listRef} role="listbox" aria-label="Workspaces">
          {rows.map((row, i) => (
            <li
              key={row.id}
              id={`pal-${row.id}`}
              className="pal__row"
              data-sel={i === selection}
              role="option"
              aria-selected={i === selection}
              /* No hover-to-select. The highlighted row drives the window
                 behind the palette, so letting a passing cursor move it would
                 repaint the terminal every time the mouse crossed the list. */
              onClick={() => onPick?.(row)}
            >
              <AgentIcon agent={row.agent} program={row.program} />

              <span className="pal__name">
                <Highlight text={row.name} hits={row.hits} />
              </span>
              {/* A pinned row is already at the top; the glyph says why it's
                  there, rather than leaving you to work it out. */}
              {row.pinned && <Pin />}
              <span className="pal__path">{row.path}</span>
              <span className="pal__spacer" />

              <Badge activity={row.activity} detail={row.detail} elapsed={row.elapsed} />
              {row.id === currentId && (
                <span className="pal__chip pal__chip--now">current</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="panel__rule" />

      {/* The same four as hintBar() in SwitcherPalette.swift, and only those
          four. Arrows moving a selection and ⏎ taking it are what every list on
          the machine already does, so spelling them out spent half the bar
          teaching nobody anything and crowded out the ones particular to Rune.
          `esc` says Dismiss rather than Close, because ⌘W closes a workspace
          and two rows both labelled Close would be a riddle in the one place
          that exists to answer them. */}
      <div className="pal__foot">
        <Hint keys={["⌘R"]} label="Rename" />
        <Hint keys={["⌘P"]} label="Pin" />
        <Hint keys={["⌘W"]} label="Close" />
        <Hint keys={["esc"]} label="Dismiss" />
      </div>
    </div>
  );
}

function Highlight({ text, hits }) {
  if (!hits?.length) return text;
  const set = new Set(hits);
  return [...text].map((ch, i) =>
    set.has(i) ? <mark key={i}>{ch}</mark> : <span key={i}>{ch}</span>
  );
}

function Hint({ keys, label }) {
  return (
    <span className="pal__hint">
      {keys.map((k) => (
        <span className="cap" key={k}>
          {k}
        </span>
      ))}
      {label}
    </span>
  );
}

function Pin() {
  return (
    <svg
      className="pal__pin"
      width="10"
      height="10"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-label="Pinned"
    >
      <path d="M9.6 1.2a1 1 0 0 1 1.5 0l3.7 3.7a1 1 0 0 1-.5 1.7l-1.8.4-3 3 .3 2.1a1 1 0 0 1-1.7.9L5.4 10.6l-3.3 3.3a.7.7 0 0 1-1-1l3.3-3.3-2.4-2.7a1 1 0 0 1 .9-1.7l2.1.3 3-3 .4-1.8a1 1 0 0 1 .2-.5Z" />
    </svg>
  );
}

function Glass() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.4" stroke="currentColor" strokeWidth="1.4" opacity="0.34" />
      <path
        d="M10.4 10.4 14 14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.34"
      />
    </svg>
  );
}
