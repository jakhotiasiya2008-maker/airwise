import { CpcbCategory } from "@/types/air-quality";
import { HouseholdProfile } from "@/types/profile";
import { GuidanceCard, UrgencyLevel } from "@/types/guidance";

/**
 * Generates indoor air quality guidance cards focusing on air purifier CADR,
 * pre-filter maintenance, leak sealing, combustion elimination, and realistic plant effects.
 */
export function buildIndoorAirCards(
  category: CpcbCategory,
  isPoorOrWorse: boolean,
  profile: HouseholdProfile
): GuidanceCard[] {
  const cards: GuidanceCard[] = [];

  // Card 1: Air Purifier Operation & CADR / DIY Infiltration Control
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
