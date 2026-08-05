import { ACTIVITY } from "../data";

/* The readout on a ⌘K row: a dot plus what the terminal is doing. A coloured
   dot on its own is a riddle; the words are the answer to it. Nothing at all is
   shown for `idle`, which is the right amount to say about a terminal Rune
   knows nothing about.

   Mirrors ActivityBadge in Sources/Rune/Activity.swift:

   - The agent's own word for it beats Rune's generic one, since "answer it"
     tells you more than "your turn" ever could. Only while it stays short — a
     notification body is a sentence, and a sentence in a badge truncates to
     nonsense and squeezes the row's name out of the way to do it.
   - Only `working` carries an elapsed time. Once it's your turn, how long it
     has been stopped is not something you can act on. */
const MAX_DETAIL = 22;

export default function Badge({ activity, detail, elapsed }) {
  const state = ACTIVITY[activity];
  if (!state?.label) return null;

  const short = detail && detail.length <= MAX_DETAIL;
  const text = short ? detail : state.label;

  return (
    <span className="badge" style={{ "--tone": state.tone }} title={detail ?? undefined}>
      <i className="badge__dot" data-pulse={state.pulses} />
      {text}
      {activity === "working" && elapsed && <em>· {elapsed}</em>}
    </span>
  );
}
