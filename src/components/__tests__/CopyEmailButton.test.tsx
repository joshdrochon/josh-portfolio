import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyEmailButton } from "../CopyEmailButton";
import { EMAIL } from "@/data/site";
import { COPY_RESET_MS } from "@/lib/motion";

const setClipboard = (writeText?: (t: string) => Promise<void>) =>
  Object.defineProperty(navigator, "clipboard", { value: writeText ? { writeText } : undefined, configurable: true });

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("CopyEmailButton", () => {
  it("copies the address, shows its own copied label, announces it, then resets", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    render(
      <>
        <CopyEmailButton label="> email" copiedLabel="✓ copied" />
        <CopyEmailButton label="Contact" copiedLabel="✓ copied" />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "> email" }));
    expect(writeText).toHaveBeenCalledWith(EMAIL);
    expect(await screen.findByRole("button", { name: "✓ copied" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Contact" })).toBeInTheDocument();
    expect(screen.getAllByRole("status").map((s) => s.textContent)).toEqual([`Copied ${EMAIL}`, ""]);
    act(() => vi.advanceTimersByTime(COPY_RESET_MS));
    expect(screen.getByRole("button", { name: "> email" })).toBeInTheDocument();
  });

  it("falls back to mailto when the clipboard is missing or rejects", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    setClipboard(undefined);
    const { unmount } = render(<CopyEmailButton label="> email" copiedLabel="✓ copied" />);
    await userEvent.click(screen.getByRole("button", { name: "> email" }));
    expect(open).toHaveBeenCalledWith(`mailto:${EMAIL}`, "_self");
    unmount();

    setClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    render(<CopyEmailButton label="> email" copiedLabel="✓ copied" />);
    await userEvent.click(screen.getByRole("button", { name: "> email" }));
    expect(open).toHaveBeenCalledTimes(2);
  });
});
