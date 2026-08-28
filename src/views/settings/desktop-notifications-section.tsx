import { useT } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { ToggleRow } from "@/views/settings/shared";

export function DesktopNotificationsSection() {
  const t = useT();
  const { settings, update } = useSettings();
  const locked = !settings.desktopNotificationsEnabled;
  const lockReason = locked ? t("Enable desktop notifications first") : undefined;

  return (
    <div className="flex flex-col gap-3">
      <ToggleRow
        label={t("Desktop notifications")}
        note={t("Show OS notifications for episode reminders, downloads, badges, and friend requests")}
        value={settings.desktopNotificationsEnabled}
        onChange={(v) => update({ desktopNotificationsEnabled: v })}
      />
      <ToggleRow
        label={t("Notify about new episodes")}
        value={settings.notifyNewEpisodes}
        onChange={(v) => update({ notifyNewEpisodes: v })}
        lockReason={lockReason}
      />
      <ToggleRow
        label={t("Notify when a download finishes")}
        value={settings.notifyDownloadsComplete}
        onChange={(v) => update({ notifyDownloadsComplete: v })}
        lockReason={lockReason}
      />
      <ToggleRow
        label={t("Notify about new badges")}
        value={settings.notifyNewBadges}
        onChange={(v) => update({ notifyNewBadges: v })}
        lockReason={lockReason}
      />
      <ToggleRow
        label={t("Notify about friend requests")}
        value={settings.notifyFriendRequests}
        onChange={(v) => update({ notifyFriendRequests: v })}
        lockReason={lockReason}
      />
    </div>
  );
}
