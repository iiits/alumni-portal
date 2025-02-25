"use client";

import React, { useState } from "react";
import { Timeline } from "@/components/ui/timeline";
import { EventCard, EventCardProps } from "./EventCard";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/lib/store";
import { axiosInstance } from "@/lib/api/axios";

export function EventTimeline() {
  const [year, setYear] = useState<string>("");
  const [type, setType] = useState<string>("");

  const { data, error, isLoading } = useQuery<EventCardProps[]>({
    queryKey: ["events", year, type],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (year) queryParams.append("year", year);
      if (type) queryParams.append("type", type);

      const url = `/events/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await axiosInstance.get(url, {});
      return response.data.data;
    },
  });

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const eventData = data?.map((event) => {
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

  const years = Array.from(
    { length: new Date().getFullYear() - 2014 + 1 },
    (_, i) => new Date().getFullYear() - i,
  );

  return (
    <div className="w-full mx-auto">
      <div className="max-w-7xl mx-auto pt-20 px-6 md:px-12 lg:px-16">
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
          Our Events, Our Memories
        </h2>

        <div className="flex gap-4 mb-6">
          <select
            value={year}
            onChange={handleYearChange}
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">Upcoming Events</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={handleTypeChange}
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">All Types</option>
            <option value="alumni">Alumni</option>
            <option value="college">College</option>
            <option value="club">Club</option>
            <option value="others">Others</option>
          </select>
        </div>

        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-md">
          Relive the moments and experiences that shaped our journey at IIIT Sri
          City. Get to know about upcoming events and many more...
        </p>
      </div>

      <Timeline data={eventData || []} />
    </div>
  );
}
