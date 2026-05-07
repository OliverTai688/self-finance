"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Reusable motion helpers. These are thin wrappers around `motion/react`
 * (framer-motion v12) so feature code stays tidy.
 */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
};

export function FadeIn({
  delay = 0,
  y = 12,
  className,
  children,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delay?: number;
};

export function Stagger({
  stagger = 0.08,
  delay = 0,
  className,
  children,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(stagger, delay)}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { motion };
