import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type JekyllChrome = {
  stylesheets: string[];
  head_scripts_html: string;
  header_html: string;
  footer_html: string;
};

export const SHARED_CHROME_URL =
  process.env.SHARED_CHROME_URL ??
  "https://gro-319-see-if-we-can-find-a.metabase-github-io.pages.dev/shared/chrome.json";

export const sharedChromePath = path.resolve(
  process.cwd(),
  "src/shared/chrome.json",
);

export async function fetchSharedChrome(): Promise<JekyllChrome> {
  const response = await fetch(SHARED_CHROME_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<JekyllChrome>;
}

export async function writeSharedChromeSnapshot(chrome: JekyllChrome) {
  await mkdir(path.dirname(sharedChromePath), { recursive: true });
  await writeFile(sharedChromePath, `${JSON.stringify(chrome, null, 2)}\n`);
}
