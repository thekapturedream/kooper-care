import { cn } from "@/lib/utils";

/**
 * Official Kapture sun mark.
 *
 * Path data is the exact SVG provided by the brand owner — eight rays plus
 * a central disc. ONE ray (top-right) is intentionally a different colour
 * to signal asymmetry — this is a brand DNA detail, never remove it.
 *
 * The body uses currentColor so it inherits the surrounding text colour via
 * Tailwind's text-* utilities. The accent ray defaults to Kapture yellow but
 * can be overridden (e.g. white-on-black slice4 variant).
 */
type Props = {
  className?: string;
  size?: number;
  accent?: string;
  spin?: boolean;
};

export function KaptureSun({
  className,
  size = 28,
  accent = "#FFD400",
  spin = false,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="none"
      aria-label="Kapture"
      role="img"
      className={cn("shrink-0", spin && "animate-spin-slow", className)}
    >
      {/* Main body — eight rays + centre disc, painted in currentColor */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M255.75 133.125c67.679 0 122.625 54.946 122.625 122.625S323.429 378.375 255.75 378.375 133.125 323.429 133.125 255.75s54.946-122.625 122.625-122.625m0-132.75c18.832 0 34.121 15.289 34.121 34.121s-15.289 34.121-34.121 34.121-34.121-15.289-34.121-34.121S236.918.375 255.75.375M75.173 75.173c13.316-13.316 34.938-13.316 48.254 0s13.316 34.938 0 48.254-34.938 13.316-48.254 0-13.316-34.938 0-48.254M511.125 255.75c0 18.832-15.289 34.121-34.121 34.121s-34.121-15.289-34.121-34.121 15.289-34.121 34.121-34.121 34.121 15.289 34.121 34.121M255.75 442.883c18.832 0 34.121 15.289 34.121 34.121s-15.289 34.121-34.121 34.121-34.121-15.289-34.121-34.121 15.289-34.121 34.121-34.121m132.323-54.81c13.316-13.316 34.938-13.316 48.254 0s13.316 34.938 0 48.254-34.938 13.316-48.254 0-13.316-34.938 0-48.254M68.617 255.75c0 18.832-15.289 34.121-34.121 34.121S.375 274.582.375 255.75s15.289-34.121 34.121-34.121 34.121 15.289 34.121 34.121m54.81 132.323c13.316 13.316 13.316 34.938 0 48.254s-34.938 13.316-48.254 0-13.316-34.938 0-48.254 34.938-13.316 48.254 0"
      />
      {/* Top-right accent ray */}
      <path
        fill={accent}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M436.327 75.173c13.316 13.316 13.316 34.938 0 48.254s-34.938 13.316-48.254 0-13.316-34.938 0-48.254 34.938-13.316 48.254 0"
      />
    </svg>
  );
}
