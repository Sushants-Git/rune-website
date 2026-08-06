import KeyBar from "./components/KeyBar";
import Logo from "./components/Logo";
import Quarantine from "./components/Quarantine";
import StatusPanel from "./components/StatusPanel";
import TerminalDemo from "./components/TerminalDemo";
import { AXES, KEYGROUPS, LIMITS, RELEASES, REPO, SOURCES } from "./data";
import useRelease from "./useRelease";

export default function App() {
  const release = useRelease();

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
            <a href="#keys">keys</a>
            <a href="#install">install</a>
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
            <p className="label">macOS · built on libghostty</p>
            <h1>
              The terminal for humans <span className="mark">who run agents</span>.
            </h1>
            <p className="hero__sub">
              Four agents running, four terminals that look identical. Rune keeps them
              apart, tells you which one is waiting on you, and never asks you to reach
              for the mouse to find out.
            </p>

            <div className="hero__actions">
              <a className="btn" href={release.url}>
                Download for macOS
                <kbd className="kbd kbd--on-ink">d</kbd>
              </a>
              <a className="btn btn--ghost" href={REPO} target="_blank" rel="noreferrer">
                <Mark /> Source
              </a>
            </div>


            <div className="hero__caveat">
              <Quarantine />
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
            <kbd className="kbd kbd--head">k</kbd>
          </div>

          <div className="keygrid">
            {KEYGROUPS.map((group) => (
              <div className="keygroup" key={group.name}>
                <p className="label">{group.name}</p>
                {group.keys.map(([combo, what]) => (
                  <div className="row row--tight" key={combo}>
                    <span className="row__key">{combo}</span>
                    <span>{what}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="section__note" style={{ marginTop: "2rem" }}>
            Everything else is libghostty, and it reads the{" "}
            <code>~/.config/ghostty/config</code> you already have.
          </p>
        </section>

        {/* --- Axes ------------------------------------------------------- */}
        <section className="section" id="layout">
          <div className="section__head">
            <h2>Three places to put a terminal.</h2>
            <kbd className="kbd kbd--head">p</kbd>
          </div>
          <p className="section__note">
            Each list holds one kind of thing, so no strip ever grows past reading it.
          </p>

          {AXES.map((a) => (
            <div className="row" key={a.key}>
              <span className="row__key">{a.key}</span>
              <span className="row__name">{a.name}</span>
              <span className="row__desc">{a.desc}</span>
            </div>
          ))}
        </section>

        {/* --- Status ----------------------------------------------------- */}
        <section className="section" id="status">
          <div className="section__head">
            <h2>Know which one is working.</h2>
            <kbd className="kbd kbd--head">s</kbd>
          </div>
          <p className="section__note">
            Every row says what that terminal is doing, in words.
          </p>

          <StatusPanel />

          <p className="section__note" style={{ marginTop: "1.6rem" }}>
            <code>working</code> counts up while it runs. <code>your turn</code> means it
            stopped, at its prompt or on a question. Nothing at all means a plain shell,
            or an agent Rune can't read: a guess shown as fact is worse than silence.
          </p>

          {SOURCES.map((source) => (
            <div className="row row--tight" key={source.name}>
              <span className="row__key">{source.name}</span>
              <span>{source.detail}</span>
            </div>
          ))}
        </section>


        {/* --- Limits ----------------------------------------------------- */}
        <section className="section" id="limits">
          <div className="section__head">
            <h2>What it doesn't do.</h2>
            <kbd className="kbd kbd--head">w</kbd>
          </div>
          <p className="section__note">
            A program that watches every terminal you have open owes you the other
            half of the story. Both of these are checkable in the source.
          </p>

          <div className="limits">
            {LIMITS.map((limit) => (
              <div className="limit" key={limit.name}>
                <h3>{limit.name}</h3>
                <p>{limit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Install ---------------------------------------------------- */}
        <section className="section" id="install">
          <div className="section__head">
            <h2>Install</h2>
            <kbd className="kbd kbd--head">i</kbd>
          </div>
          <p className="section__note">
            One universal disk image, Apple Silicon and Intel. Drag it into{" "}
            <code>/Applications</code>. After that Rune updates itself.
          </p>

          <div className="hero__actions" style={{ marginBottom: "2rem" }}>
            <a className="btn" href={release.url}>
              Download v{release.version}
              <kbd className="kbd kbd--on-ink">d</kbd>
            </a>
            <a className="btn btn--ghost" href={RELEASES} target="_blank" rel="noreferrer">
              All releases
            </a>
          </div>


          {release.recent.length > 0 && (
            <>
              <p className="section__note" style={{ marginTop: "2.4rem" }}>
                Recent releases, read from GitHub as you loaded this page:
              </p>

              <ul className="ships">
                {release.recent.map((r) => (
                  <li key={r.tag}>
                    <a href={r.url} target="_blank" rel="noreferrer">
                      <span className="ships__tag">v{r.tag}</span>
                      <span className="ships__when">{r.when}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>

      <footer className="foot">
        <span className="foot__mark">
          <Logo size={18} />
        </span>
        <span>
          Rune is a shell around{" "}
          <a href="https://github.com/ghostty-org/ghostty" target="_blank" rel="noreferrer">
            libghostty
          </a>
          , which does the hard part.
        </span>
        <a href={REPO} target="_blank" rel="noreferrer">
          Sushants-Git/Rune ↗
        </a>
      </footer>

      <KeyBar downloadUrl={release.url} />
    </div>
  );
}



function Mark() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.89.87 2.35.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.83 1.28.83 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}
