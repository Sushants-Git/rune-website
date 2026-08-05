import { useEffect, useState } from "react";

/* The page's own hint bar, in the shape of the one at the foot of ⌘K.

   A page about never leaving the keyboard that can only be read by scrolling it
   is arguing against itself. So the site takes its own advice: every section has
   a key, the bar says which, and the cap lights up when you press it. It is the
   product's whole claim, made in the only way a web page can actually make it.

   Nothing here is the only way to reach anything — it sits alongside scrolling
   and the nav links rather than replacing them. */
const KEYS = [
  { key: "k", label: "Keys", to: "#keys" },
  { key: "p", label: "Places", to: "#layout" },
  { key: "s", label: "States", to: "#status" },
  { key: "i", label: "Install", to: "#install" },
  { key: "d", label: "Download", to: "download" },
];

export default function KeyBar({ downloadUrl }) {
  const [hit, setHit] = useState(null);

  useEffect(() => {
    let clear;

    function onKey(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      /* Whatever you are typing into wins. The demo's switcher takes focus when
         it hands over, and a page shortcut that stole `k` out of a search field
         would be exactly the kind of hijacking this bar is meant to argue
         against. ⎋ gives the keyboard back. */
      const active = document.activeElement;
      const typing =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.isContentEditable);
      if (typing) {
        if (event.key === "Escape") active.blur();
        return;
      }

      const match = KEYS.find((k) => k.key === event.key);
      if (!match) return;
      event.preventDefault();

      if (match.to === "download") {
        window.location.href = downloadUrl;
      } else {
        document.querySelector(match.to)?.scrollIntoView({ behavior: "smooth" });
      }

      setHit(match.key);
      clearTimeout(clear);
      clear = setTimeout(() => setHit(null), 320);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(clear);
    };
  }, [downloadUrl]);

  return (
    <div className="keybar" aria-hidden="true">
      {KEYS.map((k) => (
        <span className="keybar__hint" key={k.key}>
          <kbd className="kbd" data-hit={hit === k.key}>{k.key}</kbd>
          {k.label}
        </span>
      ))}
    </div>
  );
}
