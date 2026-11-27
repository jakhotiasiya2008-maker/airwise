import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "@/lib/i18n/context";
import { GuidanceSectionView } from "@/components/GuidanceSectionView";
import { LocationSearch } from "@/components/LocationSearch";
import { GuidanceResponse } from "@/types/guidance";
import { DEFAULT_CITIES } from "@/lib/constants/cities";

describe("GuidanceSectionView & LocationSearch Component Tests", () => {
  const mockGuidance: GuidanceResponse = {
    sourceEngine: "rule-based",
    healthAdvisory: {
      severity: "severe",
      headline: "Critical Advisory",
      summary: "Severe particulate matter",
      disclaimer: "Informational only",
    },
    sections: {
      dailyRoutines: {
        id: "daily_routines",
        title: "Low-Emission Daily Routines",
        subtitle: "Schedules and commute",
        cards: [
          {
            id: "card-1",
            title: "Shift Exercise to Midday",
            action: "Avoid morning jogs",
            whyThisMatters: "Temperature inversion",
            expectedImpact: "Reduces exposure by 30%",
            urgency: "high",
            tags: ["Timing"],
          },
        ],
      },
      indoorAir: {
        id: "indoor_air",
        title: "Indoor Air Quality",
        subtitle: "Purifiers and sealing",
        cards: [
          {
            id: "card-2",
            title: "Run Bedroom Purifier",
            action: "Keep on medium speed",
            whyThisMatters: "Continuous CADR",
            expectedImpact: "Reduces PM2.5 by 70%",
            urgency: "high",
            tags: ["Purifier"],
          },
        ],
      },
      sustainableAlternatives: {
        id: "sustainable_alternatives",
        title: "Sustainable Alternatives",
        subtitle: "Collective habits",
        cards: [
          {
            id: "card-3",
            title: "Take Electric Metro",
            action: "Switch from private car",
            whyThisMatters: "Zero tailpipe emissions",
            expectedImpact: "Saves 2kg CO2",
            urgency: "medium",
            tags: ["Metro"],
          },
        ],
      },
    },
    generatedAtIst: "12:00 PM IST",
  };

  it("GuidanceSectionView renders tabs and toggles task completion", () => {
    render(
      <LanguageProvider>
        <GuidanceSectionView
          guidance={mockGuidance}
          aqi={320}
          category="Very Poor"
          profile={{
            hasYoungChildren: true,
            hasSeniors: false,
            hasStudents: false,
            isDailyCommuter: true,
            hasRespiratorySensitivity: false,
            commuteMode: "car",
            hasAirPurifier: true,
            hasIndoorPlants: false,
          }}
        />
      </LanguageProvider>
    );

    expect(screen.getByText("Smog Action Plan Progress")).toBeInTheDocument();
    expect(screen.getByText("0 of 3")).toBeInTheDocument();

    // Toggle card 1 done
    const doneButtons = screen.getAllByRole("button", { name: /Mark task .* as done/i });
    fireEvent.click(doneButtons[0]);

    expect(screen.getByText("1 of 3")).toBeInTheDocument();
  });

  it("GuidanceSectionView switches between category tabs", () => {
    render(
      <LanguageProvider>
        <GuidanceSectionView
          guidance={mockGuidance}
          aqi={320}
          category="Very Poor"
          profile={{
            hasYoungChildren: true,
            hasSeniors: false,
            hasStudents: false,
            isDailyCommuter: true,
            hasRespiratorySensitivity: false,
            commuteMode: "car",
            hasAirPurifier: true,
            hasIndoorPlants: false,
          }}
        />
      </LanguageProvider>
    );

    const indoorTab = screen.getByRole("tab", { name: /Indoor Air/i });
    fireEvent.click(indoorTab);

    expect(screen.getByText("Run Bedroom Purifier")).toBeInTheDocument();
  });

  it("LocationSearch renders quick-city chips and triggers onSelectCity", () => {
    const handleSelectCity = vi.fn();

    render(
      <LocationSearch
        currentCity={DEFAULT_CITIES[0]}
        onSelectCity={handleSelectCity}
        isLoading={false}
      />
    );

    const mumbaiChip = screen.getByRole("button", { name: "Mumbai" });
    fireEvent.click(mumbaiChip);

    expect(handleSelectCity).toHaveBeenCalledTimes(1);
    expect(handleSelectCity).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Mumbai" })
    );
  });
});
