import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { SharedChrome } from "./types";

export function resolveSharedChromePath(filePath: string) {
  return path.resolve(process.cwd(), filePath);
}

export async function fetchSharedChrome(
  url: string,
  requestInit?: RequestInit,
): Promise<SharedChrome> {
  const response = await fetch(url, {
    ...requestInit,
    headers: {
      Accept: "application/json",
      ...(requestInit?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<SharedChrome>;
}

export async function writeSharedChromeSnapshot(
  chrome: SharedChrome,
  filePath: string,
) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(chrome, null, 2)}\n`);
}
