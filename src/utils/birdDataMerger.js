import { birds as birdsWithTimes } from '../data/bird_data.json';
import birdDetails from '../data/bird_details.json';

export function getMergedBirdData() {
    const mergedData = {};

    for (const [slug, birdTime] of Object.entries(birdsWithTimes)) {
        if (birdDetails[slug]) {
            mergedData[slug] = {
                ...birdTime,
                ...birdDetails[slug]
            };
        } else {
            mergedData[slug] = birdTime;
        }
    }

    return mergedData;
}
