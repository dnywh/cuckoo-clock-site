// src/stores/birdTimeStore.ts
import { atom, map } from "nanostores";
import { getMergedBirdData } from "../utils/birdDataMerger";
import { getCurrentSeasonAndTime, formatTime } from "../utils/timeUtils";

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

function updateStore() {
  const birds = getMergedBirdData();
  const { season, time } = getCurrentSeasonAndTime();

  // Use formatTime to ensure consistent time format
  currentTime.set(formatTime(time));
  currentSeason.set(season);

  const schedule = Object.entries(birds)
    .filter(([_, bird]) => bird.seasons[season])
    .map(([slug, bird], index, array) => {
      const startTime = formatTime(bird.seasons[season][0]);
      const nextBird = array[index + 1];
      const endTime = nextBird
        ? formatTime(nextBird[1].seasons[season][0])
        : formatTime("24:00");
      return { slug, name: bird.name, startTime, endTime };
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  daySchedule.set(
    Object.fromEntries(schedule.map((bird) => [bird.slug, bird]))
  );

  const currentBirdInfo =
    schedule.find(
      (bird) =>
        currentTime.get() >= bird.startTime && currentTime.get() < bird.endTime
    ) || null;
  currentBird.set(currentBirdInfo);

  const nextBirdInfo =
    schedule.find((bird) => bird.startTime > currentTime.get()) || null;
  nextBird.set(nextBirdInfo);
}

// Initial update
updateStore();

// Update every minute
setInterval(updateStore, 60000);

// For testing purposes
export function setOverrideTime(time: string) {
  (window as any).overrideCurrentTime = time;
  updateStore();
}
