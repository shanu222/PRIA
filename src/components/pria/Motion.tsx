"use client";

import * as React from "react";
import { animate, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const Cmp = as === "ul" ? motion.ul : as === "ol" ? motion.ol : motion.div;
  return (
    <Cmp
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {children}
    </Cmp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Cmp = as === "li" ? motion.li : motion.div;
  return (
    <Cmp className={cn("h-full", className)} variants={itemVariants}>
      {children}
    </Cmp>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  plain = false,
  decimals = 0,
  duration = 1.4,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  plain?: boolean;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const reduce = useReducedMotion();
  const format = React.useCallback(
    (n: number) =>
      plain
        ? String(Math.round(n))
        : n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    [plain, decimals],
  );
  const [display, setDisplay] = React.useState(() => format(value));
  const done = React.useRef(false);
  const from = plain && value > 1000 ? value - 21 : 0;

  React.useEffect(() => {
    if (reduce || done.current) {
      setDisplay(format(value));
      return;
    }
    if (!inView) {
      setDisplay(format(from));
      return;
    }
    const controls = animate(from, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(format(v)),
      onComplete: () => {
        done.current = true;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, from, duration, format]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} aria-label={`${prefix}${format(value)}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {display}
        {suffix}
      </span>
    </span>
  );
}
