import { readFileSync } from "node:fs";
import type { Plugin } from "vite";

import {
  fetchSharedChrome,
  resolveSharedChromePath,
  writeSharedChromeSnapshot,
} from "./fetch-shared-chrome";
import type { SharedChrome } from "./types";

export type SharedChromeOptions = {
  url: string;
  path: string;
  requestInit?: RequestInit;
  injectStylesheets?: boolean;
  injectHeadScripts?: boolean;
};

function renderHead(
  chrome: SharedChrome,
  injectStylesheets: boolean,
  injectHeadScripts: boolean,
) {
  const stylesheets = injectStylesheets
    ? chrome.stylesheets
        .map(
          (href) =>
            `    <link rel="stylesheet" href="${href}" data-shared-chrome="true" />`,
        )
        .join("\n")
    : "";

  return [stylesheets, injectHeadScripts ? chrome.head_scripts_html : ""]
    .filter(Boolean)
    .join("\n");
}

export function sharedChrome({
  url,
  path,
  requestInit,
  injectStylesheets = true,
  injectHeadScripts = true,
}: SharedChromeOptions): Plugin {
  const snapshotPath = resolveSharedChromePath(path);

  return {
    name: "shared-chrome",
    async configResolved() {
      const chrome = await fetchSharedChrome(url, requestInit);
      await writeSharedChromeSnapshot(chrome, snapshotPath);
    },
    transformIndexHtml(html) {
      const chrome = JSON.parse(
        readFileSync(snapshotPath, "utf8"),
      ) as SharedChrome;

      return html.replace(
        "</head>",
        `${renderHead(chrome, injectStylesheets, injectHeadScripts)}\n  </head>`,
      );
    },
  };
}
