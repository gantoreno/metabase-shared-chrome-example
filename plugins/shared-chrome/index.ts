import { readFileSync } from "node:fs";
import type { Plugin } from "vite";
import {
  fetchSharedChrome,
  type JekyllChrome,
  sharedChromePath,
  writeSharedChromeSnapshot,
} from "./fetch-shared-chrome";

function renderHead(chrome: JekyllChrome) {
  const stylesheetTags = chrome.stylesheets
    .map(
      (href) =>
        `    <link rel="stylesheet" href="${href}" data-shared-chrome="true" />`,
    )
    .join("\n");

  return [stylesheetTags, chrome.head_scripts_html].filter(Boolean).join("\n");
}

export function sharedChrome(): Plugin {
  let chrome: JekyllChrome | null = null;

  return {
    name: "shared-chrome",
    async configResolved() {
      chrome = await fetchSharedChrome();
      await writeSharedChromeSnapshot(chrome);
    },
    transformIndexHtml(html) {
      const sharedChrome =
        chrome ??
        (JSON.parse(readFileSync(sharedChromePath, "utf8")) as JekyllChrome);

      return html.replace("</head>", `${renderHead(sharedChrome)}\n  </head>`);
    },
  };
}
