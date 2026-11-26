import { CpcbCategory } from "@/types/air-quality";
import { HouseholdProfile } from "@/types/profile";
import { GuidanceCard, GuidanceResponse, HealthAdvisory, UrgencyLevel } from "@/types/guidance";

export interface RuleEngineInput {
  aqi: number;
  pm25: number;
  pm10: number;
  category: CpcbCategory;
  city: string;
  source: string;
  timestampIst: string;
  profile: HouseholdProfile;
}

export function generateRuleBasedGuidance(input: RuleEngineInput): GuidanceResponse {
  const { aqi, pm25, category, city, profile, timestampIst } = input;
  const isSevereOrVeryPoor = category === "Severe" || category === "Very Poor";
  const isPoorOrWorse = isSevereOrVeryPoor || category === "Poor";
  const hasVulnerableMembers =
    profile.hasYoungChildren || profile.hasSeniors || profile.hasRespiratorySensitivity;

  // 1. Health Advisory
  const healthAdvisory = buildHealthAdvisory(category, aqi, pm25, profile, hasVulnerableMembers);

  // 2. Daily Routines Cards
  const dailyRoutinesCards = buildDailyRoutinesCards(category, isPoorOrWorse, profile);

  // 3. Indoor Air Cards
  const indoorAirCards = buildIndoorAirCards(category, isPoorOrWorse, profile);

  // 4. Sustainable Alternatives Cards
  const sustainableCards = buildSustainableAlternativesCards(category, profile);

  return {
    sourceEngine: "rule-based",
    healthAdvisory,
    sections: {
      dailyRoutines: {
        id: "daily_routines",
        title: "Low-Emission Daily Routines",
        subtitle: `Optimized schedules and commute safety for ${city} based on current ${category} air quality.`,
        cards: dailyRoutinesCards,
      },
      indoorAir: {
        id: "indoor_air",
        title: "Indoor Air Quality & Purification",
        subtitle: "Science-backed indoor protection, purifier guidelines, and source emission control.",
        cards: indoorAirCards,
      },
      sustainableAlternatives: {
        id: "sustainable_alternatives",
        title: "Sustainable Community Alternatives",
        subtitle: "Collective actions to lower local neighborhood emissions during pollution spikes.",
        cards: sustainableCards,
      },
    },
    generatedAtIst: timestampIst || `${new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST`,
  };
}

function buildHealthAdvisory(
  category: CpcbCategory,
  aqi: number,
  pm25: number,
  profile: HouseholdProfile,
  hasVulnerableMembers: boolean
): HealthAdvisory {
  const disclaimer =
    "Informational guidance only. Not medical advice. Consult a certified medical practitioner for clinical symptoms or asthma action plans.";

  if (category === "Severe" || category === "Very Poor") {
    let headline = `Severe Air Quality Alert (AQI ${aqi})`;
    let summary = `Fine particulate PM2.5 is at ${pm25} µg/m³. At this concentration, prolonged outdoor breathing can trigger respiratory irritation, coughing, and cardiovascular strain even in healthy individuals.`;
    let sensitiveGroupWarning: string | undefined;

    if (hasVulnerableMembers) {
      headline = `Critical Protection Advisory for Vulnerable Members`;
      sensitiveGroupWarning =
        "Your household includes young children, seniors, or respiratory-sensitive members. Inhalation of PM2.5 at this level deposits deep in pulmonary alveoli. Strictly suspend outdoor playtime, morning walks, and unmasked transit.";
    }

    return {
      severity: "severe",
      headline,
      summary,
      sensitiveGroupWarning,
      disclaimer,
    };
  }

  if (category === "Poor") {
    let headline = `Poor Air Quality: Precautionary Measures Recommended`;
    let summary = `AQI is ${aqi} with PM2.5 at ${pm25} µg/m³. Healthy individuals may experience throat dryness and breathing discomfort on extended exertion.`;
    let sensitiveGroupWarning: string | undefined;

    if (hasVulnerableMembers) {
      sensitiveGroupWarning =
        "Children's higher respiration rate per kg and seniors' reduced lung capacity elevate risk. Limit outdoor exposure during early morning hours.";
    }

    return {
      severity: "high",
      headline,
      summary,
      sensitiveGroupWarning,
      disclaimer,
    };
  }

  if (category === "Moderate") {
    return {
      severity: "moderate",
      headline: `Moderate Air Quality: Sensitive Groups Take Note`,
      summary: `AQI is currently ${aqi}. General population can continue normal routines, but people with asthma or lung ailments may notice mild respiratory irritation.`,
      sensitiveGroupWarning: profile.hasRespiratorySensitivity
        ? "Keep prescribed quick-relief inhalers accessible during transit."
        : undefined,
      disclaimer,
    };
  }

  return {
    severity: "mild",
    headline: `Acceptable Air Quality (${category})`,
    summary: `Current AQI (${aqi}) is within acceptable thresholds. Great time for outdoor exercise and airing out indoor living spaces.`,
    disclaimer,
  };
}

