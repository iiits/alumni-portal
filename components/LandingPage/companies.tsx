"use client";

import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={svgPaths}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const svgPaths = [
  {
    path: "/svgs/google-1-1.svg",
  },
  {
    path: "/svgs/logo-amazon.svg",
  },
  {
    path: "/svgs/microsoft-6.svg",
  },
  {
    path: "/svgs/nvidia.svg",
  },
  {
    path: "/svgs/walmart.svg",
  },
  {
    path: "/svgs/swiggy-logo.svg",
  },
  {
    path: "/svgs/samsung.svg",
  },
];
