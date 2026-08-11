import { useState } from "react";
import { INSTALL_STEPS, REPO } from "../data";
import Cmd from "./Cmd";
import Logo from "./Logo";

/* The page you land on when you press Download.

   The download itself has already started in the background; this is what to do
   with the file once it arrives. It is a page rather than a section because the
   moment someone needs it is the moment they have stopped reading the landing
   page — they are looking at a dmg in their Downloads folder and at a dialog
   that says the app is damaged.

   Four steps, each with room for a picture. Numbers on the left, one sentence
   each, and the only step that asks anything unusual of you carries the command
   that does it. */
export default function Setup({ version, downloadUrl }) {
  return (
    <div className="wrap">
      <header className="nav">
        <div className="nav__in">
          <a className="brand" href="#">
            <Logo />
            ~/Rune
          </a>
          <div className="nav__right">
            <a href="#">← back</a>
            <a href={REPO} target="_blank" rel="noreferrer">
              github ↗
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="setup">
          <p className="label">Rune {version}</p>
          <h1>Thanks for downloading.</h1>
          <p className="section__note" style={{ marginTop: "1rem" }}>
            Your download will begin automatically. If it didn't start,{" "}
            <a className="link" href={downloadUrl}>
              download Rune manually
            </a>
            .
          </p>

          <ol className="setup__list">
            {INSTALL_STEPS.map((step, i) => (
              <li className="setup__step" key={step.title}>
                <div className="setup__body">
                  <span className="setup__n">{String(i + 1).padStart(2, "0")}</span>
                  <div className="setup__text">
                    <h2>{step.title}</h2>
                    <p>{step.desc}</p>
                    {step.cmd && <Cmd cmd={step.cmd} />}
                  </div>
                </div>
                <Shot src={step.shot} alt={step.title} />
              </li>
            ))}
          </ol>

          <p className="section__note" style={{ marginTop: "2.4rem" }}>
            Anything else is in the{" "}
            <a className="link" href={REPO} target="_blank" rel="noreferrer">
              README
            </a>
            .
          </p>
        </section>
      </main>

      <footer className="foot">
        <span className="foot__mark">
          <Logo size={18} />
        </span>
        <a href="#">← the rest of the page</a>
      </footer>
    </div>
  );
}

/* A picture that isn't there yet leaves nothing behind rather than a broken
   image icon: the frame unmounts on the first error, so the step is just words
   until a file exists at that path. */
function Shot({ src, alt }) {
  const [missing, setMissing] = useState(false);
  if (!src || missing) return null;

  return (
    <figure className="shot">
      <img src={src} alt={alt} loading="lazy" onError={() => setMissing(true)} />
    </figure>
  );
}
