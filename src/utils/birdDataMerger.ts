import birdDetails from "../data/details.json";

interface BirdDetails {
  name: string;
  latin: string;
  description: string;
  facts: Array<{
    title: string;
    description: string;
  }>;
  images: Array<{
    url: string;
    author: string;
    caption: string;
    source: {
      title: string;
      url: string;
    };
  }>;
  sounds: Array<{
    file: string;
    author: string;
    description: string;
    source: {
      title: string;
      url: string;
    };
    license?: {
      type: string;
      url: string;
    };
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
      slug,
      ...details,
    };
  });

  return mergedData;
}
