"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";

export function HeroHighlightDemo() {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-4xl px-4 md:text-4xl lg:text-6xl font-bold text-neutral-700 dark:text-white max-w-6xl leading-relaxed lg:leading-snug text-center mx-auto"
      >
        Indian Institute Of Information Technology, Sri City
        <div className="flex flex-col items-center mt-6">
          <Highlight className="text-black dark:text-white">
            Welcomes alumni.
          </Highlight>
        </div>
      </motion.h1>
    </HeroHighlight>
  );
}
