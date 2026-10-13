export type StoreSettingsRecord = {
  id: string;
  isOpen: boolean;
  message: string | null;
  autoSchedule: boolean;
  openTime: string | null;
  closeTime: string | null;
  updatedAt: Date;
};

export function effectiveStore(settings: StoreSettingsRecord) {
  if (!settings.autoSchedule || !settings.openTime || !settings.closeTime) {
    return settings.isOpen;
  }
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const current = `${hh}:${mm}`;
  const open = settings.openTime;
  const close = settings.closeTime;
  // supports ranges crossing midnight? simple lexical compare if open<close
  if (open < close) {
    return current >= open && current <= close && settings.isOpen;
  }
  // overnight
  return (current >= open || current <= close) && settings.isOpen;
}

export function settingsWithEffective(s: StoreSettingsRecord) {
  return { ...s, effectiveOpen: effectiveStore(s) };
}