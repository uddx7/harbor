import { readDesktopNotifySettings, sendDesktopNotification } from "@/lib/desktop-notify";
import { t } from "@/lib/i18n";
import type { CenterNotif } from "./notifications";
import type { PendingRequest } from "./friends";

const SEEN_KEY = "harbor.social.notifySeen.v1";

type SeenState = { badges: string[]; friendRequests: string[]; initialized: boolean };

const EMPTY_SEEN: SeenState = { badges: [], friendRequests: [], initialized: false };

function readSeen(): SeenState {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return EMPTY_SEEN;
    const parsed = JSON.parse(raw) as Partial<SeenState>;
    return {
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      friendRequests: Array.isArray(parsed.friendRequests) ? parsed.friendRequests : [],
      initialized: parsed.initialized === true,
    };
  } catch {
    return EMPTY_SEEN;
  }
}

function writeSeen(state: SeenState): void {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/**
 * Above this many new items in one pass, collapse them into a single summary
 * notification instead of firing one OS toast per item — bounds how many
 * notifications a single poll cycle can burst (e.g. after being offline a
 * while, or an unexpectedly large batch from the backend).
 */
const BURST_THRESHOLD = 3;

/**
 * Diffs the notification-center's latest badges and friend requests against
 * what we've already notified about, and fires desktop notifications for
 * anything new. On the very first call (no seen-state persisted yet) it
 * only records a baseline — it never bursts a notification per pre-existing
 * item the first time this runs after the feature ships.
 */
export function notifyNewSocialActivity(items: CenterNotif[], pending: PendingRequest[]): void {
  const badgeIds = items.filter((n) => n.kind === "badge-received").map((n) => n.id);
  const requestIds = pending.map((r) => r.edgeId);
  const seen = readSeen();

  if (!seen.initialized) {
    writeSeen({ badges: badgeIds, friendRequests: requestIds, initialized: true });
    return;
  }

  const settings = readDesktopNotifySettings();
  const seenBadges = new Set(seen.badges);
  const seenRequests = new Set(seen.friendRequests);

  if (settings.notifyNewBadges) {
    const newBadges = items.filter((n) => n.kind === "badge-received" && !seenBadges.has(n.id));
    if (newBadges.length > BURST_THRESHOLD) {
      void sendDesktopNotification({
        title: t("{n} new badges", { n: newBadges.length }),
        body: "",
        navTarget: { kind: "notifications" },
      });
    } else {
      for (const n of newBadges) {
        void sendDesktopNotification({
          title: n.title,
          body: n.body ?? "",
          navTarget: { kind: "notifications" },
        });
      }
    }
  }

  if (settings.notifyFriendRequests) {
    const newRequests = pending.filter((r) => !seenRequests.has(r.edgeId));
    if (newRequests.length > BURST_THRESHOLD) {
      void sendDesktopNotification({
        title: t("{n} new friend requests", { n: newRequests.length }),
        body: "",
        navTarget: { kind: "notifications" },
      });
    } else {
      for (const r of newRequests) {
        void sendDesktopNotification({
          title: t("{name} sent you a friend request", { name: r.from.alias || r.from.handle }),
          body: "",
          navTarget: { kind: "notifications" },
        });
      }
    }
  }

  writeSeen({ badges: badgeIds, friendRequests: requestIds, initialized: true });
}
