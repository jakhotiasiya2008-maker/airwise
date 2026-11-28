import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorDisplay } from "@/components/ErrorDisplay";

describe("ErrorDisplay Component", () => {
  it("renders friendly error message and calls retry callback", () => {
    const onRetry = vi.fn();
    render(<ErrorDisplay message="Unable to reach Open-Meteo API" onRetry={onRetry} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Unable to reach Open-Meteo API")).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /Retry Connection/i });
    fireEvent.click(retryBtn);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