function buildDailyRoutinesCards(
  category: CpcbCategory,
  isPoorOrWorse: boolean,
  profile: HouseholdProfile
): GuidanceCard[] {
  const cards: GuidanceCard[] = [];

  // Card 1: Outdoor Timing & Temperature Inversion
  if (isPoorOrWorse) {
    cards.push({
      id: "routine-timing-inversion",
      title: "Shift Outdoor Activities to Midday (12 PM - 4 PM)",
      action:
        "Avoid early morning (5 AM - 9 AM) and late evening walks or outdoor runs. Reschedule essential outdoor chores to early afternoon.",
      whyThisMatters:
        "Ground-level nocturnal temperature inversions trap vehicular and biomass emissions close to the surface until solar heating warms the earth and disperses the boundary layer.",
      expectedImpact:
        "Avoids peak diurnal particulate concentrations, reducing direct respiratory exposure by up to 30-40%.",
      urgency: "high" as UrgencyLevel,
      tags: ["Timing", "Inversion", "Routines"],
    });
  } else {
    cards.push({
      id: "routine-timing-normal",
      title: "Optimal Outdoor Exercise Window",
      action:
        "Plan jogs, cycles, and children's outdoor sports between 7 AM and 5 PM when atmospheric dispersion is favorable.",
      whyThisMatters:
        "Moderate ambient air allows cardiovascular activity without acute oxidative lung stress.",
      expectedImpact:
        "Supports cardiovascular health while minimizing unnecessary pollutant intake.",
      urgency: "low" as UrgencyLevel,
      tags: ["Fitness", "Timing"],
    });
  }

  // Card 2: Commute Mode Protection
  if (profile.commuteMode === "bike") {
    cards.push({
      id: "routine-commute-bike",
      title: "Two-Wheeler Commute: N95 Respirator with Seal Check",
      action:
        "Wear an ISI-certified N95/FFP2 respirator snug around nose bridge and chin. Keep visor down and avoid drafting closely behind heavy commercial trucks.",
      whyThisMatters:
        "Two-wheeler riders directly inhale concentrated tailpipe emissions and resuspended road dust without cabin filtration.",
      expectedImpact:
        "Certified N95 filtration blocks at least 95% of airborne particles down to 0.3 microns when tightly fitted.",
      urgency: isPoorOrWorse ? ("critical" as UrgencyLevel) : ("medium" as UrgencyLevel),
      tags: ["Commute", "Respirator", "Two-Wheeler"],
    });
  } else if (profile.commuteMode === "car") {
    cards.push({
      id: "routine-commute-car",
      title: "Cabin Air Recirculation & Carpooling",
      action:
        "Switch vehicle HVAC to 'Air Recirculation' mode rather than pulling fresh outside air. Offer carpool seats to colleagues on the same corridor.",
      whyThisMatters:
        "Recirculation forces air through the cabin pollen/dust filter repeatedly rather than drawing in highway exhaust plumes.",
      expectedImpact:
        "Lowers in-cabin PM2.5 levels by roughly 50-70% and cuts solo vehicular trips.",
      urgency: isPoorOrWorse ? ("high" as UrgencyLevel) : ("low" as UrgencyLevel),
      tags: ["Commute", "Vehicle HVAC"],
    });
  } else if (profile.commuteMode === "metro" || profile.commuteMode === "bus") {
    cards.push({
      id: "routine-commute-transit",
      title: "Public Transit: Station Transition Protection",
      action:
        "Keep mask donned during walk from metro/bus stop to office. Choose subterranean or sheltered platforms over crowded open-air bus queues where diesel idling occurs.",
      whyThisMatters:
        "Micro-environments near bus depots and traffic junctions have high short-term ultrafine particle spikes.",
      expectedImpact:
        "Substantially reduces transit-related carbon footprint compared to private motorized vehicles.",
      urgency: "medium" as UrgencyLevel,
      tags: ["Public Transit", "Commute"],
    });
  } else {
    cards.push({
      id: "routine-commute-wfh-walk",
      title: "Combine Errands & Consolidate Local Trips",
      action:
        "Group grocery runs, pharmacy visits, and school pick-ups into a single consolidated trip instead of multiple fragmented outings.",
      whyThisMatters:
        "Cold vehicle starts produce higher emissions per kilometer; minimizing trips reduces outdoor time and neighborhood pollution.",
      expectedImpact:
        "Reduces personal exposure time and avoids unnecessary cold-start vehicle emissions.",
      urgency: "medium" as UrgencyLevel,
      tags: ["Trip Chaining", "Errands"],
    });
  }

  // Card 3: Vulnerable Members / School & Elderly Protection
  if (profile.hasYoungChildren || profile.hasSeniors) {
    cards.push({
      id: "routine-vulnerable-care",
      title: profile.hasYoungChildren
        ? "Child Safe Routine: Shift Play Indoors"
        : "Senior Wellness: Indoor Gentle Movement",
      action: profile.hasYoungChildren
        ? "Request school administrators to hold physical education and recess indoors. Replace evening playground time with indoor board games or creative crafts."
        : "Replace early morning park walks with indoor stretching, yoga, or corridor strolls in well-filtered rooms.",
      whyThisMatters: profile.hasYoungChildren
        ? "Children breathe up to 50% more air per pound of body weight than adults, and their developing lungs are more vulnerable to particulate damage."
        : "Elderly airways have diminished mucociliary clearance, rendering them more prone to smog-induced cardiac and respiratory complications.",
      expectedImpact:
        "Significantly decreases acute bronchial inflammation, wheezing episodes, and sudden asthma exacerbations.",
      urgency: isPoorOrWorse ? ("critical" as UrgencyLevel) : ("medium" as UrgencyLevel),
      tags: ["Family Care", "Vulnerable Groups"],
    });
  } else {
    cards.push({
      id: "routine-hydration-diet",
      title: "Hydration & Airway Mucosal Support",
      action:
        "Maintain adequate fluid intake (warm water, herbal teas with ginger and tulsi), and practice saline nasal rinses after returning from outdoors.",
      whyThisMatters:
        "Particulate matter dries mucous membranes; hydration preserves the natural ciliary barrier that traps and expels inhaled pollutants.",
      expectedImpact:
        "Helps clear upper respiratory tract of trapped dust and soothes dry throat discomfort.",
      urgency: "low" as UrgencyLevel,
      tags: ["Wellness", "Airway Care"],
    });
  }

  return cards;
}

