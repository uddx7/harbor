// @ts-expect-error Node test types are intentionally outside the browser-only tsconfig.
import assert from "node:assert/strict";
// @ts-expect-error Node test types are intentionally outside the browser-only tsconfig.
import { readFileSync } from "node:fs";
// @ts-expect-error Node test types are intentionally outside the browser-only tsconfig.
import test from "node:test";

const types = readFileSync(new URL("../src/lib/settings/types.ts", import.meta.url), "utf8");
const defaults = readFileSync(new URL("../src/lib/settings/defaults.ts", import.meta.url), "utf8");

test("the settings schema declares all five desktop-notification toggles", () => {
  assert.match(types, /desktopNotificationsEnabled: boolean;/);
  assert.match(types, /notifyNewEpisodes: boolean;/);
  assert.match(types, /notifyDownloadsComplete: boolean;/);
  assert.match(types, /notifyNewBadges: boolean;/);
  assert.match(types, /notifyFriendRequests: boolean;/);
  assert.match(defaults, /desktopNotificationsEnabled: true,/);
  assert.match(defaults, /notifyNewEpisodes: true,/);
  assert.match(defaults, /notifyDownloadsComplete: true,/);
  assert.match(defaults, /notifyNewBadges: true,/);
  assert.match(defaults, /notifyFriendRequests: true,/);
});

import "./_localstorage-stub.ts";
import {
  consumePendingNavTarget,
  readDesktopNotifySettings,
  sendDesktopNotification,
  setPendingNavTarget,
} from "../src/lib/desktop-notify.ts";

const ALL_ON = {
  desktopNotificationsEnabled: true,
  notifyNewEpisodes: true,
  notifyDownloadsComplete: true,
  notifyNewBadges: true,
  notifyFriendRequests: true,
};

test("readDesktopNotifySettings defaults to all five toggles on when nothing is stored", () => {
  localStorage.clear();
  assert.deepEqual(readDesktopNotifySettings(), ALL_ON);
});

test("readDesktopNotifySettings honors stored false values", () => {
  const allOff = Object.fromEntries(Object.keys(ALL_ON).map((k) => [k, false]));
  localStorage.setItem("harbor.settings", JSON.stringify(allOff));
  assert.deepEqual(readDesktopNotifySettings(), allOff);
});

test("readDesktopNotifySettings falls back to defaults on malformed JSON", () => {
  localStorage.setItem("harbor.settings", "{not json");
  assert.deepEqual(readDesktopNotifySettings(), ALL_ON);
});

test("pending nav targets are queued in order and drained one at a time (FIFO)", () => {
  assert.equal(consumePendingNavTarget(), null);
  setPendingNavTarget({ kind: "downloads" });
  setPendingNavTarget({ kind: "meta", meta: { id: "tt1", type: "movie", name: "A" } });
  assert.deepEqual(consumePendingNavTarget(), { kind: "downloads" });
  assert.deepEqual(consumePendingNavTarget(), {
    kind: "meta",
    meta: { id: "tt1", type: "movie", name: "A" },
  });
  assert.equal(consumePendingNavTarget(), null, "the queue must be empty after both are drained");
});

test("a pending nav target older than the TTL is discarded, not misdelivered to a later unrelated focus event", () => {
  const realNow = Date.now;
  try {
    Date.now = () => 1_000_000;
    setPendingNavTarget({ kind: "downloads" });
    Date.now = () => 1_000_000 + 3 * 60 * 1000; // 3 minutes later, past the 2-minute TTL
    assert.equal(consumePendingNavTarget(), null);
  } finally {
    Date.now = realNow;
  }
});

test("a pending nav target still within the TTL is delivered normally", () => {
  const realNow = Date.now;
  try {
    Date.now = () => 2_000_000;
    setPendingNavTarget({ kind: "downloads" });
    Date.now = () => 2_000_000 + 60 * 1000; // 1 minute later, within the 2-minute TTL
    assert.deepEqual(consumePendingNavTarget(), { kind: "downloads" });
  } finally {
    Date.now = realNow;
  }
});

test("sendDesktopNotification resolves false without throwing outside a Tauri window", async () => {
  localStorage.clear();
  await assert.doesNotReject(async () => {
    const shown = await sendDesktopNotification({ title: "t", body: "b" });
    assert.equal(shown, false);
  });
});

const desktopNotifySrc = readFileSync(new URL("../src/lib/desktop-notify.ts", import.meta.url), "utf8");

test("desktop-notify reuses the shared platform check instead of a local copy", () => {
  assert.match(desktopNotifySrc, /import \{ isWeb \} from "@\/lib\/platform";/);
  assert.doesNotMatch(desktopNotifySrc, /"__TAURI_INTERNALS__" in window/);
});

