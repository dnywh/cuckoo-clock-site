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
    date: formatDate(canberraDate),
  };
}

export function formatTime(date: Date): string {
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