function buildIndoorAirCards(
  category: CpcbCategory,
  isPoorOrWorse: boolean,
  profile: HouseholdProfile
): GuidanceCard[] {
  const cards: GuidanceCard[] = [];

  // Card 1: Air Purifier Operation & CADR
  if (profile.hasAirPurifier) {
    cards.push({
      id: "indoor-purifier-cadr",
      title: "Air Purifier Placement: Bedroom Focus & Continuous Run",
      action:
        "Position the purifier at least 1-2 feet away from walls in the room where you sleep. Keep on medium/high speed 1 hour before bedtime, then switch to quiet mode.",
      whyThisMatters:
        "You spend 7-8 consecutive hours sleeping; uninterrupted clean air in the bedroom allows respiratory cilia to recover from daytime exposure.",
      expectedImpact:
        "Reduces indoor PM2.5 concentrations by up to 70-85% in closed rooms matching the unit's Clean Air Delivery Rate (CADR).",
      urgency: isPoorOrWorse ? ("high" as UrgencyLevel) : ("medium" as UrgencyLevel),
      tags: ["Air Purifier", "CADR", "Sleep"],
    });

    cards.push({
      id: "indoor-filter-maintenance",
      title: "Purifier Pre-Filter Maintenance",
      action:
        "Vacuum or wash only the mesh pre-filter every 2-3 weeks. Do not wash the true HEPA filter with water; gently tap or replace as per sensor indicator.",
      whyThisMatters:
        "A dust-caked pre-filter chokes airflow, cutting CADR efficiency and straining the motor without capturing micro-particles.",
      expectedImpact:
        "Restores optimal airflow and extends the lifespan of expensive True HEPA filtration media.",
      urgency: "medium" as UrgencyLevel,
      tags: ["Maintenance", "HEPA"],
    });
  } else {
    cards.push({
      id: "indoor-diy-sealing",
      title: "Sealing Leaks: Low-Cost Infiltration Control",
      action:
        "Roll damp towels or apply self-adhesive foam weatherstrips at door thresholds and loose window panes. Keep exhaust fans covered when not in use.",
      whyThisMatters:
        "Outdoor air continuously infiltrates through building envelope gaps, bringing smog into living quarters even with closed windows.",
      expectedImpact:
        "Can reduce passive outdoor PM2.5 infiltration into living spaces by 20-35% without expensive equipment.",
      urgency: isPoorOrWorse ? ("high" as UrgencyLevel) : ("medium" as UrgencyLevel),
      tags: ["DIY Protection", "Draft Sealing"],
    });
  }

  // Card 2: Indoor Pollution Sources (Incense, Mosquito Coils, Cooking)
  cards.push({
    id: "indoor-sources-combustion",
    title: "Eliminate Indoor Combustion: Agarbatti, Dhoop & Mosquito Coils",
    action:
      "Avoid burning incense sticks (agarbatti), dhoop, camphor, or mosquito coils inside closed rooms. Use electric vaporizers or fine mosquito nets instead.",
    whyThisMatters:
      "Burning a single mosquito coil can release particulate matter equivalent to 75-100 cigarettes, drastically spiking indoor PM2.5 and polycyclic aromatic hydrocarbons.",
    expectedImpact:
      "Directly prevents severe indoor pollution spikes that can reach 400+ µg/m³ inside an otherwise closed room.",
    urgency: "critical" as UrgencyLevel,
    tags: ["Indoor Sources", "Zero Combustion"],
  });

  // Card 3: Indoor Plants Reality Check (Honest, not overhyped)
  if (profile.hasIndoorPlants) {
    cards.push({
      id: "indoor-plants-reality",
      title: "Indoor Plants: Wellness Benefits vs. Particle Reality",
      action:
        "Keep your snake plants and areca palms for humidity and psychological wellness, but do NOT rely on them to scrub PM2.5 or replace mechanical filtration.",
      whyThisMatters:
        "The popular NASA clean air study evaluated VOC removal in tiny hermetic chambers. In real homes with air changes, plants have negligible impact on microscopic particulates (PM2.5).",
      expectedImpact:
        "Provides realistic expectations: prevents false sense of security while maintaining beneficial biophilic stress reduction.",
      urgency: "low" as UrgencyLevel,
      tags: ["Indoor Plants", "Science Fact", "NASA Study"],
    });
  } else {
    cards.push({
      id: "indoor-wet-mopping",
      title: "Wet Mopping Instead of Dry Broom Sweeping",
      action:
        "Instruct domestic staff to wet-mop floors with microfiber cloths instead of traditional dry sweeping (jhadu).",
      whyThisMatters:
        "Dry brooms vigorously resuspend settled coarse and fine particulate matter back into the air breathing zone for hours.",
      expectedImpact:
        "Suppresses settled dust resuspension, lowering indoor coarse PM10 levels by 40-50%.",
      urgency: "medium" as UrgencyLevel,
      tags: ["Cleaning", "Dust Control"],
    });
  }

  return cards;
}

function buildSustainableAlternativesCards(
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
