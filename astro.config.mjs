import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    image: {
        domains: ["inaturalist-open-data.s3.amazonaws.com", "flickr.com"],
    }
});
