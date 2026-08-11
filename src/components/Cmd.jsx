import { useState } from "react";

/* A single command to copy. Not a numbered step: there is one of it, and the
   prompt says so better than an "01" nothing follows.

   Its own file because two places now need it — the caveat beside the download
   button and step three of the install page — and the same command copied by
   two different buttons would eventually be two different commands. */
export default function Cmd({ cmd, note }) {
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
