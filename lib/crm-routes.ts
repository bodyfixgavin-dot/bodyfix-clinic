export type QueryValue = string | string[] | undefined;

/** Maps a legacy CRM bookmark to its canonical route without interpreting IDs. */
export function legacyClinicDestination(path: string[] = [], query: Record<string, QueryValue> = {}) {
  const suffix = path.length ? `/${path.map(encodeURIComponent).join("/")}` : "";
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else if (value !== undefined) params.set(key, value);
  }

  const serialized = params.toString();
  return `/admin/crm${suffix}${serialized ? `?${serialized}` : ""}`;
}
