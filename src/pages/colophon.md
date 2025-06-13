---
title: Colophon
layout: ../layouts/Markdown.astro
---

This page goes over how Cuckoo Clock was made and credits the media creators, both for the physical device and this very website. You can also skip over to their GitHub repositories for a more straightforward guide to making it your own:

1. [Cuckoo Clock device repo](http://github.com/dnywh/cuckoo-clock)
2. [Cuckoo Clock website repo](http://github.com/dnywh/cuckoo-clock-site)

## Shared

Media that both the hardware and website use.

### Images

I used images from the public domain, specifically John and Elizabeth Gould’s _Birds of Australia_.

### Sounds

I used public domain sounds from [xeno-canto](https://xeno-canto.org). Each sound has had its author credited in `details.json`, exposed in each bird’s webpage.

Here’s how I sourced and edited the sound files:

1. Search for the bird’s name on xeno-canto. Ideally its scientific Latin name. Wait a second for suggested results to populate to narrow the species. Sort by length, shortest to longest. Focus on those less than 10 seconds. Only get ones with an A rating.
2. Save some sounds for each bird from xeno-canto as an MP3.
3. Trim each MP3 that needs trimming via QuickTime. Export as → Audio only (M4A).
4. Convert the M4A back to MP3, add a short fade, and trim the file name (note this affects all MFA files in the current directory):

```bash
for file in *.m4a; do output="${file%% -*}.mp3"; duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$file"); fade_start=$(echo "$duration - 0.15" | bc); ffmpeg -i "$file" -c:v copy -af "afade=t=in:st=0:d=0.15,afade=t=out:st=$fade_start:d=0.15" -c:a libmp3lame -q:a 4 -map_metadata -1 "$output"; done
```

If I don’t need to trim, at least strip the metadata and set a fade:

```bash
for file in *.mp3; do output="${file%% -*}.mp3"; ffmpeg -i "$file" -c:a libmp3lame -q:a 4 -af "afade=t=in:st=0:d=0.15,afade=t=out:st=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$file" | awk '{print $1-0.15}'):d=0.15" -map_metadata -1 "$output"; done
```

5. Save the result (e.g. XC677472.mp3) to the appropriate bird folder. Make sure to keep the xeno-cato ID in that name somewhere so you can credit the author.

### Syncing between the two repos

Instructions coming soon.

---

## Physical device (the clock)

Instructions coming soon.

## Companion site

This very site.

### Now page

A NFC chip built-in to the [Cuckoo Clock](http://github.com/dnywh/cuckoo-clock) housing points to `clock.dannywhite.net/now`. That `/now` page, handled in `now.astro`, acts as a dynamic redirector to the current bird’s page, determined via that shared `schedule.json` file synced via the aforementioend [GitHub Action](https://github.com/dnywh/cuckoo-clock/blob/main/.github/workflows/sync-birds.yml).

This set up means that the NFC chip can permanently point to `/now`, with the site doing the heavy lifting to open the current bird’s page. No reprogramming of the NFC chip necessary.

### Today’s schedule

`BirdSchedule.astro` shows today’s schedule with the current and next birds.