test("ensureDesktopNotifyPermission is gated on the master toggle before it can prompt", () => {
  const start = desktopNotifySrc.indexOf("export async function ensureDesktopNotifyPermission");
  const body = desktopNotifySrc.slice(start, desktopNotifySrc.indexOf("\n}\n", start));
  assert.match(body, /if \(!readDesktopNotifySettings\(\)\.desktopNotificationsEnabled\) return false;/);
});

test("sendDesktopNotification reports whether an OS-controlled sound actually played", () => {
  assert.match(desktopNotifySrc, /export async function sendDesktopNotification[\s\S]*?: Promise<boolean>/);
  assert.match(desktopNotifySrc, /return true;/);
});

const bridgeSrc = readFileSync(new URL("../src/lib/desktop-notify-bridge.tsx", import.meta.url), "utf8");
const appSrc = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");

test("the desktop-notify bridge consumes the pending target on window focus and routes it", () => {
  assert.match(bridgeSrc, /export function DesktopNotifyBridge/);
  assert.match(bridgeSrc, /import \{ isWeb \} from "@\/lib\/platform";/);
  assert.match(
    bridgeSrc,
    /import \{ openNotificationCenter \} from "@\/lib\/social\/notification-open";/,
  );
  assert.match(bridgeSrc, /getCurrentWindow\(\)/);
  assert.match(bridgeSrc, /\.onFocusChanged\(/);
  assert.match(bridgeSrc, /consumePendingNavTarget\(\)/);
  assert.match(bridgeSrc, /setView\("downloads"\)/);
  assert.match(bridgeSrc, /openNotificationCenter\(\)/);
  assert.match(bridgeSrc, /openMeta\(target\.meta\)/);
});

test("App.tsx mounts the desktop-notify bridge", () => {
  assert.match(appSrc, /import \{ DesktopNotifyBridge \} from "@\/lib\/desktop-notify-bridge";/);
  assert.match(appSrc, /<DesktopNotifyBridge \/>/);
});

const remindersSrc = readFileSync(new URL("../src/lib/reminders.ts", import.meta.url), "utf8");
const reminderButtonSrc = readFileSync(
  new URL("../src/components/reminder-button.tsx", import.meta.url),
  "utf8",
);

test("firing a reminder is gated on its own toggle and only plays the local tone when no OS sound played", () => {
  assert.match(
    remindersSrc,
    /import \{ readDesktopNotifySettings, sendDesktopNotification \} from "@\/lib\/desktop-notify";/,
  );
  assert.doesNotMatch(remindersSrc, /export async function ensureNotifyPermission/);
  assert.doesNotMatch(remindersSrc, /new Notification\(/);
  assert.match(remindersSrc, /if \(!readDesktopNotifySettings\(\)\.notifyNewEpisodes\)/);
  assert.match(
    remindersSrc,
    /navTarget: \{\s*kind: "meta",\s*meta: \{ id: entry\.id, type: entry\.type, name: entry\.name, poster: entry\.poster \},\s*\}/,
  );
  assert.match(remindersSrc, /\.then\(\(playedOsSound\) => \{\s*if \(!playedOsSound\) playTone\(entry\.tone\);/);
});

test("the reminder button requests the native desktop permission, not the web one", () => {
  assert.match(
    reminderButtonSrc,
    /import \{ ensureDesktopNotifyPermission \} from "@\/lib\/desktop-notify";/,
  );
  assert.match(reminderButtonSrc, /void ensureDesktopNotifyPermission\(\);/);
  assert.doesNotMatch(reminderButtonSrc, /\bensureNotifyPermission\b/);
});

test("the reminder tone picker hides itself when desktop notifications will already supply the sound", () => {
  assert.match(
    reminderButtonSrc,
    /const toneSuperseded =\s*!isWeb\(\) && settings\.desktopNotificationsEnabled && settings\.notifyNewEpisodes;/,
  );
  assert.match(reminderButtonSrc, /toneSuperseded \? \(/);
  assert.match(
    reminderButtonSrc,
    /"Desktop notifications already play a sound for this\. Turn them off for episodes in Settings to pick a tone here instead\."/,
  );
});

import { notifyNewSocialActivity } from "../src/lib/social/social-desktop-notify.ts";

const badgeNotif = {
  id: "s:badge-1",
  source: "social" as const,
  kind: "badge-received",
  title: "You earned the Founder badge",
  createdAt: 1,
  read: false,
};
const request1 = {
  edgeId: "edge-1",
  from: { handle: "sam", alias: "Sam" },
  createdAt: "2026-01-01T00:00:00.000Z",
};

test("the first notifyNewSocialActivity call only seeds a baseline, no burst for pre-existing items", () => {
  localStorage.removeItem("harbor.social.notifySeen.v1");
  notifyNewSocialActivity([badgeNotif], [request1]);
  const stored = JSON.parse(localStorage.getItem("harbor.social.notifySeen.v1"));
  assert.equal(stored.initialized, true);
  assert.deepEqual(stored.badges, ["s:badge-1"]);
  assert.deepEqual(stored.friendRequests, ["edge-1"]);
});

test("a later call folds a newly-seen badge and request into the baseline", () => {
  const badge2 = { ...badgeNotif, id: "s:badge-2" };
  const request2 = { ...request1, edgeId: "edge-2" };
  notifyNewSocialActivity([badgeNotif, badge2], [request1, request2]);
  const stored = JSON.parse(localStorage.getItem("harbor.social.notifySeen.v1"));
  assert.deepEqual(stored.badges.sort(), ["s:badge-1", "s:badge-2"]);
  assert.deepEqual(stored.friendRequests.sort(), ["edge-1", "edge-2"]);
});

const socialNotifySrc = readFileSync(
  new URL("../src/lib/social/social-desktop-notify.ts", import.meta.url),
  "utf8",
);
const useNotificationCenterSrc = readFileSync(
  new URL("../src/lib/social/use-notification-center.ts", import.meta.url),
  "utf8",
);

test("new badges and friend requests are each gated by their own toggle", () => {
  assert.match(socialNotifySrc, /if \(settings\.notifyNewBadges\)/);
  assert.match(socialNotifySrc, /if \(settings\.notifyFriendRequests\)/);
  assert.match(socialNotifySrc, /navTarget: \{ kind: "notifications" \}/);
  assert.match(
    useNotificationCenterSrc,
    /notifyNewSocialActivity\(feed\.items, reqs\)/,
  );
});

test("a burst of many new badges/requests in one pass collapses into a single summary notification", () => {
  assert.match(socialNotifySrc, /const BURST_THRESHOLD = 3;/);
  assert.match(
    socialNotifySrc,
    /newBadges\.length > BURST_THRESHOLD[\s\S]{0,120}t\("\{n\} new badges", \{ n: newBadges\.length \}\)/,
  );
  assert.match(
    socialNotifySrc,
    /newRequests\.length > BURST_THRESHOLD[\s\S]{0,150}t\("\{n\} new friend requests", \{ n: newRequests\.length \}\)/,
  );
});

const downloadsStoreSrc = readFileSync(
  new URL("../src/lib/download/downloads-store.ts", import.meta.url),
  "utf8",
);

test("a finished download sends a desktop notification gated by its own toggle", () => {
  assert.match(
    downloadsStoreSrc,
    /import \{ readDesktopNotifySettings, sendDesktopNotification \} from "@\/lib\/desktop-notify";/,
  );
  assert.match(downloadsStoreSrc, /if \(readDesktopNotifySettings\(\)\.notifyDownloadsComplete\)/);
  assert.match(downloadsStoreSrc, /sendDesktopNotification\(\{\s*title: item\.title,/);
  assert.match(downloadsStoreSrc, /navTarget: \{ kind: "downloads" \},/);
});

const sectionSrc = readFileSync(
  new URL("../src/views/settings/desktop-notifications-section.tsx", import.meta.url),
  "utf8",
);
const advancedPanelSrc = readFileSync(
  new URL("../src/views/settings/advanced-panel.tsx", import.meta.url),
  "utf8",
);
const desktopNotificationsPanelSrc = readFileSync(
  new URL("../src/views/settings/desktop-notifications-panel.tsx", import.meta.url),
  "utf8",
);
const settingsViewSrc = readFileSync(new URL("../src/views/settings.tsx", import.meta.url), "utf8");
const sharedSrc = readFileSync(new URL("../src/views/settings/shared.tsx", import.meta.url), "utf8");
const navSrc = readFileSync(new URL("../src/views/settings/nav.tsx", import.meta.url), "utf8");

test("the desktop notifications settings section wires all five toggles, fully translated", () => {
  assert.match(sectionSrc, /export function DesktopNotificationsSection/);
  assert.match(sectionSrc, /const t = useT\(\);/);

  assert.match(sectionSrc, /value=\{settings\.desktopNotificationsEnabled\}/);
  assert.match(sectionSrc, /onChange=\{\(v\) => update\(\{ desktopNotificationsEnabled: v \}\)\}/);
  assert.match(sectionSrc, /label=\{t\("Desktop notifications"\)\}/);

  assert.match(sectionSrc, /value=\{settings\.notifyNewEpisodes\}/);
  assert.match(sectionSrc, /onChange=\{\(v\) => update\(\{ notifyNewEpisodes: v \}\)\}/);
  assert.match(sectionSrc, /label=\{t\("Notify about new episodes"\)\}/);

  assert.match(sectionSrc, /value=\{settings\.notifyDownloadsComplete\}/);
  assert.match(sectionSrc, /onChange=\{\(v\) => update\(\{ notifyDownloadsComplete: v \}\)\}/);
  assert.match(sectionSrc, /label=\{t\("Notify when a download finishes"\)\}/);

  assert.match(sectionSrc, /value=\{settings\.notifyNewBadges\}/);
  assert.match(sectionSrc, /onChange=\{\(v\) => update\(\{ notifyNewBadges: v \}\)\}/);
  assert.match(sectionSrc, /label=\{t\("Notify about new badges"\)\}/);

  assert.match(sectionSrc, /value=\{settings\.notifyFriendRequests\}/);
  assert.match(sectionSrc, /onChange=\{\(v\) => update\(\{ notifyFriendRequests: v \}\)\}/);
  assert.match(sectionSrc, /label=\{t\("Notify about friend requests"\)\}/);

  assert.match(sectionSrc, /!settings\.desktopNotificationsEnabled/);
  const lockReasonPropCount = (sectionSrc.match(/lockReason=\{lockReason\}/g) ?? []).length;
  assert.equal(lockReasonPropCount, 4, "all four category toggles must be locked when the master is off");
  assert.doesNotMatch(sectionSrc, /note="[^{]/, "every user-facing string must go through t()");
  assert.doesNotMatch(sectionSrc, /label="[^{]/, "every user-facing string must go through t()");
});

test("there is no manual test button in the shipped settings UI (dev-only aid, not a real feature)", () => {
  assert.doesNotMatch(sectionSrc, /TestButton|testContent|sendDesktopNotification|Send test notification/);
});

test("desktop notifications live in their own settings page under the Notifications nav group, not Advanced", () => {
  assert.doesNotMatch(
    advancedPanelSrc,
    /DesktopNotificationsSection|title=\{t\("Desktop notifications"\)\}/,
  );

  assert.match(sharedSrc, /\| "desktopNotifications"/);

  assert.match(
    desktopNotificationsPanelSrc,
    /import \{ DesktopNotificationsSection \} from "\.\/desktop-notifications-section";/,
  );
  assert.match(desktopNotificationsPanelSrc, /title=\{t\("Desktop notifications"\)\}/);
  assert.match(desktopNotificationsPanelSrc, /<DesktopNotificationsSection \/>/);

  assert.match(
    settingsViewSrc,
    /import\("\.\/settings\/desktop-notifications-panel"\)\.then\(\(m\) => \(\{ default: m\.DesktopNotificationsPanel \}\)\)/,
  );
  assert.match(
    settingsViewSrc,
    /desktopNotifications: \{\s*label: "Desktop notifications",/,
  );
  assert.match(
    settingsViewSrc,
    /\{active === "desktopNotifications" && <DesktopNotificationsPanel \/>\}/,
  );

  assert.match(
    navSrc,
    /heading: "Notifications",\s*items: \[[\s\S]{0,400}id: "desktopNotifications",[\s\S]{0,120}label: "Desktop notifications",/,
  );
  assert.match(
    navSrc,
    /section: "desktopNotifications",[\s\S]{0,200}anchorTitle: "Desktop notifications"/,
  );
});

const arSettings = readFileSync(
  new URL("../src/lib/i18n/locales/ar/settings.ts", import.meta.url),
  "utf8",
);
const ptSettings = readFileSync(
  new URL("../src/lib/i18n/locales/pt/settings.ts", import.meta.url),
  "utf8",
);
const ruSettings = readFileSync(
  new URL("../src/lib/i18n/locales/ru/settings.ts", import.meta.url),
  "utf8",
);

test("the Tauri capability grants only the three notification commands actually used, not the full default set", () => {
  const capabilitiesSrc = readFileSync(
    new URL("../src-tauri/capabilities/default.json", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(capabilitiesSrc, /"notification:default"/);
  assert.match(capabilitiesSrc, /"notification:allow-is-permission-granted"/);
  assert.match(capabilitiesSrc, /"notification:allow-request-permission"/);
  assert.match(capabilitiesSrc, /"notification:allow-notify"/);
});

test("every new desktop-notifications string has an ar/pt/ru translation", () => {
  const keys = [
    "Notify about new episodes",
    "Notify when a download finishes",
    "Notify about new badges",
    "Notify about friend requests",
    "{name} sent you a friend request",
    "Enable desktop notifications first",
    "Show OS notifications for episode reminders, downloads, badges, and friend requests",
    "Desktop notifications already play a sound for this. Turn them off for episodes in Settings to pick a tone here instead.",
    "{n} new badges",
    "{n} new friend requests",
  ];
  for (const src of [arSettings, ptSettings, ruSettings]) {
    for (const key of keys) {
      assert.ok(src.includes(`"${key}":`), `missing translation entry for ${JSON.stringify(key)}`);
    }
  }
});
