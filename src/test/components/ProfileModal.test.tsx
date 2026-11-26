import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProfileModal } from "@/components/ProfileModal";
import { HouseholdProfile } from "@/types/profile";

describe("ProfileModal Component", () => {
  const initialProfile: HouseholdProfile = {
    hasYoungChildren: false,
    hasSeniors: false,
    hasStudents: false,
    isDailyCommuter: false,
    hasRespiratorySensitivity: false,
    commuteMode: "metro",
    hasAirPurifier: false,
    hasIndoorPlants: false,
    customNotes: "",
  };

  it("renders form elements and allows saving updated configuration", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <ProfileModal
        isOpen={true}
        onClose={handleClose}
        profile={initialProfile}
        onSaveProfile={handleSave}
      />
    );

    expect(screen.getByText("Household Vulnerability Profile")).toBeInTheDocument();

    // Toggle Young Children
    const childrenCheckbox = screen.getByLabelText(/Young Children \/ Infants/i);
    expect(childrenCheckbox).not.toBeChecked();
    fireEvent.click(childrenCheckbox);
    expect(childrenCheckbox).toBeChecked();

    // Select Commute Mode
    const select = screen.getByLabelText(/Primary Daily Commute Mode/i);
    fireEvent.change(select, { target: { value: "bike" } });

    // Submit form
    const saveButton = screen.getByRole("button", { name: /Save Profile/i });
    fireEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        hasYoungChildren: true,
        commuteMode: "bike",
      })
    );
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
