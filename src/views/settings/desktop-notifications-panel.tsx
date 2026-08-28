import { useT } from "@/lib/i18n";
import { DesktopNotificationsSection } from "./desktop-notifications-section";
import { Section } from "./shared";

export function DesktopNotificationsPanel() {
  const t = useT();
  return (
    <Section
      title={t("Desktop notifications")}
      subtitle={t(
        "Native OS notifications when a reminder fires or a download finishes. Clicking one opens Harbor to the right place.",
      )}
    >
      <DesktopNotificationsSection />
    </Section>
  );
}
