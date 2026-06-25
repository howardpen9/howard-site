export function formatDate(iso: string): string {
  // Parse as UTC to keep SSR/CSR consistent regardless of server timezone.
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
