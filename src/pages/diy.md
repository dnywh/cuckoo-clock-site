---
title: Make Your Own
layout: ../layouts/Markdown.astro
---

Here's everything you need to know in order to fork this project and make your own Cuckoo Clock. Prerequisites:

- A Raspberry Pi
- An e-ink display
- Basic programming knowledge

This is divided in two parts:

1. The hardware
2. The companion website

They aren't dependent on each other. You could make one or both. So they are split apart below. But I start with what's core to both, what's shared.

This is lengthy. Use the table of contents to jump to whatever section you need.

## Core

### Images

I used images from the public domain.

### Sounds

Again, I've used media from the public domain for my sounds. I found [xeno-canto](https://xeno-canto.org) perfect for this.

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

## Physical clock

## Companion site

// src/config.ts

export const TIME_ZONE = "Australia/Canberra";
export const LOCATION_STRING = "Canberra, ATC";
