/**
 * Kapture Logistics illustration kit.
 *
 * Flat geometric SVGs in our brand palette — black, white, kapture-yellow.
 * Each illustration is a React component that takes className + tone props.
 *
 *   tone="light"  → black strokes / yellow accent (use on white surfaces)
 *   tone="dark"   → white strokes / yellow accent (use on dark surfaces)
 *   tone="yellow" → black on yellow (use on yellow tiles)
 */

type Tone = "light" | "dark" | "yellow";

type IllustrationProps = {
  className?: string;
  tone?: Tone;
};

function colors(tone: Tone) {
  if (tone === "dark") return { line: "#FFFFFF", fill: "#1A1A1A", accent: "#FFD400", soft: "#2A2A2A" };
  if (tone === "yellow") return { line: "#0A0A0A", fill: "#FFD400", accent: "#0A0A0A", soft: "#F5B400" };
  return { line: "#0A0A0A", fill: "#FFFFFF", accent: "#FFD400", soft: "#F5F5F5" };
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Container ship                                                          */
/* ─────────────────────────────────────────────────────────────────────── */
export function ContainerShipIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Water lines */}
      <path d="M0 130 Q 30 124 60 130 T 120 130 T 180 130 T 240 130" stroke={c.line} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M0 142 Q 30 136 60 142 T 120 142 T 180 142 T 240 142" stroke={c.line} strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
      {/* Hull */}
      <path d="M30 110 L210 110 L195 130 L45 130 Z" fill={c.line} />
      {/* Deck superstructure */}
      <rect x="155" y="80" width="35" height="30" fill={c.line} />
      <rect x="160" y="86" width="6" height="6" fill={c.accent} />
      <rect x="170" y="86" width="6" height="6" fill={c.accent} />
      <rect x="180" y="86" width="6" height="6" fill={c.accent} />
      {/* Containers — back row */}
      <rect x="50" y="86" width="22" height="24" fill={c.accent} />
      <rect x="74" y="86" width="22" height="24" fill={c.line} />
      <rect x="98" y="86" width="22" height="24" fill={c.accent} />
      <rect x="122" y="86" width="22" height="24" fill={c.line} />
      {/* Containers — front row */}
      <rect x="50" y="62" width="22" height="24" fill={c.line} />
      <rect x="74" y="62" width="22" height="24" fill={c.accent} />
      <rect x="98" y="62" width="22" height="24" fill={c.line} />
      <rect x="122" y="62" width="22" height="24" fill={c.accent} />
      {/* Containers — top row */}
      <rect x="74" y="38" width="22" height="24" fill={c.accent} />
      <rect x="98" y="38" width="22" height="24" fill={c.line} />
      {/* Mast */}
      <line x1="172" y1="80" x2="172" y2="50" stroke={c.line} strokeWidth="2" />
      <circle cx="172" cy="48" r="3" fill={c.accent} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Cargo plane                                                             */
/* ─────────────────────────────────────────────────────────────────────── */
export function CargoPlaneIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Trail */}
      <path d="M210 100 Q 180 95 150 100" stroke={c.accent} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 6" opacity="0.6" />
      {/* Body */}
      <path d="M40 88 L 170 88 Q 200 88 200 78 L 200 70 Q 200 60 170 60 L 60 60 Q 40 60 40 70 Z" fill={c.line} />
      <ellipse cx="195" cy="74" rx="8" ry="4" fill={c.line} />
      {/* Cockpit window */}
      <path d="M180 65 Q 192 65 196 70 L 188 73 Z" fill={c.accent} />
      {/* Wing */}
      <path d="M90 70 L 105 30 L 130 30 L 140 70 Z" fill={c.line} />
      <path d="M105 30 L 130 30 L 128 24 L 107 24 Z" fill={c.accent} />
      {/* Tail */}
      <path d="M50 60 L 55 30 L 75 30 L 80 60 Z" fill={c.line} />
      {/* Cargo door outline */}
      <rect x="80" y="68" width="40" height="14" stroke={c.accent} strokeWidth="1.5" fill="none" />
      {/* Engine */}
      <ellipse cx="118" cy="72" rx="9" ry="6" fill={c.accent} />
      {/* Ground line */}
      <line x1="0" y1="140" x2="240" y2="140" stroke={c.line} strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Truck                                                                   */
