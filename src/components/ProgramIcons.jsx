/* Program marks, lifted out of Sources/Rune/ProgramIcon.swift by script rather
   than by hand, so the site cannot show a mark the app does not ship.

   Only the two a demo row actually uses. Rune recognises 24, and carrying the
   rest into a browser is tens of kilobytes of SVG that never paints; add one
   here when a workspace starts flying it. */
export const PROGRAMS = [
  {
    id: "neovim",
    mark: (
      <svg viewBox="0 0 602 734" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="nv1"><stop stopColor="#16B0ED" stopOpacity="0.8" offset="0%"/><stop stopColor="#0F59B2" stopOpacity="0.837" offset="100%"/></linearGradient><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="nv2"><stop stopColor="#7DB643" offset="0%"/><stop stopColor="#367533" offset="100%"/></linearGradient><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="nv3"><stop stopColor="#88C649" stopOpacity="0.8" offset="0%"/><stop stopColor="#439240" stopOpacity="0.84" offset="100%"/></linearGradient></defs><g fill="none" fillRule="evenodd"><g transform="translate(2,3)"><path d="M0,155.5704 L155,-1 L154.999997,727 L0,572.237919 L0,155.5704 Z" fill="url(#nv1)"/><path d="M443.060403,156.982405 L600,-1 L596.818792,727 L442,572.219941 L443.060403,156.982405 Z" fill="url(#nv2)" transform="translate(521,363.5) scale(-1,1) translate(-521,-363.5)"/><path d="M154.986294,0 L558,615.189696 L445.224605,728 L42,114.172017 L154.986294,0 Z" fill="url(#nv3)"/><path d="M155,283.83232 L154.786754,308 L31,124.710606 L42.4619486,113 L155,283.83232 Z" fillOpacity="0.13" fill="#000000"/></g></g></svg>
    ),
  },
  {
    id: "tmux",
    mark: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" rx="2.6" fill="#1BB91B"/><path d="M2.6 0 H21.4 A 2.6 2.6 0 0 1 24 2.6 V21.5 H0 V2.6 A 2.6 2.6 0 0 1 2.6 0 Z" fill="#414141"/><rect x="11.78" y="0" width="0.45" height="21.5" fill="#ffffff"/><rect x="12.23" y="10.55" width="11.77" height="0.45" fill="#ffffff"/></svg>
    ),
  },
];
