import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { sharedChrome } from "./plugins/shared-chrome";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    sharedChrome(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
});
