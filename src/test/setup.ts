import "@testing-library/jest-dom";

// Mock canvas getContext for jsdom to silence axe-core ligature check warnings
if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
