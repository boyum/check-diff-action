// @ts-check

import { defineConfig } from "vite";
import addTimestampCommentPlugin from "../add-timestamp-comment-plugin";

export default defineConfig({
  build: {
    lib: {
      entry: "index.js",
      name: "Test1",
      formats: ["es"],
    },
    outDir: "dist",
  },
  plugins: [addTimestampCommentPlugin()],
});
