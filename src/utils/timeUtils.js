// src/utils/timeUtils.js
import { seasons } from '../data/bird_data.json';

export function getCurrentSeasonAndTime() {
    // Create a date object for Canberra time
    const canberraTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Canberra" }));

    const month = canberraTime.getMonth() + 1; // getMonth() returns 0-11
    const hours = canberraTime.getHours();
    const minutes = canberraTime.getMinutes();

    // Determine the current season
    let currentSeason;
    for (const [season, data] of Object.entries(seasons)) {
        if (data.months.includes(month)) {
            currentSeason = season;
            break;
        }
    }

    // Format the current time as HH:MM
    const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return { season: currentSeason, time: currentTime };
}
