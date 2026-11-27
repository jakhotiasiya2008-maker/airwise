import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "@/lib/i18n/context";
import { PurifierAdequacyTool } from "@/components/tools/PurifierAdequacyTool";
import { CommuteWhatIfTool } from "@/components/tools/CommuteWhatIfTool";
import { SafeWindowTool } from "@/components/tools/SafeWindowTool";
import { OnboardingWizard } from "@/components/OnboardingWizard";

describe("Interactive Components Suite", () => {
  it("PurifierAdequacyTool updates ACH when room size or CADR sliders change", () => {
    render(
      <LanguageProvider>
        <PurifierAdequacyTool initialRoomSqFt={200} initialCadr={300} />
      </LanguageProvider>
    );

    const roomSlider = screen.getByLabelText(/Room Area/i);
    expect(roomSlider).toBeInTheDocument();

    fireEvent.change(roomSlider, { target: { value: "400" } });
    expect(screen.getByText("400 sq ft")).toBeInTheDocument();
  });

  it("CommuteWhatIfTool switches commute modes and updates exposure ratings", () => {
    render(
      <LanguageProvider>
        <CommuteWhatIfTool initialMode="metro" />
      </LanguageProvider>
    );

    expect(screen.getByText(/Electric Metro Rail/i)).toBeInTheDocument();

    const bikeButton = screen.getByRole("button", { name: "bike" });
    fireEvent.click(bikeButton);

    expect(screen.getByText(/Motorcycle \/ Scooter/i)).toBeInTheDocument();
    expect(screen.getByText(/9 \/ 10 \(Very High\)/i)).toBeInTheDocument();
  });

  it("SafeWindowTool displays recommended duration based on AQI", () => {
    render(
      <LanguageProvider>
        <SafeWindowTool
          aqi={350}
          category="Very Poor"
          profile={{
            hasYoungChildren: true,
            hasSeniors: false,
            hasStudents: false,
            isDailyCommuter: false,
            hasRespiratorySensitivity: false,
            commuteMode: "car",
            hasAirPurifier: true,
            hasIndoorPlants: false,
          }}
        />
      </LanguageProvider>
    );

    expect(screen.getByText(/Safe Outdoor Duration/i)).toBeInTheDocument();
    expect(screen.getByText(/20 - 30 mins/i)).toBeInTheDocument();
  });

  it("OnboardingWizard steps through 1, 2, 3 and calls onComplete", () => {
    const handleComplete = vi.fn();
    const handleSkip = vi.fn();

    render(
      <LanguageProvider>
        <OnboardingWizard
          isOpen={true}
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      </LanguageProvider>
    );

    expect(screen.getByText(/Step 1 of 3/i)).toBeInTheDocument();

    // Click Next to Step 2
    const nextBtn = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Step 2 of 3/i)).toBeInTheDocument();

    // Click Next to Step 3
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));

    expect(screen.getByText(/Step 3 of 3/i)).toBeInTheDocument();

    // Click Finish / Get My Personalized Plan
    const finishBtn = screen.getByRole("button", { name: /Get My Personalized Plan/i });
    fireEvent.click(finishBtn);

    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
});
