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
    const response = await fetch("/api/server-time");
    const serverTime = await response.json();
    const clientTime = Date.now();
    timeOffset = serverTime - clientTime;
    console.log(`Time offset: ${timeOffset}ms`);
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

  console.log("Current local time:", time);
  console.log("Current season:", season);

  const birds = getMergedBirdData();
  const quietStart = quietHours[season].start;
  const quietEnd = quietHours[season].end;

  console.log("Quiet hours:", { quietStart, quietEnd });

  const schedule: BirdInfo[] = Object.entries(birds)
    .filter(
      ([_, bird]) => bird.seasons[season] && bird.seasons[season].length > 0
    )
    .map(([slug, bird]) => {
      const startTime = formatTime(bird.seasons[season][0]);
      const endTime = addHour(bird.seasons[season][0]);
      console.log(
        `Mapping ${bird.name}: startTime = ${startTime}, endTime = ${endTime}`
      );
      return { slug, name: bird.name, startTime, endTime };
    })
    .filter((bird) => {
      const isActive =
        (parseTime(bird.startTime) >= parseTime(quietEnd) &&
          parseTime(bird.startTime) < parseTime(quietStart)) ||
        (parseTime(bird.endTime) > parseTime(quietEnd) &&
          parseTime(bird.endTime) <= parseTime(quietStart));
      console.log(`Filtering ${bird.name}: is active = ${isActive}`);
      return isActive;
    })
    .sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

  console.log("Final schedule:", schedule);

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
  console.log("Current bird:", currentBirdInfo);

  const nextBirdInfo =
    schedule.find((bird) => parseTime(bird.startTime) > currentTimeMinutes) ||
    schedule[0];

  nextBird.set(nextBirdInfo);
  console.log("Next bird:", nextBirdInfo);
}

async function initializeTimeSync() {
  await syncWithServerTime();
  updateStore();

  const now = getAdjustedTime();
  const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

  setTimeout(() => {
    updateStore();
    setInterval(updateStore, 60000);
  }, delay);

  // Resync with server every hour
  setInterval(syncWithServerTime, 3600000);
}

// Initialize time synchronization
initializeTimeSync();

if (import.meta.env.DEV) {
  // Log updates in development mode
  currentTime.listen((time) => console.log("Current time updated:", time));
  currentBird.listen((bird) => console.log("Current bird updated:", bird));
  nextBird.listen((bird) => console.log("Next bird updated:", bird));
}
