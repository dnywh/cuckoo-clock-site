import { birds as birdsWithTimes } from "../data/bird_data.json";
import birdDetails from "../data/bird_details.json";

interface Season {
  months: number[];
}

interface Seasons {
  spring: string[];
  summer: string[];
  autumn: string[];
  winter: string[];
}

interface BirdWithTimes {
  name: string;
  slug: string;
  seasons: Seasons;
}

interface BirdDetails {
  scientificName: string;
  description: string;
  habitat: string;
  diet: string;
  images: {
    url: string;
    source?: string;
    author?: string;
    caption: string;
  }[];
  funFacts: string[];
}

interface MergedBird extends BirdWithTimes, BirdDetails {}

export function getMergedBirdData(): Record<string, MergedBird> {
  const mergedData: Record<string, MergedBird> = {};

  for (const [slug, birdTime] of Object.entries(birdsWithTimes)) {
    if (birdDetails[slug as keyof typeof birdDetails]) {
      mergedData[slug] = {
        ...(birdTime as BirdWithTimes),
        ...(birdDetails[slug as keyof typeof birdDetails] as BirdDetails),
      };
    } else {
      mergedData[slug] = birdTime as BirdWithTimes;
    }
  }

  return mergedData;
}
