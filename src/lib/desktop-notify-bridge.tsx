import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useView } from "@/lib/view";
import { consumePendingNavTarget } from "@/lib/desktop-notify";
import { isWeb } from "@/lib/platform";
import { openNotificationCenter } from "@/lib/social/notification-open";

export function DesktopNotifyBridge() {
  const { setView, openMeta } = useView();

  useEffect(() => {
    if (isWeb()) return;
    let cancelled = false;
    let unlisten: (() => void) | undefined;

    getCurrentWindow()
      .onFocusChanged((event) => {
        if (!event.payload) return;
        const target = consumePendingNavTarget();
        if (!target) return;
        if (target.kind === "downloads") setView("downloads");
        else if (target.kind === "notifications") openNotificationCenter();
        else openMeta(target.meta);
      })
      .then((fn) => {
        if (cancelled) fn();
        else unlisten = fn;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [setView, openMeta]);

  return null;
}
