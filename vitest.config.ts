import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Rolldown-Vite accepts this runtime option, but Vitest's exported config
  // type has not exposed it yet.
  // @ts-expect-error -- supported by the active Rolldown-Vite runtime
  oxc: {
    include: /\.[cm]?[jt]sx?$/,
    jsx: { runtime: "automatic", importSource: "react" },
  },
  test: { environment: "node" },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
