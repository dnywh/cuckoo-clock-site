# Cuckoo Clock Site

This is a companion website to the [Cuckoo Clock](http://github.com/dnywh/cuckoo-clock) project. It has more information on each bird, available at a tap. It's built using [Astro](https://astro.build/). A [GitHub Action](https://github.com/dnywh/cuckoo-clock/blob/main/.github/workflows/sync-birds.yml) syncs bird data and imagery between the two repositories.

## Now

A NFC chip built-in to the [Cuckoo Clock](http://github.com/dnywh/cuckoo-clock) housing points to `clock.dannywhite.net/now`. That `/now` page, handled in `now.astro`, acts as a dynamic redirector to the current bird’s page, determined via that shared `schedule.json` file synced via the aforementioend [GitHub Action](https://github.com/dnywh/cuckoo-clock/blob/main/.github/workflows/sync-birds.yml).

This set up means that the NFC chip can permanently point to `/now`, with the site doing the heavy lifting to open the current bird’s page. No reprogramming of the NFC chip necessary.

## Today’s schedule

`BirdSchedule.astro` shows today’s schedule with the current and next birds.
