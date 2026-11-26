import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GuidanceCardItem } from "@/components/GuidanceCardItem";
import { GuidanceCard } from "@/types/guidance";

describe("GuidanceCardItem Component", () => {
  const mockCard: GuidanceCard = {
    id: "test-card-1",
    title: "Shift Routine to Midday",
    action: "Postpone morning walks until after 11 AM when boundary layer lifts.",
    whyThisMatters: "Nocturnal temperature inversions trap vehicular particulate pollution near surface.",
    expectedImpact: "Lowers immediate respiratory particle intake by up to 35%.",
    urgency: "critical",
    tags: ["Timing", "Inversion"],
  };

  it("renders card title, action, urgency badge, and tags", () => {
    render(<GuidanceCardItem card={mockCard} />);

    expect(screen.getByText("Shift Routine to Midday")).toBeInTheDocument();
    expect(screen.getByText("Postpone morning walks until after 11 AM when boundary layer lifts.")).toBeInTheDocument();
    expect(screen.getByText("Critical Action")).toBeInTheDocument();
    expect(screen.getByText(/Timing/)).toBeInTheDocument();
  });

  it("toggles scientific reasoning and expected impact upon expanding", () => {
    render(<GuidanceCardItem card={mockCard} />);

    // Initially collapsed
    expect(screen.queryByText(/Nocturnal temperature inversions/)).not.toBeInTheDocument();

    const expandButton = screen.getByRole("button", {
      name: /Scientific Reason & Expected Impact/i,
    });
    fireEvent.click(expandButton);

    // Now visible
    expect(screen.getByText(/Nocturnal temperature inversions/)).toBeInTheDocument();
    expect(screen.getByText(/Lowers immediate respiratory particle intake/)).toBeInTheDocument();

    // Collapse again
    fireEvent.click(expandButton);
    expect(screen.queryByText(/Nocturnal temperature inversions/)).not.toBeInTheDocument();
  });
});
