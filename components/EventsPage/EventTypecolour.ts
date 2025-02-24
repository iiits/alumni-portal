type EventType = "alumni" | "college" | "club" | "others";

interface ColorScheme {
  bg: string;
  text: string;
  darkBg: string;
  darkText: string;
}

const eventColorSchemes: Record<EventType, ColorScheme> = {
  alumni: {
    bg: "bg-teal-100",
    text: "text-teal-800",
    darkBg: "dark:bg-teal-900",
    darkText: "dark:text-teal-200",
  },
  college: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    darkBg: "dark:bg-purple-900",
    darkText: "dark:text-purple-200",
  },
  club: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    darkBg: "dark:bg-amber-900",
    darkText: "dark:text-amber-200",
  },
  others: {
    bg: "bg-slate-100",
    text: "text-slate-800",
    darkBg: "dark:bg-slate-800",
    darkText: "dark:text-slate-200",
  },
};

export const getEventTypeColors = (type: string): ColorScheme => {
  return eventColorSchemes[type as EventType] || eventColorSchemes.others;
};
