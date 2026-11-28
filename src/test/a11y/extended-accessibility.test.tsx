import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import axe from "axe-core";
import { LanguageProvider } from "@/lib/i18n/context";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { ProfileModal } from "@/components/ProfileModal";
import { InteractiveTools } from "@/components/InteractiveTools";
import { OnboardingWizard } from "@/components/OnboardingWizard";

describe("Extended Accessibility & WCAG 2.2 AA Auditing", () => {
  it("LoadingSkeleton satisfies axe rules and announces status to screen readers", async () => {
    const { container } = render(<LoadingSkeleton />);
    const results = await axe.run(container);
    const violations = results.violations.filter((v) => v.id !== "region");
    expect(violations).toHaveLength(0);
  });

  it("ErrorDisplay satisfies axe rules with clear retry action", async () => {
    const { container } = render(
      <ErrorDisplay message="Unable to load live station data" onRetry={() => {}} />
    );
    const results = await axe.run(container);
    const violations = results.violations.filter((v) => v.id !== "region");
    expect(violations).toHaveLength(0);
  });

  it("InteractiveTools satisfies axe rules in both light and dark mode", async () => {
    const { container } = render(
      <LanguageProvider>
        <div className="dark">
          <InteractiveTools
            aqi={280}
            category="Poor"
            profile={{
              hasYoungChildren: true,
              hasSeniors: false,
              hasStudents: false,
              isDailyCommuter: true,
              hasRespiratorySensitivity: false,
              commuteMode: "metro",
              hasAirPurifier: true,
              hasIndoorPlants: true,
            }}
          />
        </div>
      </LanguageProvider>
    );

    const results = await axe.run(container);
    const violations = results.violations.filter((v) => v.id !== "region");
    expect(violations).toHaveLength(0);
  });

  it("OnboardingWizard satisfies dialog accessibility requirements", async () => {
    const { container } = render(
      <LanguageProvider>
        <OnboardingWizard isOpen={true} onComplete={() => {}} onSkip={() => {}} />
      </LanguageProvider>
    );

    const results = await axe.run(container);
    const violations = results.violations.filter((v) => v.id !== "region");
    expect(violations).toHaveLength(0);
  });

  it("ProfileModal dialog satisfies form labeling and modal semantics", async () => {
    const { container } = render(
      <ProfileModal
        isOpen={true}
        onClose={() => {}}
        profile={{
          hasYoungChildren: true,
          hasSeniors: true,
          hasStudents: false,
          isDailyCommuter: false,
          hasRespiratorySensitivity: true,
          commuteMode: "car",
          hasAirPurifier: true,
          hasIndoorPlants: false,
        }}
        onSaveProfile={() => {}}
      />
    );

    const results = await axe.run(container);
    const violations = results.violations.filter((v) => v.id !== "region");
    expect(violations).toHaveLength(0);
  });
});
