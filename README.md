# Cuckoo Clock Site

This is a companion website to the [Cuckoo Clock](http://github.com/dnywh/cuckoo-clock) physical clock project. It’s designed to display more information on each bird, maybe after tapping the NFC chip slotted inside the clock’s housing.

[Astro](https://astro.build/) is the framework that powers this website. [GitHub Actions](https://github.com/dnywh/cuckoo-clock/blob/main/.github/workflows/sync-birds.yml) syncs bird data and imagery between the two repositories.

You can find more information about how it all works on the [Colophon](https://clock.dannywhite.net/colophon) page.

## Quick start

```bash
# Clone the repo
git clone https://github.com/dnywh/cuckoo-clock-site

# CD into it
cd cuckoo-clock-site

# Install the dependencies
npm install

# Run Astro locally
npm run dev
```
