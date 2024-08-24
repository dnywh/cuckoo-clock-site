import { atom, map } from "nanostores";
import { getMergedBirdData } from "../utils/birdDataMerger";
import {
  getCurrentSeasonAndTime,
  formatTime,
  addHour,
  parseTime,
} from "../utils/timeUtils";
import { quietHours } from "../data/bird_data.json";
import { TIME_ZONE } from "../config";

export interface BirdInfo {
  slug: string;
  name: string;
  startTime: string;
  endTime: string;
}

export const currentTime = atom<string>("");
export const currentSeason = atom<string>("");
export const currentBird = atom<BirdInfo | null>(null);
export const nextBird = atom<BirdInfo | null>(null);
export const daySchedule = map<Record<string, BirdInfo>>({});

let timeOffset = 0;

async function syncWithServerTime() {
  try {
    const startTime = Date.now();
    const response = await fetch("/api/server-time");
    const serverTime = await response.json();
    const endTime = Date.now();
    const latency = (endTime - startTime) / 2;
    timeOffset = serverTime - (endTime - latency);
    console.log(`Time sync completed. Offset: ${timeOffset}ms`);
  } catch (error) {
    console.error("Failed to sync with server time:", error);
  }
}

function getAdjustedTime() {
  return new Date(Date.now() + timeOffset);
}

function updateStore() {
  const adjustedDate = getAdjustedTime();
  const { season, time } = getCurrentSeasonAndTime(adjustedDate);

  currentTime.set(time);
  currentSeason.set(season);

  const birds = getMergedBirdData();
  const quietStart = quietHours[season].start;
  const quietEnd = quietHours[season].end;

  const schedule: BirdInfo[] = Object.entries(birds)
    .filter(
      ([_, bird]) => bird.seasons[season] && bird.seasons[season].length > 0
    )
    .map(([slug, bird]) => {
      const startTime = formatTime(bird.seasons[season][0]);
      const endTime = addHour(bird.seasons[season][0]);
      return { slug, name: bird.name, startTime, endTime };
    })
    .filter((bird) => {
      const isActive =
        (parseTime(bird.startTime) >= parseTime(quietEnd) &&
          parseTime(bird.startTime) < parseTime(quietStart)) ||
        (parseTime(bird.endTime) > parseTime(quietEnd) &&
          parseTime(bird.endTime) <= parseTime(quietStart));
      return isActive;
    })
    .sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

  daySchedule.set(
    Object.fromEntries(schedule.map((bird) => [bird.slug, bird]))
  );

  const currentTimeMinutes = parseTime(time);

  const currentBirdInfo =
    schedule.find(
      (bird) =>
        currentTimeMinutes >= parseTime(bird.startTime) &&
        currentTimeMinutes < parseTime(bird.endTime)
    ) || null;

  currentBird.set(currentBirdInfo);

  const nextBirdInfo =
    schedule.find((bird) => parseTime(bird.startTime) > currentTimeMinutes) ||
    schedule[0];

  nextBird.set(nextBirdInfo);

  console.log(
    `Store updated. Time: ${time}, Season: ${season}, Current Bird: ${currentBirdInfo?.name}, Next Bird: ${nextBirdInfo?.name}`
  );
}

async function initializeTimeSync() {
  await syncWithServerTime();
  updateStore();

  function scheduleNextUpdate() {
    const now = getAdjustedTime();
    const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    console.log(`Scheduling next update in ${delay}ms`);

    setTimeout(() => {
      updateStore();
      scheduleNextUpdate();
    }, delay);
  }

  scheduleNextUpdate();

  // Resync with server every hour
  setInterval(syncWithServerTime, 3600000);
}

// Initialize time synchronization only in browser environment
if (typeof window !== "undefined") {
  console.log("Initializing time sync in browser environment");
  initializeTimeSync();
}

// Development mode logging
if (import.meta.env.DEV) {
  currentTime.listen((time) => console.log("Current time updated:", time));
  currentBird.listen((bird) =>
    console.log("Current bird updated:", bird?.name)
  );
  nextBird.listen((bird) => console.log("Next bird updated:", bird?.name));
}
