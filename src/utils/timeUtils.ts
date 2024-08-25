import { seasons } from "../data/bird_data.json";
import { TIME_ZONE } from "../config";

export function getCurrentSeasonAndTime() {
  const now = new Date();
  // console.log("1. Current UTC time:", now.toUTCString());

  const localString = now.toLocaleString("en-US", { timeZone: TIME_ZONE });
  // console.log("2. Local time string:", localString);

  const [datePart, timePart] = localString.split(", ");
  // console.log("3. Local time parts:", { datePart, timePart });

  const month = new Date(localString).getMonth() + 1;
  const currentSeason =
    Object.entries(seasons).find(([_, data]) =>
      data.months.includes(month)
    )?.[0] || "unknown";

  const formattedTime = formatTime(timePart);
  // console.log("4. Formatted local time:", formattedTime);

  return {
    season: currentSeason,
    time: formattedTime,
  };
}

export function parseTime(timeString: string): number {
  const [time, period] = timeString.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function formatTime(input: string): string {
  // If it's already in 12-hour format, return as is
  if (input.includes("AM") || input.includes("PM")) {
    return input;
  }

  // If it's in 24-hour format, convert to 12-hour format
  const [hours, minutes] = input.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12;
  return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function addHour(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setHours(date.getHours() + 1);
  return formatTime(date.getHours() + ":" + date.getMinutes());
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: TIME_ZONE,
  });
}
