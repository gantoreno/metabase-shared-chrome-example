import { useEffect } from "react";
import useSWR from "swr";

export type JekyllChrome = {
  stylesheets: string[];
  head_scripts_html: string;
  header_html: string;
  footer_html: string;
};

export const SHARED_CHROME_URL =
  "https://gro-319-see-if-we-can-find-a.metabase-github-io.pages.dev/shared/chrome.json";

export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export const appendStylesheets = (chrome: JekyllChrome) => {
  const cleanupNodes: HTMLElement[] = [];

  chrome.stylesheets.forEach((stylesheetUrl) => {
    if (
      document.head.querySelector(
        `link[rel="stylesheet"][href="${CSS.escape(stylesheetUrl)}"]`,
      )
    ) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = stylesheetUrl;
    link.dataset.sharedChrome = "true";
    document.head.appendChild(link);
    cleanupNodes.push(link);
  });

  if (chrome.head_scripts_html.trim()) {
    const template = document.createElement("template");
    template.innerHTML = chrome.head_scripts_html;

    template.content.childNodes.forEach((node) => {
      if (!(node instanceof Element)) {
        return;
      }

      let nodeToInsert: HTMLElement | null = null;

      if (node instanceof HTMLScriptElement) {
        const script = document.createElement("script");

        Array.from(node.attributes).forEach(({ name, value }) => {
          script.setAttribute(name, value);
        });

        script.textContent = node.textContent;
        nodeToInsert = script;
      } else if (node instanceof HTMLElement) {
        nodeToInsert = node.cloneNode(true) as HTMLElement;
      }

      if (!nodeToInsert) {
        return;
      }

      nodeToInsert.dataset.sharedChrome = "true";
      document.head.appendChild(nodeToInsert);
      cleanupNodes.push(nodeToInsert);
    });
  }

  return cleanupNodes;
};

export function useSharedChrome() {
  const {
    data: chrome,
    error,
    isLoading,
  } = useSWR<JekyllChrome>(SHARED_CHROME_URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    const cleanupNodes = chrome ? appendStylesheets(chrome) : [];
    return () => cleanupNodes.forEach((node) => node.remove());
  }, [chrome]);

  return {
    chrome,
    error,
    isLoading,
  };
}
