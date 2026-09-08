export const getClientTimeZone = (): string | null => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return typeof timeZone === 'string' && timeZone.length > 0 ? timeZone : null;
};
