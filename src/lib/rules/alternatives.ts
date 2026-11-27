import { CpcbCategory } from "@/types/air-quality";
import { HouseholdProfile } from "@/types/profile";
import { GuidanceCard, UrgencyLevel } from "@/types/guidance";

/**
 * Generates community-scale sustainable alternatives and emission reduction guidance,
 * encouraging civic reporting of fires, public transit shift, and peak grid load reduction.
 */
export function buildSustainableAlternativesCards(
  category: CpcbCategory,
  profile: HouseholdProfile
): GuidanceCard[] {
  const cards: GuidanceCard[] = [];

  // Card 1: Public transit / Active mobility shift
  cards.push({
    id: "sust-transit-mode-shift",
    title: "Shift to Electric Metro or Multi-Modal Public Transit",
    action:
      profile.commuteMode === "metro"
        ? "Continue prioritizing metro rail and encourage neighborhood car-commuters to join your metro route."
        : "Replace at least 2 private car or two-wheeler trips per week with Metro or AC CNG/Electric bus lines.",
    whyThisMatters:
      "Urban transport accounts for 20-35% of PM2.5 in Indian metro regions. Electric metro emits zero tailpipe emissions along transit corridors.",
    expectedImpact:
      "A single metro trip saves approximately 1.5 to 2.5 kg of CO2 and prevents tens of grams of toxic NOx and soot from entering urban air.",
    urgency: "medium" as UrgencyLevel,
    tags: ["Public Transit", "Decarbonization"],
  });

  // Card 2: Zero Waste & Leaf Burning Alert
  cards.push({
    id: "sust-zero-burning-civic",
    title: "Community Watch: Report Open Leaf & Waste Burning",
    action:
      "Never burn dry garden leaves, garbage, or plastics. Use municipal apps (like Delhi's Green Delhi app or local Swachhata apps) to report local open fires.",
    whyThisMatters:
      "Low-temperature open biomass and plastic burning generates high levels of carcinogenic dioxins, black carbon, and dense local smoke clouds.",
    expectedImpact:
      "Diverting green waste to composting preserves urban topsoil while eliminating dangerous localized ground-level toxic smoke.",
    urgency: "high" as UrgencyLevel,
    tags: ["Civic Action", "Waste Management"],
  });

  // Card 3: Energy Conservation to Reduce Grid Peaking
  cards.push({
    id: "sust-energy-efficiency",
    title: "Reduce Peak Electricity Load during Winter Inversion",
    action:
      "Turn off geysers and heavy appliances promptly; set water heaters to 50°C instead of maximum 70°C.",
    whyThisMatters:
      "Peak morning electricity in northern and eastern grids relies on regional coal-fired thermal power plants that contribute to regional sulfate and particulate haze.",
    expectedImpact:
      "Cuts domestic power bills and reduces upstream regional industrial thermal emissions during peak winter smog periods.",
    urgency: "low" as UrgencyLevel,
    tags: ["Energy Conservation", "Grid Impact"],
  });

  return cards;
}