/* ─────────────────────────────────────────────────────────────────────── */
export function TruckIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Road */}
      <line x1="0" y1="135" x2="240" y2="135" stroke={c.line} strokeWidth="1.5" />
      <line x1="20" y1="142" x2="50" y2="142" stroke={c.line} strokeWidth="2" opacity="0.4" />
      <line x1="80" y1="142" x2="110" y2="142" stroke={c.line} strokeWidth="2" opacity="0.4" />
      <line x1="140" y1="142" x2="170" y2="142" stroke={c.line} strokeWidth="2" opacity="0.4" />
      <line x1="200" y1="142" x2="230" y2="142" stroke={c.line} strokeWidth="2" opacity="0.4" />
      {/* Trailer body */}
      <rect x="30" y="50" width="130" height="75" fill={c.line} />
      {/* Trailer detail */}
      <line x1="40" y1="60" x2="40" y2="115" stroke={c.accent} strokeWidth="1" opacity="0.6" />
      <line x1="55" y1="60" x2="55" y2="115" stroke={c.accent} strokeWidth="1" opacity="0.4" />
      <rect x="120" y="65" width="30" height="40" fill={c.accent} />
      {/* Cab */}
      <path d="M160 80 L 195 80 L 205 95 L 205 125 L 160 125 Z" fill={c.line} />
      <rect x="170" y="88" width="22" height="14" fill={c.accent} />
      {/* Wheels */}
      <circle cx="60" cy="125" r="10" fill={c.fill} stroke={c.line} strokeWidth="3" />
      <circle cx="60" cy="125" r="3" fill={c.line} />
      <circle cx="100" cy="125" r="10" fill={c.fill} stroke={c.line} strokeWidth="3" />
      <circle cx="100" cy="125" r="3" fill={c.line} />
      <circle cx="180" cy="125" r="10" fill={c.fill} stroke={c.line} strokeWidth="3" />
      <circle cx="180" cy="125" r="3" fill={c.line} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Warehouse                                                               */
/* ─────────────────────────────────────────────────────────────────────── */
export function WarehouseIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Ground */}
      <line x1="0" y1="135" x2="240" y2="135" stroke={c.line} strokeWidth="1.5" />
      {/* Building */}
      <path d="M30 135 L 30 60 L 120 30 L 210 60 L 210 135 Z" fill={c.line} />
      {/* Roof line */}
      <path d="M30 60 L 120 30 L 210 60" stroke={c.accent} strokeWidth="2" fill="none" />
      {/* Bay doors */}
      <rect x="50" y="85" width="35" height="50" fill={c.fill} />
      <rect x="55" y="90" width="25" height="40" fill={c.line} opacity="0.15" />
      <rect x="105" y="85" width="35" height="50" fill={c.fill} />
      <rect x="110" y="90" width="25" height="40" fill={c.line} opacity="0.15" />
      <rect x="160" y="85" width="35" height="50" fill={c.accent} />
      <line x1="160" y1="110" x2="195" y2="110" stroke={c.line} strokeWidth="1.5" />
      {/* Window strip */}
      <rect x="50" y="68" width="145" height="8" fill={c.accent} opacity="0.6" />
      {/* Antennae */}
      <line x1="120" y1="30" x2="120" y2="18" stroke={c.line} strokeWidth="2" />
      <circle cx="120" cy="16" r="3" fill={c.accent} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Container stack                                                         */
