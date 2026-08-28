import type { Meta } from "@/lib/cinemeta";
import { isWeb } from "@/lib/platform";

export type DesktopNavTarget =
  | { kind: "downloads" }
  | { kind: "notifications" }
  | { kind: "meta"; meta: Meta };

type DesktopNotifySettings = {
  desktopNotificationsEnabled: boolean;
  notifyNewEpisodes: boolean;
  notifyDownloadsComplete: boolean;
  notifyNewBadges: boolean;
  notifyFriendRequests: boolean;
};

const DEFAULTS: DesktopNotifySettings = {
  desktopNotificationsEnabled: true,
  notifyNewEpisodes: true,
  notifyDownloadsComplete: true,
  notifyNewBadges: true,
  notifyFriendRequests: true,
};

export function readDesktopNotifySettings(): DesktopNotifySettings {
  try {
    const raw = localStorage.getItem("harbor.settings");
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<DesktopNotifySettings>;
    return {
      desktopNotificationsEnabled:
        parsed.desktopNotificationsEnabled ?? DEFAULTS.desktopNotificationsEnabled,
      notifyNewEpisodes: parsed.notifyNewEpisodes ?? DEFAULTS.notifyNewEpisodes,
      notifyDownloadsComplete: parsed.notifyDownloadsComplete ?? DEFAULTS.notifyDownloadsComplete,
      notifyNewBadges: parsed.notifyNewBadges ?? DEFAULTS.notifyNewBadges,
      notifyFriendRequests: parsed.notifyFriendRequests ?? DEFAULTS.notifyFriendRequests,
    };
  } catch {
    return DEFAULTS;
  }
}

const PENDING_NAV_TTL_MS = 2 * 60 * 1000;

const pendingNavTargets: { target: DesktopNavTarget; at: number }[] = [];

export function setPendingNavTarget(target: DesktopNavTarget): void {
  pendingNavTargets.push({ target, at: Date.now() });
}

export function consumePendingNavTarget(): DesktopNavTarget | null {
  while (pendingNavTargets.length > 0) {
    const entry = pendingNavTargets.shift()!;
    if (Date.now() - entry.at <= PENDING_NAV_TTL_MS) return entry.target;
  }
  return null;
}

export async function ensureDesktopNotifyPermission(): Promise<boolean> {
  if (!readDesktopNotifySettings().desktopNotificationsEnabled) return false;
  if (isWeb()) {
    try {
      if (!("Notification" in window)) return false;
      if (Notification.permission === "granted") return true;
      if (Notification.permission === "denied") return false;
      return (await Notification.requestPermission()) === "granted";
    } catch {
      return false;
    }
  }
  try {
    const { isPermissionGranted, requestPermission } = await import(
      "@tauri-apps/plugin-notification"
    );
    if (await isPermissionGranted()) return true;
    return (await requestPermission()) === "granted";
  } catch {
    return false;
  }
}

export async function sendDesktopNotification(opts: {
  title: string;
  body: string;
  navTarget?: DesktopNavTarget;
}): Promise<boolean> {
  if (!(await ensureDesktopNotifyPermission())) return false;
  if (isWeb()) {
    try {
      new Notification(opts.title, { body: opts.body, silent: true });
      if (opts.navTarget) setPendingNavTarget(opts.navTarget);
    } catch {}
    return false;
  }
  try {
    const { sendNotification } = await import("@tauri-apps/plugin-notification");
    if (opts.navTarget) setPendingNavTarget(opts.navTarget);
    sendNotification({ title: opts.title, body: opts.body });
    return true;
  } catch {
    return false;
  }
}
