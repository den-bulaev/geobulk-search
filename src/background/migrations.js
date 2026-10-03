import { v4 as uuidv4 } from "uuid";

import { ChromeStorageKeys } from "../utils";

function isVersionLower(oldVer, newVer) {
  return (
    oldVer.localeCompare(newVer, undefined, {
      numeric: true,
      sensitivity: "base",
    }) < 0
  );
}

export async function runDataMigrations(fromVersion) {
  const result = await chrome.storage.local.get(ChromeStorageKeys.presets);
  let data = result[ChromeStorageKeys.presets];

  if (!data || !Array.isArray(data)) return;

  if (isVersionLower(fromVersion, "1.1.2")) {
    data = data.map((item) => ({
      ...item,
      id: uuidv4(),
      isChecked: true,
    }));
  }

  await chrome.storage.local.set({ [ChromeStorageKeys.presets]: data });
}
