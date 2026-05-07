"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

/**
 * Animates a number from 0 to `to` over `duration` seconds, starting only
 * once the element scrolls into view. Optional prefix/suffix and decimal
 * formatting. Used for the report-style stat counters on the State of
 * UK Logistics page.
 */
type Props = {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

export function CountUp({
  to,
  duration = 1.4,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: Props) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  // Trigger as soon as the element edges into the viewport. Earlier negative
  // margins were preventing the count from firing on first paint.
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-GB"),
  );

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, motionValue, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
