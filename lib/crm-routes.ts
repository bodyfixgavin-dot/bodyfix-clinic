export type QueryValue = string | string[] | undefined;

function encodePathSegment(segment: string) {
  try {
    return encodeURIComponent(decodeURIComponent(segment));
  } catch {
    return encodeURIComponent(segment);
  }
}

export function destinationWithQuery(destination: string, query: Record<string, QueryValue> = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else if (value !== undefined) params.set(key, value);
  }
  const serialized = params.toString();
  return `${destination}${serialized ? `?${serialized}` : ""}`;
}

/** Maps a legacy CRM bookmark to its canonical route without interpreting IDs. */
export function legacyClinicDestination(path: string[] = [], query: Record<string, QueryValue> = {}) {
  const suffix = path.length ? `/${path.map(encodePathSegment).join("/")}` : "";
  return destinationWithQuery(`/admin/crm${suffix}`, query);
}

export function legacyPulseDestination(path: string[] = [], query: Record<string, QueryValue> = {}) {
  const suffix = path.length ? `/${path.map(encodePathSegment).join("/")}` : "";
  return destinationWithQuery(`/admin/crm/pulse${suffix}`, query);
}
