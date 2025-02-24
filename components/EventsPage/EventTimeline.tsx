import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { EventCard } from "./EventCard";

export function EventTimeline() {
  const data = dt.map((event) => {
    return {
      title: event.name,
      content: (
        <EventCard
          name={event.name}
          dateTime={event.dateTime}
          endDateTime={event.endDateTime}
          venue={event.venue}
          description={event.description}
          content={event.content}
          imageUrl={event.imageUrl}
          links={event.links}
          type={event.type}
        />
      ),
    };
  });

  return (
    <div className="w-full mx-auto">
      <div className="max-w-7xl mx-auto pt-20 px-6 md:px-12 lg:px-16">
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
          Our Events, Our Memories
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-md">
          Relive the moments and experiences that shaped our journey at IIIT Sri
          City. Get to know about upcoming events and many more...
        </p>
      </div>

      <Timeline data={data} />
    </div>
  );
}
