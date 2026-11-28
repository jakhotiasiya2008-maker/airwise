import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import axe from "axe-core";
import { AirQualityHero } from "@/components/AirQualityHero";
import { Header } from "@/components/Header";
import { HealthAdvisoryBanner } from "@/components/HealthAdvisoryBanner";
import { AirQualityRadialGauge } from "@/components/AirQualityRadialGauge";
import { LanguageProvider } from "@/lib/i18n/context";
import { AirQualityReading } from "@/types/air-quality";
import { HealthAdvisory } from "@/types/guidance";

describe("Accessibility (WCAG 2.2 AA) Compliance Tests", () => {
  const mockReading: AirQualityReading = {
    aqi: 312,
    cpcbCategory: "Very Poor",
    pm25: 185.5,
    pm10: 310.2,
    usAqi: 240,
    source: "Open-Meteo CAMS Model",
    stationOrLocation: "Delhi (NCR)",
    latitude: 28.6139,
    longitude: 77.209,
    timestampUtc: "2026-11-26T18:30:00Z",
    timestampIst: "27 Nov 2026, 12:00 AM IST",
    isModelled: true,
  };

  const mockAdvisory: HealthAdvisory = {
    severity: "severe",
    headline: "Severe Air Quality Alert (AQI 312)",
    summary: "Fine particulate PM2.5 is high; avoid prolonged outdoor exertion.",
    sensitiveGroupWarning: "Young children and seniors should stay in filtered indoor spaces.",
    disclaimer:
      "Informational guidance only. Not medical advice. Consult a healthcare professional.",
  };

  it("Header satisfies axe accessibility rules", async () => {
    const { container } = render(
      <LanguageProvider>
        <Header
          onOpenProfile={() => {}}
          onOpenCommandPalette={() => {}}
          engine="rule-based"
          activePersonaName="Vulnerable Family"
          isDark={false}
          onToggleTheme={() => {}}
        />
      </LanguageProvider>
    );

    const results = await axe.run(container);
    const violations = results.violations.filter((v) => v.id !== "region");
    expect(violations).toHaveLength(0);
  });

  it("AirQualityRadialGauge meter role satisfies axe rules", async () => {
    const { container } = render(<AirQualityRadialGauge aqi={312} category="Very Poor" />);

    const results = await axe.run(container);
    const violations = results.violations.filter((v) => v.id !== "region");
    expect(violations).toHaveLength(0);
  });

  it("AirQualityHero satisfies axe accessibility rules in dark mode", async () => {
    const { container } = render(
      <LanguageProvider>
        <div className="dark">
          <AirQualityHero reading={mockReading} selectedCityName="Delhi (NCR)" />
        </div>
      </LanguageProvider>
    );

    const results = await axe.run(container);
    const violations = results.violations.filter((v) => v.id !== "region");
    expect(violations).toHaveLength(0);
  });

  it("HealthAdvisoryBanner satisfies axe accessibility rules", async () => {
    const { container } = render(<HealthAdvisoryBanner advisory={mockAdvisory} />);

    const results = await axe.run(container);
    const violations = results.violations.filter((v) => v.id !== "region");
    expect(violations).toHaveLength(0);
  });
});
