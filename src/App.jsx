import { useEffect, useState } from "react";
import Logo from "./components/Logo";
import Setup from "./components/Setup";
import StatusPanel from "./components/StatusPanel";
import TerminalDemo from "./components/TerminalDemo";
import Cmd from "./components/Cmd";
import { GHOSTTY, KEYS, OPENCODE_HOOK, RELEASES, REPO, SOURCES } from "./data";
import useRelease from "./useRelease";

/* Two pages, and the whole router. `#/setup` is the one you land on after
   pressing Download; everything else is this page. A path would read better in
   the address bar, but it would also need the host to rewrite unknown paths
   back to index.html, and a hash needs nothing and cannot 404.

   The slash is what keeps it apart from the section anchors: `#install` scrolls
   this page, `#/setup` replaces it. */
const SETUP = "#/setup";

function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return hash;
}

export default function App() {
  const release = useRelease();
  const route = useRoute();

  const onSetup = route === SETUP;

  /* A hash change scrolls to an element or, for one it doesn't recognise, does
     nothing at all — which on the way to a different page means arriving
     halfway down it. */
  useEffect(() => {
    if (onSetup) window.scrollTo({ top: 0 });
  }, [onSetup]);

  /* The dmg link is a download rather than a navigation: the browser fetches it
     and leaves the page where it is, so the page can move itself to the steps
     while the file lands. Deferred by a tick so the click's own default action
     is already underway. */
  function startDownload() {
    setTimeout(() => {
      window.location.hash = SETUP;
    }, 0);
  }

  if (onSetup) return <Setup version={release.version} downloadUrl={release.url} />;

  return (
    <div className="wrap">
      <header className="nav">
        <div className="nav__in">
          <a
            className="brand"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Logo />
            ~/Rune
          </a>
          <div className="nav__right">
            <a href={REPO} target="_blank" rel="noreferrer">
              github ↗
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* --- Hero ------------------------------------------------------- */}
        <section className="hero">
          <div className="hero__copy rise">
            <p className="label">
              built on{" "}
              <a href={GHOSTTY} target="_blank" rel="noreferrer">
                libghostty
              </a>
            </p>
            <h1>
              The terminal for humans <span className="mark">who run agents</span>.
            </h1>
            <p className="hero__sub">
              An ergonomic terminal, built for moving fast with agents. Everything is
              just a key away.
            </p>

            <div className="hero__actions">
              <a className="btn" href={release.url} onClick={startDownload}>
                Download for macOS
              </a>
            </div>
          </div>

          <div className="demo rise" style={{ animationDelay: "140ms" }}>
            <TerminalDemo />
          </div>
        </section>

        {/* --- Keys ------------------------------------------------------- */}
        <section className="section" id="keys">
          <div className="section__head">
            <h2>Everything is a chord.</h2>
          </div>

          {/* One column, most-used first. Two columns would put the tenth
              chord level with the first and undo the ordering. */}
          <div className="keys">
            {KEYS.map(([combo, what]) => (
              <div className="row row--tight" key={combo}>
                <span className="row__key">{combo}</span>
                <span>{what}</span>
              </div>
            ))}
          </div>

        </section>

        {/* --- Status ----------------------------------------------------- */}
        <section className="section" id="status">
          <div className="section__head">
            <h2>Know which one is working.</h2>
          </div>

          <p className="section__note">
            <code>working</code> counts up while it runs. <code>your turn</code> means it
            stopped. Nothing at all means a plain shell, or an agent Rune can't read.
          </p>

          <StatusPanel />

          {/* Where each state is read from. Set apart from the panel above it —
              the rows are about the panel but are not part of it, and butted
              straight up they read as more of its list. */}
          <div className="sources">
            {SOURCES.map((source) => (
              <div className="row row--tight" key={source.name}>
                <span className="row__key">{source.name}</span>
                <span>{source.detail}</span>
              </div>
            ))}
          </div>

          {/* Directly under the row that names it: "installed with one command"
              and then the command, rather than a reader holding the sentence
              while they go looking for it. */}
          <div className="hook">
            <Cmd cmd={OPENCODE_HOOK} />
            <p>
              Without it Rune guesses opencode's turn from its session database. With
              it, opencode says so itself, the moment it happens.
            </p>
          </div>
        </section>


        {/* --- Install ---------------------------------------------------- */}
        <section className="section" id="install">
          <div className="section__head">
            <h2>Install</h2>
          </div>
          <p className="section__note">
            macOS 13+, Apple Silicon and Intel. It updates itself from here on.
          </p>

          <div className="hero__actions" style={{ marginBottom: "2rem" }}>
            <a className="btn" href={release.url} onClick={startDownload}>
              Download v{release.version}
            </a>
            <a className="btn btn--ghost" href={RELEASES} target="_blank" rel="noreferrer">
              All releases
            </a>
          </div>
        </section>
      </main>

      <footer className="foot">
        <span className="foot__mark">
          <Logo size={18} />
        </span>
        <span>
          Rune is a shell around{" "}
          <a href={GHOSTTY} target="_blank" rel="noreferrer">
            libghostty
          </a>
          , which does the hard part.
        </span>
        <a href={REPO} target="_blank" rel="noreferrer">
          Sushants-Git/Rune ↗
        </a>
      </footer>
    </div>
  );
}
