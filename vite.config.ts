import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

import { sharedChrome } from "./plugins/shared-chrome";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const sharedChromeUrl = env.VITE_SHARED_CHROME_URL;
  const sharedChromePath = "src/generated/chrome.json";

  return {
    plugins: [
      sharedChrome({
        url: sharedChromeUrl,
        path: sharedChromePath,
      }),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
  };
});
