import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { observers, setMedia } from "@/test/browser-mocks";
import { SoundProvider } from "@/providers/SoundProvider";
import { Card } from "../Card";
import { ShellSession } from "../ShellSession";
import { TerminalWindow } from "../TerminalWindow";
import { ManPage } from "../ManPage";
import { GitGraph } from "../GitGraph";
import { StatusBar } from "../StatusBar";
import { LazySection } from "../LazySection";
import { Controls } from "../Controls";
import { Section } from "../Section";
import { HireFooter } from "../HireFooter";
import { cardActions, manPages } from "@/lib/actions";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { hire, navTabs, windows } from "@/data/site";
import { CLOCK_MS, STAGGER_MS, START_DELAY_MS, VIEW_COOLDOWN_MS } from "@/lib/motion";

const withSound = (ui: ReactNode) => render(<SoundProvider>{ui}</SoundProvider>);
const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!;
const fireLast = (el: Element, on = true) => act(() => observers.at(-1)!.fire(el, on));

beforeEach(() => setMedia("(prefers-reduced-motion: reduce)", false));
afterEach(() => {
  vi.useRealTimers();
  history.replaceState(null, "", "/");
});

describe("Card", () => {
  it("renders the card from props with only the actions its links produce", () => {
    const p = bySlug("keyblaster");
    render(<Card {...p.card} title={p.title} actions={cardActions(p)} />);
    expect(screen.getByRole("heading", { name: "KeyBlaster" })).toBeInTheDocument();
    expect(screen.getByText(p.card.caption)).toBeInTheDocument();
    expect(screen.getByText("Desktop only")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Play now" })).toHaveAttribute("href", "https://keyblaster.vercel.app");
    expect(screen.getByRole("link", { name: "Read more" })).toHaveAttribute("href", "#man/keyblaster");
    expect(screen.getByRole("link", { name: "Code" })).toBeInTheDocument();
  });

  it("shows a Model link for a private repo, and no buttons for links that don't exist", () => {
    const tutor = bySlug("diagnostic-tutor");
    const { unmount } = render(<Card {...tutor.card} title={tutor.title} actions={cardActions(tutor)} />);
    expect(screen.getByRole("link", { name: "Model" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Code" })).toBeNull();
    unmount();
    const coach = bySlug("coach-study");
    render(<Card {...coach.card} title={coach.title} actions={cardActions(coach)} />);
    expect(screen.getAllByRole("link").map((l) => l.textContent)).toEqual(["Read more"]);
  });
});

describe("ShellSession", () => {
  const lines = [{ text: "keyblaster/", tone: "amber" as const }, { text: "", action: { label: "> linkedin", href: "https://x.test" } }];
  it("shows the partial command and visible lines, with the trailing prompt only when done", () => {
    const { container, rerender } = render(<ShellSession cmd="ls" lines={lines} view={{ cmdShown: "l", linesShown: 0, typing: true, done: false }} trailingPrompt />);
    expect(container).toHaveTextContent("josh ~ $ l");
    expect(screen.queryByText("keyblaster/")).toBeNull();
    rerender(<ShellSession cmd="ls" lines={lines} view={{ cmdShown: "ls", linesShown: 2, typing: false, done: true }} trailingPrompt />);
    expect(screen.getByText("keyblaster/")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "> linkedin" })).toBeInTheDocument();
    expect(container.textContent!.match(/josh ~ \$/g)).toHaveLength(2);
  });

  it("only the active session's cursor blinks, and the command is read once by screen readers", () => {
    const view = { cmdShown: "ls", linesShown: 0, typing: false, done: true };
    const { container, rerender } = render(<ShellSession cmd="ls" lines={[]} view={view} trailingPrompt />);
    expect(container.querySelector(".motion-safe\\:animate-blink")).toBeNull();
    rerender(<ShellSession cmd="ls" lines={[]} view={view} trailingPrompt activeCursor />);
    expect(container.querySelector(".motion-safe\\:animate-blink")).not.toBeNull();
    expect(screen.getByText("ls", { selector: ".sr-only" })).toBeInTheDocument();
  });
});

describe("TerminalWindow", () => {
  it("starts complete, types on scroll-in after its stagger, and lifts on hover or focus", () => {
    vi.useFakeTimers();
    const { container } = withSound(<TerminalWindow config={windows[0]} index={2} />);
    expect(container).toHaveTextContent("+ 8 more");
    fireLast(container.firstElementChild!);
    act(() => vi.advanceTimersByTime(STAGGER_MS * 2 + START_DELAY_MS));
    expect(container).not.toHaveTextContent("+ 8 more");
    const win = screen.getByText("~/projects").closest(".rounded-window")!;
    fireEvent.focus(screen.getByRole("link", { name: "Projects" }));
    expect(win.className).toContain("shadow-window-hover");
    fireEvent.blur(screen.getByRole("link", { name: "Projects" }));
    expect(win.className).not.toContain("shadow-window-hover");
  });

  it("types on scroll-in only once; scrolling back does not retype (D68)", () => {
    vi.useFakeTimers();
    const { container } = withSound(<TerminalWindow config={windows[0]} index={0} />);
    const el = container.firstElementChild!;
    fireLast(el);
    act(() => vi.advanceTimersByTime(60_000));
    expect(container).toHaveTextContent("+ 8 more");
    fireLast(el, false);
    act(() => vi.advanceTimersByTime(VIEW_COOLDOWN_MS + 1));
    fireLast(el);
    act(() => vi.advanceTimersByTime(START_DELAY_MS + 1));
    expect(container).toHaveTextContent("+ 8 more");
  });

  it.each([
    ["projects", "Projects", "#projects"],
    ["about", "About Me", "#man/josh"],
    ["resume", "Resume", "/resume.pdf"],
  ])("%s label goes to %s", (id, name, href) => {
    withSound(<TerminalWindow config={windows.find((w) => w.id === id)!} index={0} />);
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  });

  it("contact label copies the email", () => {
    withSound(<TerminalWindow config={windows.find((w) => w.id === "contact")!} index={0} />);
    expect(screen.getByRole("button", { name: "Contact" })).toBeInTheDocument();
  });
});

describe("ManPage", () => {
  const pages = manPages(projects);
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
      this.open = true;
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
      this.open = false;
    };
  });

  const open = (slug: string) => act(() => {
    history.replaceState(null, "", `#man/${slug}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });

  it("opens every page on its hash, named by the NAME line, and ignores unknown slugs", () => {
    render(<><section id="projects"><h2 tabIndex={-1}>Projects</h2></section><ManPage pages={pages} /></>);
    for (const p of pages) {
      open(p.slug);
      expect(screen.getByRole("dialog", { name: p.title })).toBeInTheDocument();
    }
    open("nope");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on q, drops the hash, and returns focus to the projects heading on a deep link", async () => {
    render(<><section id="projects"><h2 tabIndex={-1}>Projects</h2></section><ManPage pages={pages} /></>);
    open("ship");
    await userEvent.keyboard("q");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(location.hash).toBe("");
    expect(document.activeElement).toBe(screen.getByRole("heading", { name: "Projects" }));
  });

  it("shows private-repo text when there is nothing to link, and skips empty sections", () => {
    render(<ManPage pages={pages} />);
    open("coach-study");
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("private repo · walkthrough on request")).toBeInTheDocument();
    expect(within(dialog).queryByText("SEE ALSO")).not.toBeNull();
    open("ship");
    expect(within(screen.getByRole("dialog")).getByRole("link", { name: "code" })).toBeInTheDocument();
  });

  it("closes with the close button", async () => {
    render(<ManPage pages={pages} />);
    open("ship");
    await userEvent.click(screen.getByRole("button", { name: "q · close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("GitGraph", () => {
  it("renders entries in order as a list, with Aim's clients inside the branch", () => {
    render(<GitGraph entries={experience} />);
    const lists = screen.getAllByRole("list");
    expect(within(lists[0]).getAllByRole("listitem")[0]).toHaveTextContent("Gauntlet AI");
    expect(within(lists[1]).getAllByRole("listitem").map((li) => li.textContent)).toEqual(
      expect.arrayContaining([expect.stringContaining("Starbucks"), expect.stringContaining("Purple")]),
    );
  });
});

describe("StatusBar", () => {
  it("links tabs to sections, marks the active one, and shows sound and clock", () => {
    vi.useFakeTimers();
    navTabs.forEach((t) => document.body.insertAdjacentHTML("beforeend", `<section id="${t.id}"></section>`));
    withSound(<StatusBar tabs={navTabs} />);
    const nav = screen.getByRole("navigation", { name: "Site sections" });
    expect(within(nav).getByRole("link", { name: "1:projects" })).toHaveAttribute("href", "#projects");
    expect(within(nav).getByRole("link", { name: "0:home*" })).toHaveAttribute("aria-current", "location");
    expect(within(nav).getByText(/sound off/)).toBeInTheDocument();
    expect(within(nav).queryByRole("button")).toBeNull();
    act(() => vi.advanceTimersByTime(CLOCK_MS));
    expect(within(nav).getByText(/seattle \d{1,2}:\d{2}/i)).toBeInTheDocument();
    navTabs.forEach((t) => document.getElementById(t.id)!.remove());
  });
});

describe("LazySection", () => {
  it("shows the placeholder until in view, then mounts its children once", () => {
    const { container } = render(<LazySection placeholder={<p>loading</p>}><p>cards</p></LazySection>);
    expect(screen.getByText("loading")).toBeInTheDocument();
    fireLast(container.firstElementChild!);
    expect(screen.getByText("cards")).toBeInTheDocument();
    expect(screen.queryByText("loading")).toBeNull();
  });
});

describe("Controls", () => {
  it("wires clicks, music and theme toggles", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ arrayBuffer: async () => new ArrayBuffer(8) })));
    withSound(<Controls />);
    await userEvent.click(screen.getByRole("button", { name: "clicks: off" }));
    expect(await screen.findByRole("button", { name: "clicks: on" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Dark mode" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    vi.unstubAllGlobals();
  });
});

describe("Section", () => {
  it("renders an h2, optional subtitle and the anchor id", () => {
    const { container } = render(<Section id="case-studies" title="Case Studies" subtitle="written by me"><p>x</p></Section>);
    expect(container.querySelector("section#case-studies")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Case Studies" })).toBeInTheDocument();
    expect(screen.getByText("written by me")).toBeInTheDocument();
  });
});

describe("HireFooter", () => {
  it("types ./hire.sh in view, then shows the contact lines", () => {
    vi.useFakeTimers();
    const { container } = withSound(<HireFooter session={hire} copyright="© test" />);
    expect(container.querySelector("footer#contact")).not.toBeNull();
    fireLast(container.querySelector("footer")!);
    act(() => vi.advanceTimersByTime(START_DELAY_MS));
    expect(screen.queryByText("open to senior software engineering roles")).toBeNull();
    act(() => vi.advanceTimersByTime(10_000));
    expect(screen.getByText("open to senior software engineering roles")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /joshdrochon@gmail\.com/ })).toBeInTheDocument();
  });

  it("shows everything at once under reduced motion", () => {
    setMedia("(prefers-reduced-motion: reduce)", true);
    const { container } = withSound(<HireFooter session={hire} copyright="© test" />);
    fireLast(container.querySelector("footer")!);
    expect(screen.getByText("open to senior software engineering roles")).toBeInTheDocument();
  });
});
