import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(__dirname, "types/index.ts"),
      },
    },
    rollupOptions: {
      external: ["vue", "vitepress", /^vitepress\/.*/],
      output: [
        {
          format: "es",
          dir: "dist/esm",
          entryFileNames: "[name].js",
          preserveModules: true,
          preserveModulesRoot: __dirname,
          exports: "named",
        },
        {
          format: "cjs",
          dir: "dist/cjs",
          entryFileNames: "[name].cjs",
          preserveModules: true,
          preserveModulesRoot: __dirname,
          exports: "named",
        },
      ],
    },
  },
});
