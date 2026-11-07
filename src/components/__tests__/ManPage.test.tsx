import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ManPage } from "../ManPage";
import { cardActions, manPages } from "@/lib/actions";
import { projects } from "@/data/projects";

afterEach(() => history.replaceState(null, "", "/"));

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
    expect(within(screen.getByRole("dialog")).getByRole("link", { name: "Code" })).toBeInTheDocument();
  });

  it("SEE ALSO uses exactly the card's button labels (D77)", () => {
    projects.filter((p) => p.man).forEach((p) => {
      const card = cardActions(p).filter((a) => !("href" in a && a.href.startsWith("#man/"))).map((a) => a.label);
      expect(pages.find((m) => m.slug === p.slug)!.seeAlso?.map((l) => l.label) ?? []).toEqual(card);
    });
  });

  it("closes with the close button", async () => {
    render(<ManPage pages={pages} />);
    open("ship");
    await userEvent.click(screen.getByRole("button", { name: "q · close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("Back (hash removed) closes it and returns focus to the opener", () => {
    render(<><a href="#man/ship">open ship</a><ManPage pages={pages} /></>);
    screen.getByRole("link", { name: "open ship" }).focus();
    open("ship");
    act(() => {
      history.replaceState(null, "", "/");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("link", { name: "open ship" })).toHaveFocus();
  });

  it("the pager reads 100% when the page doesn't scroll", () => {
    render(<ManPage pages={pages} />);
    open("ship");
    expect(screen.getByText(/Manual page ship\(1\) · 100%/)).toBeInTheDocument();
  });
});
