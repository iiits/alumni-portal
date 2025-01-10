"use client";
import { WorldMap } from "@/components/ui/world-map";
import { motion } from "motion/react";

export function WorldMapDemo() {
  return (
    <div className=" pt-20 pb-40 dark:bg-black bg-white w-full">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
          Stay{" "}
          <span className="text-neutral-400">
            {"Connected".split("").map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4 px-4 sm:px-2">
          Break free from boundaries and stay connected with your college
          community. Engage with current students from the comfort of your home
          or while on the go. Perfect for alumni who want to mentor,
          collaborate, or give back, no matter where they are.
        </p>
      </div>
      <WorldMap
        dots={[
          {
            start: { lat: 13.0827, lng: 80.2707 }, // Chennai
            end: { lat: 28.6154, lng: 77.1954 }, // New Delhi
          },
          {
            start: { lat: 13.0827, lng: 80.2707 }, // Chennai
            end: { lat: 37.7749, lng: -122.4194 }, // San Francisco
          },
          {
            start: { lat: 13.0827, lng: 80.2707 }, // Chennai
            end: { lat: 40.7128, lng: -74.006 }, // New York
          },
          {
            start: { lat: 13.0827, lng: 80.2707 }, // Chennai
            end: { lat: 51.5074, lng: -0.1278 }, // London
          },
          {
            start: { lat: 13.0827, lng: 80.2707 }, // Chennai
            end: { lat: -33.8688, lng: 151.2093 }, // Sydney, Australia
          },
          {
            start: { lat: 13.0827, lng: 80.2707 }, // Chennai
            end: { lat: 39.9042, lng: 116.4074 }, // Beijing, China
          },
          {
            start: { lat: 13.0827, lng: 80.2707 }, // Chennai
            end: { lat: 35.6762, lng: 139.6503 }, // Tokyo, Japan
          },
          {
            start: { lat: 13.0827, lng: 80.2707 }, // Chennai
            end: { lat: 25.2048, lng: 55.2708 }, // Dubai
          },
          {
            start: { lat: 13.0827, lng: 80.2707 }, // Chennai
            end: { lat: 55.77, lng: 37.5831 }, // Moscow
          },
        ]}
      />
    </div>
  );
}
