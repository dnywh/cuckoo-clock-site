// src/utils/timeUtils.js
import { seasons } from '../data/bird_data.json';

export function getCurrentSeasonAndTime() {
    // Create a date object for Canberra time
    const canberraDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Canberra" }));

    const month = canberraDate.getMonth() + 1; // getMonth() returns 0-11
    const hours = canberraDate.getHours();
    const minutes = canberraDate.getMinutes();

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

    // Format the current date as 'Sept 28'
    const currentDate = canberraDate.toLocaleString('en-US', { month: 'short', day: 'numeric' });

    return { season: currentSeason, time: currentTime, date: currentDate };
}
