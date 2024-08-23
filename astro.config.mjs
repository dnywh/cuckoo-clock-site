import { defineConfig } from 'astro/config';
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
    image: {
        domains: ["inaturalist-open-data.s3.amazonaws.com", "flickr.com"]
    },
    output: "server",
    adapter: netlify()
});
