import { atom, map } from "nanostores";
import { getMergedBirdData } from "../utils/birdDataMerger";
import {
  getCurrentMonthAndTime,
  formatTime,
  addHour,
  parseTime,
} from "../utils/timeUtils";
import { months, quietHours } from "../data/schedule.json";
import { TIME_ZONE } from "../config";

const mergedBirdData = getMergedBirdData();

export interface BirdInfo {
  slug: string;
  name: string;
  startTime: string;
}

export const currentTime = atom<string>("");
export const currentMonth = atom<string>("");
export const currentBird = atom<BirdInfo | null>(null);
export const nextBird = atom<BirdInfo | null>(null);
export const daySchedule = map<Record<string, BirdInfo>>({});

function getCurrentTime() {
  return new Date();
}

function updateStore() {
  const now = getCurrentTime();
  const { month, time } = getCurrentMonthAndTime();

  currentTime.set(time);
  currentMonth.set(month);

  const monthSchedule = months[month] || [];
  const schedule: BirdInfo[] = monthSchedule.map(({ bird, time }) => ({
    slug: bird,
    name: mergedBirdData[bird].name,
    startTime: formatTime(time),
  }));

  daySchedule.set(
    Object.fromEntries(schedule.map((bird) => [bird.slug, bird]))
  );

  const currentTimeMinutes = parseTime(time);
  const quietStart = parseTime(quietHours.start);
  const quietEnd = parseTime(quietHours.end);

  // Find the current bird by looking at the next bird's start time
  const currentBirdInfo =
    schedule.find((bird, index) => {
      const nextBird = schedule[index + 1] || schedule[0];
      const isInQuietHours =
        currentTimeMinutes >= quietStart && currentTimeMinutes < quietEnd;

      return (
        currentTimeMinutes >= parseTime(bird.startTime) &&
        currentTimeMinutes < parseTime(nextBird.startTime) &&
        !isInQuietHours
      );
    }) || null;

  currentBird.set(currentBirdInfo);

  const nextBirdInfo =
    schedule.find((bird) => parseTime(bird.startTime) > currentTimeMinutes) ||
    schedule[0];

  nextBird.set(nextBirdInfo);

  console.log(
    `Store updated. Time: ${time}, Month: ${month}, Current Bird: ${currentBirdInfo?.name}, Next Bird: ${nextBirdInfo?.name}`
  );
}

function scheduleNextUpdate() {
  const now = getCurrentTime();
  const msToNextMinute =
    60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

  // console.log(`Scheduling next update in ${msToNextMinute}ms`);

  setTimeout(() => {
    updateStore();
    scheduleNextUpdate();
  }, msToNextMinute);
}

function initializeTimeSync() {
  updateStore();
  scheduleNextUpdate();
}

if (typeof window !== "undefined") {
  // console.log("Browser environment detected, initializing time sync");
  initializeTimeSync();
} else {
  // console.log("Server environment detected, skipping time sync initialization");
}

// Development mode logging
if (import.meta.env.DEV) {
  currentTime.listen((time) => console.log("Current time updated:", time));
  currentBird.listen((bird) =>
    console.log("Current bird updated:", bird?.name)
  );
  nextBird.listen((bird) => console.log("Next bird updated:", bird?.name));
}
