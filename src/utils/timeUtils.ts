// src/utils/timeUtils.ts
import { seasons } from "../data/bird_data.json";

export function getCurrentSeasonAndTime() {
  const canberraDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Australia/Canberra" })
  );

  const month = canberraDate.getMonth() + 1;
  const currentSeason =
    Object.entries(seasons).find(([_, data]) =>
      data.months.includes(month)
    )?.[0] || "unknown";

  return {
    season: currentSeason,
    time: formatTime(canberraDate),
  };
}

export function formatTime(input: Date | string): string {
  let date: Date;
  if (typeof input === "string") {
    // If input is a string, assume it's in HH:MM format
    const [hours, minutes] = input.split(":").map(Number);
    date = new Date();
    date.setHours(hours, minutes);
  } else {
    date = input;
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Australia/Canberra",
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "Australia/Canberra",
  });
}
