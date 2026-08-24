export function isLocalUrl(url: string): boolean {
  if (!url) return false;
  if (/^file:\/\//i.test(url)) return true;
  if (/^https?:\/\/asset\.localhost/i.test(url)) return true;
  if (/^asset:\/\/localhost/i.test(url)) return true;
  if (/^tauri:\/\/localhost/i.test(url)) return true;
  if (/^[a-z]:[\\/]/i.test(url)) return true;
  if (url.startsWith("\\\\")) return true;
  if (url.startsWith("/")) return true;
  if (/^[a-z][a-z0-9+.-]+:\/\//i.test(url)) return false;
  if (/^[a-z][a-z0-9+.-]+:[^\\/]/i.test(url)) return false;
  return !/^[a-z0-9+.-]+:/i.test(url);
}
