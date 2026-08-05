import { WORKSPACES } from "../data";
import AgentIcon from "./AgentIcon";
import Badge from "./Badge";

/* The indicators, shown on the thing they appear on rather than described in a
   legend beside it. A row of ⌘K is small enough to reproduce exactly, so there
   is no reason to make anyone map a swatch back onto a screenshot.

   The same five rows as the switcher in the hero, so this is the panel you have
   already seen rather than a diagram of it. Between them they cover the whole
   vocabulary: two working with the clock running, one waiting on you, and two
   plain programs that say nothing at all. */
export default function StatusPanel() {
  const rows = WORKSPACES;

  return (
    <div className="panel statuspanel" aria-label="The ⌘K switcher">
      <div className="pal__field">
        <Glass />
        <span className="pal__input pal__input--still">Search workspaces…</span>
        <span className="cap">⌘K</span>
      </div>

      <div className="panel__rule" />

      <ul className="pal__list">
        {rows.map((row) => (
          <li className="pal__row" key={row.id}>
            <AgentIcon agent={row.agent} program={row.program} />
            <span className="pal__name">{row.name}</span>
            <span className="pal__path">{row.path}</span>
            <span className="pal__spacer" />
            <Badge activity={row.activity} detail={row.detail} elapsed={row.elapsed} />
          </li>
        ))}
      </ul>
    </div>
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
