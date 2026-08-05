import { useState } from "react";
import { QUARANTINE } from "../data";

/* The one thing that will go wrong, said next to the button that causes it.

   It appears twice, beside the hero download and again under the install one,
   because someone who downloads from the top and never scrolls will meet "Rune
   is damaged" with no explanation and reasonably conclude the download is
   broken. Leading with the beta rather than with the scary dialog puts it where
   it belongs: a thing not done yet, not a defence against an accusation.

   One component rather than two copies, so the wording can't drift between the
   place people hit the problem and the place it's explained. */
export default function Quarantine() {
  return (
    <>
      <p className="note">
        <b>Rune is still in beta.</b> No paid Developer ID yet, so macOS blocks the
        first launch and calls the app damaged. Clear the flag once and it never comes
        back:
      </p>
      <Cmd cmd={QUARANTINE} note="or: System Settings → Privacy & Security → Open Anyway" />
    </>
  );
}

/* A single command to copy. Not a numbered step: there is one of it, and the
   prompt says so better than an "01" nothing follows. */
function Cmd({ cmd, note }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(cmd);
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    } catch {
      /* clipboard blocked; the command is right there to select */
    }
  }

  return (
    <div className="step">
      <span className="step__n">$</span>
      <span style={{ minWidth: 0 }}>
        <span className="step__cmd">{cmd}</span>
        {note && <span className="step__note">{note}</span>}
      </span>
      <button
        className="copy"
        onClick={copy}
        data-done={done}
        aria-label={done ? "Copied" : "Copy command"}
        title={done ? "Copied" : "Copy"}
      >
        {done ? <Tick /> : <Clipboard />}
      </button>
    </div>
  );
}

function Clipboard() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="5.6"
        y="5.6"
        width="8.4"
        height="9.4"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M10.6 3.4V3a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v6.6a2 2 0 0 0 2 2h.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Tick() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m3 8.6 3.4 3.4L13 4.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