/* ─────────────────────────────────────────────────────────────────────── */
export function ContainerStackIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="0" y1="140" x2="240" y2="140" stroke={c.line} strokeWidth="1.5" />
      {/* Bottom row */}
      <rect x="30" y="100" width="60" height="40" fill={c.line} />
      <line x1="40" y1="100" x2="40" y2="140" stroke={c.accent} strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="100" x2="50" y2="140" stroke={c.accent} strokeWidth="1" opacity="0.5" />
      <line x1="60" y1="100" x2="60" y2="140" stroke={c.accent} strokeWidth="1" opacity="0.5" />
      <line x1="70" y1="100" x2="70" y2="140" stroke={c.accent} strokeWidth="1" opacity="0.5" />
      <line x1="80" y1="100" x2="80" y2="140" stroke={c.accent} strokeWidth="1" opacity="0.5" />

      <rect x="90" y="100" width="60" height="40" fill={c.accent} />
      <line x1="100" y1="100" x2="100" y2="140" stroke={c.line} strokeWidth="1" opacity="0.4" />
      <line x1="120" y1="100" x2="120" y2="140" stroke={c.line} strokeWidth="1" opacity="0.4" />
      <line x1="140" y1="100" x2="140" y2="140" stroke={c.line} strokeWidth="1" opacity="0.4" />

      <rect x="150" y="100" width="60" height="40" fill={c.line} />

      {/* Middle row */}
      <rect x="60" y="60" width="60" height="40" fill={c.accent} />
      <rect x="120" y="60" width="60" height="40" fill={c.line} />
      <line x1="140" y1="60" x2="140" y2="100" stroke={c.accent} strokeWidth="1" opacity="0.5" />
      <line x1="160" y1="60" x2="160" y2="100" stroke={c.accent} strokeWidth="1" opacity="0.5" />

      {/* Top */}
      <rect x="90" y="20" width="60" height="40" fill={c.line} />
      <line x1="105" y1="20" x2="105" y2="60" stroke={c.accent} strokeWidth="1" opacity="0.5" />
      <line x1="120" y1="20" x2="120" y2="60" stroke={c.accent} strokeWidth="1" opacity="0.5" />
      <line x1="135" y1="20" x2="135" y2="60" stroke={c.accent} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Customs / passport                                                      */
/* ─────────────────────────────────────────────────────────────────────── */
export function CustomsIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Document */}
      <rect x="50" y="30" width="110" height="100" fill={c.line} />
      <rect x="60" y="40" width="55" height="6" fill={c.accent} />
      <line x1="60" y1="56" x2="150" y2="56" stroke={c.fill} strokeWidth="1" opacity="0.4" />
      <line x1="60" y1="64" x2="150" y2="64" stroke={c.fill} strokeWidth="1" opacity="0.4" />
      <line x1="60" y1="72" x2="130" y2="72" stroke={c.fill} strokeWidth="1" opacity="0.4" />
      <line x1="60" y1="80" x2="150" y2="80" stroke={c.fill} strokeWidth="1" opacity="0.4" />
      {/* Stamp circle */}
      <circle cx="170" cy="100" r="28" fill="none" stroke={c.accent} strokeWidth="3" strokeDasharray="3 3" />
      <text x="170" y="98" fontSize="9" fontFamily="monospace" fontWeight="700" textAnchor="middle" fill={c.accent}>CLEARED</text>
      <text x="170" y="110" fontSize="6" fontFamily="monospace" textAnchor="middle" fill={c.accent}>KAPTURE</text>
      {/* Folded corner */}
      <path d="M150 30 L 160 30 L 160 40 Z" fill={c.accent} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/* INDUSTRY ILLUSTRATIONS                                                  */
/* ─────────────────────────────────────────────────────────────────────── */

/* Retail & E-commerce — shopping bag with parcel */
export function RetailIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Shop awning */}
      <path d="M40 50 L 200 50 L 192 70 L 48 70 Z" fill={c.line} />
      <line x1="60" y1="50" x2="56" y2="70" stroke={c.accent} strokeWidth="2" />
      <line x1="80" y1="50" x2="76" y2="70" stroke={c.accent} strokeWidth="2" />
      <line x1="100" y1="50" x2="96" y2="70" stroke={c.accent} strokeWidth="2" />
      <line x1="120" y1="50" x2="116" y2="70" stroke={c.accent} strokeWidth="2" />
      <line x1="140" y1="50" x2="136" y2="70" stroke={c.accent} strokeWidth="2" />
      <line x1="160" y1="50" x2="156" y2="70" stroke={c.accent} strokeWidth="2" />
      <line x1="180" y1="50" x2="176" y2="70" stroke={c.accent} strokeWidth="2" />
      {/* Storefront */}
      <rect x="50" y="70" width="140" height="65" fill={c.line} />
      <rect x="60" y="80" width="120" height="35" fill={c.fill} opacity="0.1" />
      {/* Window text */}
      <rect x="70" y="92" width="50" height="4" fill={c.accent} />
      <rect x="70" y="100" width="35" height="3" fill={c.accent} opacity="0.6" />
      {/* Door */}
      <rect x="140" y="100" width="35" height="35" fill={c.accent} />
      <circle cx="168" cy="118" r="1.5" fill={c.line} />
      {/* Shopping bag */}
      <rect x="170" y="90" width="20" height="22" fill={c.fill} stroke={c.line} strokeWidth="1.5" />
      <path d="M174 90 Q 174 84 178 84 L 182 84 Q 186 84 186 90" stroke={c.line} strokeWidth="1.5" fill="none" />
      {/* Ground */}
      <line x1="0" y1="135" x2="240" y2="135" stroke={c.line} strokeWidth="1.5" />
    </svg>
  );
}

