import { useEffect, useRef, useState } from "react";
import { SESSIONS, WORKSPACES } from "../data";
import CommandPalette from "./CommandPalette";

/* A terminal that shows you the ⌘K switcher, then gets out of the way and asks
   you to use it.

   It plays exactly one round and stops. A demo that loops forever is a demo
   nobody can touch: it competes for attention with the copy beside it, and any
   attempt to try the thing fights an animation that is still driving. So the
   round runs, hands over, and turns into a job.

   The job matters more than the sandbox. Fourteen workspaces, two of them
   blocked and both below the fold, is the argument the page is making — you
   cannot eyeball that, and ⌘K finds either one in a keystroke. An empty prompt
   would teach nobody that. */

/* Rows the single demo round arrows through. Enough presses to show that the
   window behind the palette previews each one, and it stops on a working agent
   rather than a blocked one so it doesn't answer the question it's about to
   ask. */
const DEMO_PRESSES = 3;

/* Kept tight on purpose. A hero demo has a few seconds of attention before the
   scroll, so nothing waits around.

   The round opens with the palette already up. A terminal is a black rectangle
   and the switcher is the entire product, so spending the first second of
   someone's attention on the rectangle spends it on the wrong thing. Starting
   open also gives the round a better shape: it shows you the list, uses it, then
   takes it away and asks you to bring it back. */
const STEP = {
  settleIn: 760, // the open palette, before anything moves
  move: 260, // one arrow key, and one preview behind the palette
  settle: 620, // sitting on the row you wanted
  after: 420, // the swapped terminal, before it hands over
};

export default function TerminalDemo() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(true); // the page opens on the switcher
  const [selection, setSelection] = useState(0);
  const [live, setLive] = useState(false);
  const [livePreview, setLivePreview] = useState(null);
  const [openToken, setOpenToken] = useState(0);
  const [nudge, setNudge] = useState(false);
  const [done, setDone] = useState(false); // the demo round has finished
  const inputRef = useRef(null);
  const stageRef = useRef(null);

  // The listeners below are bound once, so they read the current workspace off
  // a ref rather than closing over a stale one.
  const activeRef = useRef(0);
  activeRef.current = active;

  /* Two different things, and conflating them cost an afternoon: ⌘K *opens* the
     palette and resets it to the workspace you're in, while touching it any
     other way merely stops the demo driving. Bumping the open token on every
     keystroke meant the reset ran mid-word and ate what you typed. */
  function openPalette() {
    setSelection(activeRef.current);
    setLive(true);
    setOpen(true);
    setOpenToken((n) => n + 1);
  }

  function engage() {
    setLive(true);
    setOpen(true);
  }

  useEffect(() => {
    let timer;

    function onKey(e) {
      // ⌘K anywhere on the page, exactly as it behaves in the app.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
        requestAnimationFrame(() => {
          // preventScroll, or focusing yanks the page down to the panel and
          // undoes whatever scroll the keystroke was part of.
          inputRef.current?.focus({ preventScroll: true });
          inputRef.current?.select();
        });
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      /* Someone typing at a terminal that isn't really a terminal gets no
         feedback at all, which reads as broken. Rather than fake a shell, bump
         the one key that does something so they know where to go. */
      const typing = e.key.length === 1 || e.key === "Enter" || e.key === "Backspace";
      if (typing && !document.activeElement?.closest?.(".term__palette")) {
        setNudge(true);
        clearTimeout(timer);
        timer = setTimeout(() => setNudge(false), 620);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (live) return;

    // Someone who has asked for less motion skips straight to their turn; the
    // ⌘K hint still tells them what to press.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }

    let stopped = false;
    const timers = new Set();
    const wait = (ms) =>
      new Promise((resolve) => {
        const id = setTimeout(resolve, ms);
        timers.add(id);
      });

    (async () => {
      // Already open, and highlighting the workspace you are in, so nothing
      // behind the panel lurches before the first arrow.
      let row = 0;
      setSelection(row);
      setOpen(true);

      await wait(STEP.settleIn);
      if (stopped) return;

      for (let press = 0; press < DEMO_PRESSES; press++) {
        row = (row + 1) % WORKSPACES.length;
        setSelection(row);
        await wait(STEP.move);
        if (stopped) return;
      }

      await wait(STEP.settle);
      if (stopped) return;

      /* And it stops there with the panel still up. The switcher is the thing
         worth looking at, so the demo has no business putting it away when it
         finishes — it hands over mid-list, with everything still on screen to
         arrow through. The only thing that closes it is you picking a row,
         which is what ⏎ does in the app. */
      setActive(row);
      await wait(STEP.after);
      if (stopped) return;

      setDone(true);
    })();

    return () => {
      stopped = true;
      timers.forEach(clearTimeout);
    };
  }, [live]);

  /* The round ends with the panel still up, so the field under the cursor has to
     be the one that receives what you type. An open switcher that silently
     swallows the first thing typed at it is worse than no switcher at all.

     Only when it's actually on screen, and never scrolling the page to do it. */
  useEffect(() => {
    if (!done || live) return;
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return;
    const onScreen = box.top < window.innerHeight * 0.85 && box.bottom > window.innerHeight * 0.15;
    if (onScreen) inputRef.current?.focus({ preventScroll: true });
  }, [done, live]);

  /* And it gives the keyboard back when you scroll away, so space and the arrow
     keys go on scrolling the page rather than typing into a field nobody can
     see any more. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && document.activeElement === inputRef.current) {
          inputRef.current.blur();
        }
      },
      { threshold: 0.25 }
    );
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  /* With the palette up, the window behind it shows whatever row is highlighted
     rather than the workspace you are still in. Arrowing down is therefore a
     way to read what every agent is doing without leaving where you are, and
     ⏎ just keeps the one you stopped on.

     While the demo drives, nothing is filtered, so the highlight maps straight
     onto the list. Once you take over you can type, and the palette reports the
     matching row back instead. */
  const preview = live ? livePreview : WORKSPACES[selection];
  const workspace = (open && preview) || WORKSPACES[active];

  return (
    <>
      <div className="demo__frame">
        <div className="stage" data-open={open} ref={stageRef}>
          <div className="term">
            <div className="term__bar">
              <span className="term__lights">
                <i style={{ background: "#ff5f57" }} />
                <i style={{ background: "#febc2e" }} />
                <i style={{ background: "#28c840" }} />
              </span>
              <span className="term__title">
                {workspace.name} — {workspace.path}
              </span>
            </div>

            <div className="term__body" key={workspace.id}>
              {SESSIONS[workspace.id].map(([kind, text], i) => (
                <p className={`ln ln--${kind}`} key={i}>
                  {kind === "cmd" && <b>❯ </b>}
                  {text}
                  {(kind === "caret" || (kind === "cmd" && !text)) && (
                    <i className="caret" />
                  )}
                </p>
              ))}
            </div>

            <span
              className="term__hint"
              data-nudge={nudge}
              data-asking={done && !live && !open}
              aria-hidden="true"
            >
              <b>⌘</b>
              <b>K</b>
            </span>
          </div>

          <div className="term__veil" />

          <div className="term__palette">
            <CommandPalette
              inputRef={inputRef}
              currentId={WORKSPACES[active].id}
              scripted={!live}
              scriptSelection={selection}
              openToken={openToken}
              onTakeover={engage}
              onHighlight={setLivePreview}
              onClose={() => setOpen(false)}
              onPick={(row) => {
                setActive(WORKSPACES.findIndex((w) => w.id === row.id));
                setOpen(false);
              }}
            />
          </div>
        </div>
      </div>

    </>
  );
}

