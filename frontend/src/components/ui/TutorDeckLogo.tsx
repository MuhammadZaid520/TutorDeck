/**
 * TutorDeckLogo
 *
 * Full variant: DM Serif Display wordmark only, no square box.
 * Graduation cap sits above the "ck" of "TutorDeck",
 * tilted left, appearing to rest on those two letters.
 */

interface TutorDeckLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  theme?: "light" | "dark";
  className?: string;
}

const SIZE_MAP = {
  sm:  { fontSize: 17,  capW: 24, capH: 15, capTop: -14 },
  md:  { fontSize: 21,  capW: 30, capH: 19, capTop: -18 },
  lg:  { fontSize: 27,  capW: 38, capH: 24, capTop: -24 },
  xl:  { fontSize: 36,  capW: 50, capH: 31, capTop: -30 },
  "2xl": { fontSize: 46, capW: 62, capH: 39, capTop: -38 },
};

/** Graduation cap SVG — tilted left, sits atop "ck" */
function GradCapSVG({ width, height, color = "#C6551E" }: { width: number; height: number; color?: string }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 38 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      {/* Board */}
      <path d="M19 2.5L2 10.5L19 18.5L36 10.5L19 2.5Z" fill={color} />
      {/* Hood */}
      <path d="M9 14V20C9 20 13 24 19 24C25 24 29 20 29 20V14L19 19L9 14Z" fill={color} opacity="0.58" />
      {/* Tassel string */}
      <line x1="36" y1="10.5" x2="36" y2="17.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      {/* Tassel bob */}
      <circle cx="36" cy="18.8" r="1.5" fill={color} />
    </svg>
  );
}

export default function TutorDeckLogo({
  size = "md",
  theme = "light",
  className = "",
}: TutorDeckLogoProps) {
  const { fontSize, capW, capH, capTop } = SIZE_MAP[size];

  const tutorColor = theme === "dark" ? "rgba(255,255,255,0.92)" : "#1C2B3A";
  const deckColor = "#C6551E";

  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "baseline" }}>
      {/* "Tutor" */}
      <span style={{
        fontFamily: '"DM Serif Display", Georgia, serif',
        fontSize,
        fontWeight: 400,
        color: tutorColor,
        lineHeight: 1,
        letterSpacing: "-0.015em",
      }}>
        Tutor
      </span>

      {/* "De" — plain terracotta, no cap */}
      <span style={{
        fontFamily: '"DM Serif Display", Georgia, serif',
        fontSize,
        fontWeight: 400,
        color: deckColor,
        lineHeight: 1,
        letterSpacing: "-0.015em",
      }}>
        De
      </span>

      {/* "ck" — cap floats above this cluster, tilted */}
      <span style={{ position: "relative", display: "inline-block" }}>
        {/* Graduation cap centered above "ck", tilted ~−13° */}
        <span
          style={{
            position: "absolute",
            top: capTop,
            left: "50%",
            transform: "translate(-50%, 20%) rotate(-12deg)",
            display: "block",
            pointerEvents: "none",
            transformOrigin: "50% 100%",
          }}
        >
          <GradCapSVG width={capW} height={capH} color={deckColor} />
        </span>
        <span style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontSize,
          fontWeight: 400,
          color: deckColor,
          lineHeight: 1,
          letterSpacing: "-0.015em",
        }}>
          ck
        </span>
      </span>
    </span>
  );
}