/* Manufacturing — factory with gears */
export function ManufacturingIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="0" y1="135" x2="240" y2="135" stroke={c.line} strokeWidth="1.5" />
      {/* Smokestacks */}
      <rect x="40" y="40" width="14" height="95" fill={c.line} />
      <rect x="58" y="55" width="14" height="80" fill={c.line} />
      {/* Smoke */}
      <circle cx="47" cy="32" r="6" fill={c.accent} opacity="0.5" />
      <circle cx="52" cy="22" r="4" fill={c.accent} opacity="0.3" />
      {/* Sawtooth roof */}
      <path d="M80 80 L 90 60 L 100 80 L 110 60 L 120 80 L 130 60 L 140 80 L 150 60 L 160 80 L 170 60 L 180 80 L 180 135 L 80 135 Z" fill={c.line} />
      {/* Sawtooth windows */}
      <path d="M90 60 L 100 80 L 100 70 Z" fill={c.accent} />
      <path d="M110 60 L 120 80 L 120 70 Z" fill={c.accent} />
      <path d="M130 60 L 140 80 L 140 70 Z" fill={c.accent} />
      <path d="M150 60 L 160 80 L 160 70 Z" fill={c.accent} />
      <path d="M170 60 L 180 80 L 180 70 Z" fill={c.accent} />
      {/* Door */}
      <rect x="120" y="100" width="20" height="35" fill={c.accent} />
      {/* Gear (foreground) */}
      <g transform="translate(195, 95)">
        <circle r="14" fill={c.accent} />
        <circle r="5" fill={c.line} />
        <rect x="-2" y="-18" width="4" height="6" fill={c.accent} />
        <rect x="-2" y="12" width="4" height="6" fill={c.accent} />
        <rect x="-18" y="-2" width="6" height="4" fill={c.accent} />
        <rect x="12" y="-2" width="6" height="4" fill={c.accent} />
      </g>
    </svg>
  );
}

/* Mining & Energy — pickaxe + ore */
export function MiningIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="0" y1="135" x2="240" y2="135" stroke={c.line} strokeWidth="1.5" />
      {/* Mountain silhouette */}
      <path d="M0 135 L 50 75 L 80 100 L 120 50 L 170 95 L 210 70 L 240 135 Z" fill={c.line} />
      {/* Mountain highlights */}
      <path d="M50 75 L 70 95 L 80 100 Z" fill={c.accent} opacity="0.4" />
      <path d="M120 50 L 145 78 L 170 95 Z" fill={c.accent} opacity="0.4" />
      {/* Mine entrance */}
      <path d="M100 135 Q 100 110 115 110 L 135 110 Q 150 110 150 135 Z" fill={c.fill} stroke={c.line} strokeWidth="2" />
      <rect x="120" y="118" width="10" height="17" fill={c.accent} />
      {/* Ore cart */}
      <rect x="160" y="120" width="35" height="15" fill={c.accent} />
      <line x1="155" y1="135" x2="200" y2="135" stroke={c.accent} strokeWidth="2" />
      <circle cx="166" cy="138" r="3" fill={c.line} />
      <circle cx="190" cy="138" r="3" fill={c.line} />
      {/* Pickaxe */}
      <line x1="35" y1="100" x2="55" y2="120" stroke={c.line} strokeWidth="3" strokeLinecap="round" />
      <path d="M30 95 L 45 80 L 50 90 L 35 105 Z" fill={c.line} />
    </svg>
  );
}

