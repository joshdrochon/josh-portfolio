import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";
import "./browser-mocks";

// Mock next/image — not available in jsdom
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) =>
    React.createElement("img", { src, alt }),
}));
