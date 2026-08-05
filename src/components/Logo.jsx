/* The mark, same drawing as public/favicon.svg: an ink tile, a prompt, and the
   marker-yellow cursor sitting at it. Kept in sync by hand — it is nine lines,
   and a build step to share one file between a favicon and a component would
   cost more than it saves. */
export default function Logo({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="logo"
    >
      <rect width="32" height="32" rx="7.5" fill="var(--ink)" />
      <path
        d="M9 11.5 13.5 16 9 20.5"
        stroke="var(--page)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="16.5" y="11" width="6.5" height="10" rx="1" fill="var(--marker)" />
    </svg>
  );
}