/* Healthcare — cold chain box with cross */
export function HealthcareIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="0" y1="135" x2="240" y2="135" stroke={c.line} strokeWidth="1.5" />
      {/* Refrigerated box */}
      <rect x="60" y="50" width="120" height="80" fill={c.line} />
      <line x1="60" y1="68" x2="180" y2="68" stroke={c.accent} strokeWidth="2" />
      {/* Temperature indicator */}
      <rect x="68" y="56" width="20" height="6" fill={c.accent} />
      <text x="78" y="61" fontSize="5" fontFamily="monospace" textAnchor="middle" fill={c.line} fontWeight="700">2-8°C</text>
      {/* Big medical cross */}
      <rect x="115" y="80" width="14" height="38" fill={c.accent} />
      <rect x="103" y="92" width="38" height="14" fill={c.accent} />
      {/* Snowflake hint */}
      <g transform="translate(160, 100)" opacity="0.7">
        <line x1="-7" y1="0" x2="7" y2="0" stroke={c.accent} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="-7" x2="0" y2="7" stroke={c.accent} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-5" y1="-5" x2="5" y2="5" stroke={c.accent} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-5" y1="5" x2="5" y2="-5" stroke={c.accent} strokeWidth="1.5" strokeLinecap="round" />
      </g>
      {/* Tag */}
      <rect x="60" y="36" width="40" height="12" fill={c.accent} />
      <line x1="80" y1="42" x2="92" y2="42" stroke={c.line} strokeWidth="1.5" />
    </svg>
  );
}

/* Agriculture — grain silo + wheat */
export function AgricultureIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="0" y1="135" x2="240" y2="135" stroke={c.line} strokeWidth="1.5" />
      {/* Field rows */}
      <path d="M0 135 Q 60 128 120 135 T 240 135" stroke={c.accent} strokeWidth="1" opacity="0.5" fill="none" />
      <path d="M0 142 Q 60 138 120 142 T 240 142" stroke={c.accent} strokeWidth="1" opacity="0.3" fill="none" />
      {/* Silos */}
      <rect x="40" y="60" width="35" height="75" fill={c.line} />
      <ellipse cx="57.5" cy="60" rx="17.5" ry="6" fill={c.line} />
      <path d="M40 60 Q 57.5 48 75 60" fill={c.line} />
      <line x1="48" y1="75" x2="68" y2="75" stroke={c.accent} strokeWidth="1" opacity="0.5" />
      <line x1="48" y1="90" x2="68" y2="90" stroke={c.accent} strokeWidth="1" opacity="0.5" />
      <line x1="48" y1="105" x2="68" y2="105" stroke={c.accent} strokeWidth="1" opacity="0.5" />

      <rect x="85" y="80" width="28" height="55" fill={c.line} />
      <ellipse cx="99" cy="80" rx="14" ry="5" fill={c.line} />
      <path d="M85 80 Q 99 70 113 80" fill={c.line} />

      {/* Wheat stalk on the right */}
      <line x1="170" y1="135" x2="170" y2="80" stroke={c.line} strokeWidth="2" />
      <ellipse cx="170" cy="78" rx="3" ry="6" fill={c.accent} />
      <ellipse cx="164" cy="86" rx="3" ry="5" fill={c.accent} />
      <ellipse cx="176" cy="86" rx="3" ry="5" fill={c.accent} />
      <ellipse cx="162" cy="96" rx="3" ry="5" fill={c.accent} />
      <ellipse cx="178" cy="96" rx="3" ry="5" fill={c.accent} />

      <line x1="195" y1="135" x2="195" y2="85" stroke={c.line} strokeWidth="2" />
      <ellipse cx="195" cy="83" rx="3" ry="6" fill={c.accent} />
      <ellipse cx="189" cy="92" rx="3" ry="5" fill={c.accent} />
      <ellipse cx="201" cy="92" rx="3" ry="5" fill={c.accent} />

      <line x1="210" y1="135" x2="210" y2="92" stroke={c.line} strokeWidth="2" />
      <ellipse cx="210" cy="90" rx="3" ry="6" fill={c.accent} />
      <ellipse cx="205" cy="100" rx="2.5" ry="4" fill={c.accent} />
      <ellipse cx="215" cy="100" rx="2.5" ry="4" fill={c.accent} />
    </svg>
  );
}

