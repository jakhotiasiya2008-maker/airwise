import { CpcbCategory } from "@/types/air-quality";
import { HouseholdProfile } from "@/types/profile";
import { GuidanceCard, UrgencyLevel } from "@/types/guidance";

/**
 * Generates low-emission daily routines guidance cards considering commute mode,
 * outdoor exercise timing, temperature inversions, and vulnerable dependents.
 */
export function buildDailyRoutinesCards(
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
