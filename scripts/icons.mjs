import { chromium } from "playwright";
import { readFileSync } from "fs";

/* The icons Google and iOS want, rendered from the one favicon.svg so there is
   still a single source for the mark. Google Search does not read SVG
   favicons; iOS screenshots the page when there is no apple-touch-icon. */
const svg = readFileSync("/Users/sushantmishra/rune-website/public/favicon.svg", "utf8");
const OUT = "/Users/sushantmishra/rune-website/public";

const b = await chromium.launch({ channel: "chrome" });

for (const [size, name, bleed] of [
  [16, "favicon-16x16.png", false],
  [32, "favicon-32x32.png", false],
  [180, "apple-touch-icon.png", true],
  [192, "icon-192.png", false],
  [512, "icon-512.png", false],
]) {
  const p = await b.newPage({ viewport: { width: size, height: size } });
  // iOS rounds the corners itself and its radius is not ours, so the touch
  // icon is drawn full-bleed: a rounded tile inside a rounded mask leaves a
  // pale rind around the edge.
  const inner = bleed
    ? svg.replace('rx="7.5"', 'rx="0"')
    : svg;
  await p.setContent(
    `<body style="margin:0">${inner.replace("<svg", `<svg width="${size}" height="${size}"`)}</body>`
  );
  await p.waitForTimeout(120);
  await p.screenshot({ path: `${OUT}/${name}`, omitBackground: !bleed });
  await p.close();
  console.log("wrote", name, `${size}x${size}`);
}
await b.close();
