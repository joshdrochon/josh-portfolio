import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Window } from "../Window";
import { Prompt } from "../Prompt";
import { Cursor } from "../Cursor";
import { Tag } from "../Tag";
import { Button } from "../Button";
import { TogglePill } from "../TogglePill";
import { BigStat } from "../BigStat";

describe("Window", () => {
  it("renders the title, decorative dots, children and actions", () => {
    render(
      <Window title="~/projects" actions={<button>close</button>}>
        <p>body</p>
      </Window>,
    );
    expect(screen.getByText("~/projects")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "close" })).toBeInTheDocument();
    const dots = screen.getByText("~/projects").previousElementSibling!;
    expect(dots).toHaveAttribute("aria-hidden", "true");
    expect(dots.children).toHaveLength(3);
  });
});

describe("Prompt", () => {
  it("renders josh ~ $ then its children, with a cursor only when asked", () => {
    const { container, rerender } = render(<Prompt>ls projects/</Prompt>);
    expect(container).toHaveTextContent("josh ~ $ ls projects/");
    expect(container.querySelector("[aria-hidden]")).toBeNull();
    rerender(<Prompt cursor="idle">ls</Prompt>);
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });
});

describe("Cursor", () => {
  it.each([
    ["idle", "hollow", false],
    ["active", "solid", true],
    ["typing", "solid", false],
    ["solid", "solid", false],
  ] as const)("%s is %s, blinking=%s, and hidden from screen readers", (state, fill, blinks) => {
    const { container } = render(<Cursor state={state} />);
    const el = container.firstElementChild!;
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el.className.includes("shadow-cursor-hollow")).toBe(fill === "hollow");
    expect(el.className.includes("animate-blink")).toBe(blinks);
  });
});

describe("Tag", () => {
  it("renders its text", () => {
    render(<Tag>TypeScript</Tag>);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });
});

describe("Button", () => {
  it("renders a real link with the href and a per-variant style hook", () => {
    render(<Button variant="secondary" action={{ label: "Read more", href: "#man/ship" }} />);
    const link = screen.getByRole("link", { name: "Read more" });
    expect(link).toHaveAttribute("href", "#man/ship");
    expect(link).toHaveClass("border-control");
    expect(link).not.toHaveAttribute("rel");
  });

  it("protects external links", () => {
    render(<Button variant="primary" action={{ label: "Play now", href: "https://keyblaster.vercel.app", icon: "play" }} />);
    expect(screen.getByRole("link", { name: "Play now" })).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a copy action as a button", () => {
    render(<Button variant="link" action={{ label: "> email", copy: "email", copiedLabel: "✓ copied" }} />);
    expect(screen.getByRole("button", { name: "> email" })).toHaveClass("text-term-blue");
  });
});

describe("TogglePill", () => {
  it("is a button whose aria-pressed follows pressed and that toggles once per activation", async () => {
    const onToggle = vi.fn();
    const { rerender } = render(<TogglePill pressed={false} onToggle={onToggle} icon="speaker" label="clicks: off" />);
    const btn = screen.getByRole("button", { name: "clicks: off" });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(btn);
    btn.focus();
    await userEvent.keyboard(" ");
    await userEvent.keyboard("{Enter}");
    expect(onToggle).toHaveBeenCalledTimes(3);
    rerender(<TogglePill pressed={true} onToggle={onToggle} icon="speaker" label="clicks: on" />);
    expect(screen.getByRole("button", { name: "clicks: on" })).toHaveAttribute("aria-pressed", "true");
  });

  it("theme pill has the fixed name Dark mode and omits aria-pressed until known", () => {
    const { rerender } = render(<TogglePill pressed={null} onToggle={() => {}} icon="theme" ariaLabel="Dark mode" />);
    expect(screen.getByRole("button", { name: "Dark mode" })).not.toHaveAttribute("aria-pressed");
    rerender(<TogglePill pressed={true} onToggle={() => {}} icon="theme" ariaLabel="Dark mode" />);
    expect(screen.getByRole("button", { name: "Dark mode" })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("BigStat", () => {
  it("renders a plain value", () => {
    render(<BigStat stat={{ text: "4,500+ tests", source: "README.md:89" }} />);
    expect(screen.getByText("4,500+ tests")).toBeInTheDocument();
  });

  it("renders before → after with a strike-through and a readable sentence", () => {
    const { container } = render(<BigStat stat={{ from: "1,276", to: "103", unit: "ms", source: "SUBMISSION.md:29" }} />);
    expect(container.querySelector("s")).toHaveTextContent("1,276");
    expect(screen.getByText("from 1,276 to 103 ms")).toHaveClass("sr-only");
  });

  it("renders ours vs theirs", () => {
    const { container } = render(<BigStat stat={{ ours: "86%", theirs: "71.5%", source: "README.md:17" }} />);
    expect(container).toHaveTextContent("86% vs 71.5%");
  });

  it("renders redaction bars as one labelled image", () => {
    render(<BigStat stat={{ redacted: true, source: "n/a" }} />);
    const img = screen.getByRole("img", { name: "Redacted text" });
    expect(within(img).queryByText(/./)).toBeNull();
  });
});
