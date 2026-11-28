import { CityLocation } from "@/types/air-quality";
import { DEFAULT_CITIES } from "@/lib/constants/cities";
import { APP_CONFIG } from "@/lib/constants/config";

export async function searchCitiesInIndia(query: string): Promise<CityLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return DEFAULT_CITIES.slice(0, 6);
  }

  // First search our instant local fallback list for fast match
  const localMatches = DEFAULT_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(trimmed.toLowerCase()) ||
      (city.state && city.state.toLowerCase().includes(trimmed.toLowerCase()))
  );

  try {
    const url = new URL(APP_CONFIG.endpoints.openMeteoGeocoding);
    url.searchParams.set("name", trimmed);
    url.searchParams.set("count", "10");
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");
    url.searchParams.set("country_code", "IN");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), APP_CONFIG.defaults.timeoutMs.geocoding);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return localMatches.length > 0 ? localMatches : DEFAULT_CITIES.slice(0, 5);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return localMatches.length > 0 ? localMatches : [];
    }

    // Filter to India results only (hard rule check)
    interface ApiResult {
      id: number;
      name: string;
      admin1?: string;
      country?: string;
      country_code?: string;
      latitude: number;
      longitude: number;
    }

    const apiResults: CityLocation[] = (data.results as ApiResult[])
      .filter(
        (item) =>
          (item.country_code || "").toUpperCase() === "IN" ||
          (item.country || "").toLowerCase() === "india"
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        state: item.admin1 || "India",
        country: "India",
        latitude: item.latitude,
        longitude: item.longitude,
      }));

    // Deduplicate against local matches
    const combined = [...apiResults];
    for (const local of localMatches) {
      if (!combined.some((c) => c.name.toLowerCase() === local.name.toLowerCase())) {
        combined.unshift(local);
      }
    }

    return combined.slice(0, 8);
  } catch {
    return localMatches.length > 0 ? localMatches : DEFAULT_CITIES.slice(0, 5);
  }
}
