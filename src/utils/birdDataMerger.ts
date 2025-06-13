import birdDetails from "../data/details.json";

interface BirdDetails {
  name: string;
  latin: string;
  habitat?: string;
  description?: string;
  diet?: string;
  funFacts?: string[];
  images?: Array<{
    url: string;
    caption: string;
    source: string;
    author: string;
  }>;
}

export interface MergedBird extends BirdDetails {
  slug: string;
}

export function getMergedBirdData(): Record<string, MergedBird> {
  const mergedData: Record<string, MergedBird> = {};

  // Create merged data for each bird from details
  Object.entries(birdDetails).forEach(([slug, details]) => {
    mergedData[slug] = {
      ...details,
      slug,
    };
  });

  return mergedData;
}