/* Tech & Hardware — circuit board / chip */
export function TechIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Outer chip body */}
      <rect x="60" y="40" width="120" height="80" rx="6" fill={c.line} />
      {/* Pins */}
      <rect x="50" y="55" width="10" height="4" fill={c.line} />
      <rect x="50" y="68" width="10" height="4" fill={c.line} />
      <rect x="50" y="81" width="10" height="4" fill={c.line} />
      <rect x="50" y="94" width="10" height="4" fill={c.line} />

      <rect x="180" y="55" width="10" height="4" fill={c.line} />
      <rect x="180" y="68" width="10" height="4" fill={c.line} />
      <rect x="180" y="81" width="10" height="4" fill={c.line} />
      <rect x="180" y="94" width="10" height="4" fill={c.line} />

      <rect x="74" y="120" width="4" height="10" fill={c.line} />
      <rect x="92" y="120" width="4" height="10" fill={c.line} />
      <rect x="110" y="120" width="4" height="10" fill={c.line} />
      <rect x="128" y="120" width="4" height="10" fill={c.line} />
      <rect x="146" y="120" width="4" height="10" fill={c.line} />
      <rect x="164" y="120" width="4" height="10" fill={c.line} />

      <rect x="74" y="30" width="4" height="10" fill={c.line} />
      <rect x="92" y="30" width="4" height="10" fill={c.line} />
      <rect x="110" y="30" width="4" height="10" fill={c.line} />
      <rect x="128" y="30" width="4" height="10" fill={c.line} />
      <rect x="146" y="30" width="4" height="10" fill={c.line} />
      <rect x="164" y="30" width="4" height="10" fill={c.line} />

      {/* Inner core */}
      <rect x="80" y="60" width="80" height="40" rx="3" fill={c.accent} />
      <text x="120" y="84" fontSize="12" fontFamily="monospace" fontWeight="700" textAnchor="middle" fill={c.line}>K-CHIP</text>
      <circle cx="68" cy="48" r="2" fill={c.accent} />
      <circle cx="172" cy="48" r="2" fill={c.accent} />
      <circle cx="68" cy="112" r="2" fill={c.accent} />
      <circle cx="172" cy="112" r="2" fill={c.accent} />
      {/* Ground */}
      <line x1="0" y1="140" x2="240" y2="140" stroke={c.line} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Dashboard / platform                                                    */
/* ─────────────────────────────────────────────────────────────────────── */
export function DashboardIllustration({ className, tone = "light" }: IllustrationProps) {
  const c = colors(tone);
  return (
    <svg className={className} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Screen */}
      <rect x="20" y="20" width="200" height="120" rx="6" fill={c.line} />
      {/* Top bar */}
      <rect x="20" y="20" width="200" height="14" rx="6" fill={c.fill} opacity="0.1" />
      <circle cx="30" cy="27" r="2" fill={c.accent} />
      <circle cx="38" cy="27" r="2" fill={c.fill} opacity="0.6" />
      <circle cx="46" cy="27" r="2" fill={c.fill} opacity="0.6" />
      {/* Big stat */}
      <rect x="32" y="46" width="60" height="6" fill={c.accent} />
      <rect x="32" y="58" width="40" height="14" fill={c.fill} />
      {/* Chart bars */}
      <rect x="32" y="92" width="10" height="30" fill={c.accent} />
      <rect x="46" y="80" width="10" height="42" fill={c.accent} opacity="0.7" />
      <rect x="60" y="98" width="10" height="24" fill={c.accent} opacity="0.5" />
      <rect x="74" y="84" width="10" height="38" fill={c.accent} />
      <rect x="88" y="74" width="10" height="48" fill={c.accent} />
      {/* Right panel — list */}
      <rect x="110" y="46" width="98" height="76" fill={c.fill} opacity="0.07" rx="3" />
      <line x1="118" y1="58" x2="200" y2="58" stroke={c.fill} strokeWidth="1" opacity="0.3" />
      <circle cx="124" cy="74" r="3" fill={c.accent} />
      <line x1="132" y1="74" x2="195" y2="74" stroke={c.fill} strokeWidth="1.5" opacity="0.4" />
      <circle cx="124" cy="88" r="3" fill={c.accent} />
      <line x1="132" y1="88" x2="190" y2="88" stroke={c.fill} strokeWidth="1.5" opacity="0.4" />
      <circle cx="124" cy="102" r="3" fill={c.accent} />
      <line x1="132" y1="102" x2="180" y2="102" stroke={c.fill} strokeWidth="1.5" opacity="0.4" />
      {/* Stand */}
      <rect x="100" y="140" width="40" height="4" rx="1" fill={c.line} />
      <line x1="115" y1="140" x2="115" y2="135" stroke={c.line} strokeWidth="3" />
      <line x1="125" y1="140" x2="125" y2="135" stroke={c.line} strokeWidth="3" />
    </svg>
  );
}
