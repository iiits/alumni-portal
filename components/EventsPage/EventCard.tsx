import Image from "next/image";
import { format } from "date-fns";
import { CalendarDays, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { getEventTypeColors } from "./EventTypecolour";

interface EventContent {
  title: string;
  description: string;
}

export interface EventCardProps {
  name: string;
  dateTime: string;
  endDateTime: string;
  venue: string;
  description: string;
  content: EventContent;
  imageUrl?: string;
  links?: string[];
  type: string;
}

export function EventCard({
  name,
  dateTime,
  endDateTime,
  venue,
  description,
  content,
  imageUrl,
  links,
  type,
}: EventCardProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), "MMM dd, yyyy h:mm a");
    // return date;
  };

  const colorScheme = getEventTypeColors(type);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between mb-4 max-md:flex-col gap-4 md:gap-2">
        {/* Date and Venue */}
        <div className="space-y-2 w-3/4">
          <div className="flex items-center text-sm">
            <CalendarDays size={16} className="mr-2 text-blue-500" />
            {dateTime === endDateTime ? (
              <span>{formatDate(dateTime)}</span>
            ) : (
              <span>
                {formatDate(dateTime)} - {formatDate(endDateTime)}
              </span>
            )}
          </div>
          <div className="flex items-center text-sm">
            <MapPin size={16} className="mr-2 text-pink-500" />
            <span>{venue}</span>
          </div>
        </div>
        {/* Event Type Badge */}
        <span
          className={`px-3 py-1 w-20 h-8 text-sm font-medium text-center rounded-full ${colorScheme.bg} ${colorScheme.text} ${colorScheme.darkBg} ${colorScheme.darkText} max-md:order-first`}
        >
          {type}
        </span>
      </div>

      {/* Event Description */}
      <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-2">
        {description}
      </p>

      {/* Content Section */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">{content.title}</h4>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {content.description}
        </p>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="mb-4">
          <Image
            src={imageUrl}
            alt={name}
            width={500}
            height={300}
            className="rounded-lg object-cover w-full h-48"
          />
        </div>
      )}

      {/* Links */}
      {links && links.length > 0 && (
        <div className="space-y-2">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center"
            >
              <ExternalLink
                size={16}
                className="inline-block mr-2 text-blue-500"
              />
              {link.replace(/^https?:\/\//, "")}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
