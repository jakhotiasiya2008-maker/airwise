import { CpcbCategory, CpcbCategoryInfo } from "@/types/air-quality";
import { Breakpoint, CPCB_CATEGORY_INFOS, PM10_BREAKPOINTS, PM25_BREAKPOINTS } from "./breakpoints";

export { PM25_BREAKPOINTS, PM10_BREAKPOINTS, CPCB_CATEGORY_INFOS };
export type { Breakpoint };

/**
 * Calculates pollutant sub-index based on standard CPCB piecewise linear formula:
 * I = I_low + [(I_high - I_low) / (C_high - C_low)] * (C - C_low)
 */
function calculateSubIndex(concentration: number, breakpoints: Breakpoint[]): number {
  if (concentration < 0) return 0;

  for (const bp of breakpoints) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      const index =
        bp.iLow + ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow);
      return Math.round(index);
    }
  }

  const last = breakpoints[breakpoints.length - 1];
  if (concentration > last.cHigh) {
    const factor = (last.iHigh - last.iLow) / (last.cHigh - last.cLow);
    const extrapolated = last.iHigh + factor * (concentration - last.cHigh);
    return Math.min(500, Math.round(extrapolated));
  }

  return 0;
}

/**
 * Calculates national CPCB AQI from 24h average PM2.5 and PM10 concentrations.
 */
export function calculateCpcbAqi(
  pm25: number,
  pm10: number
): {
  aqi: number;
  pm25SubIndex: number;
  pm10SubIndex: number;
  category: CpcbCategory;
} {
  const pm25SubIndex = calculateSubIndex(pm25, PM25_BREAKPOINTS);
  const pm10SubIndex = calculateSubIndex(pm10, PM10_BREAKPOINTS);
  const aqi = Math.max(pm25SubIndex, pm10SubIndex);
  const category = getCpcbCategory(aqi);

  return {
    aqi,
    pm25SubIndex,
    pm10SubIndex,
    category,
  };
}

/**
 * Maps an AQI numeric index to its official CPCB Category.
 */
export function getCpcbCategory(aqi: number): CpcbCategory {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

/**
 * Returns metadata and presentation styling for a given CPCB category.
 */
export function getCpcbCategoryInfo(category: CpcbCategory): CpcbCategoryInfo {
  return CPCB_CATEGORY_INFOS[category] || CPCB_CATEGORY_INFOS["Severe"];
}
