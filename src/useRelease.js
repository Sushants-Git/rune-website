import { useEffect, useState } from "react";
import { RELEASES, VERSION } from "./data";

/* The download button, resolved at run time rather than baked in.

   A hard-coded version is wrong the moment a release ships, and this page has
   already shipped pointing at a version three releases old. The Releases API is
   public, CORS-open, and the authority on what "latest" means, so ask it.

   Until it answers (and forever, if it doesn't) the button points at
   /releases/latest, which is a permalink GitHub resolves itself. That link is
   never wrong, only one click slower than going straight at the file. */
const API = "https://api.github.com/repos/Sushants-Git/Rune/releases/latest";

const FALLBACK = { version: VERSION, url: RELEASES, direct: false };

export default function useRelease() {
  const [release, setRelease] = useState(FALLBACK);

  useEffect(() => {
    const abort = new AbortController();

    fetch(API, {
      signal: abort.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data) => {
        // The dmg is the one a person opens; the zip beside it is what the
        // in-app updater downloads unattended.
        const dmg = data.assets?.find((asset) => asset.name?.endsWith(".dmg"));
        if (!dmg) return;
        setRelease({
          version: String(data.tag_name ?? "").replace(/^v/, "") || VERSION,
          url: dmg.browser_download_url,
          direct: true,
        });
      })
      .catch(() => {
        /* Rate-limited, offline, or blocked. The fallback link still works. */
      });

    return () => abort.abort();
  }, []);

  return release;
}
