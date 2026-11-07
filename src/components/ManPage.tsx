"use client";
import { type KeyboardEvent, type RefObject, useEffect, useRef, useState } from "react";
import type { ManPageData } from "@/data/types";
import { Button } from "./Button";
import { Window } from "./Window";

const STEP = 48; // px per j/k press
const slugFromHash = () => location.hash.match(/^#man\/(.+)$/)?.[1] ?? null;
const H = "font-mono text-sm font-bold text-term-bright";

// "Read more": the project's write-up as a Unix manual page in a native modal dialog, opened by #man/<slug>.
export function ManPage({ pages }: { pages: ManPageData[] }) {
  const [slug, setSlug] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const shown = useRef(false);
  const page = pages.find((p) => p.slug === slug);

  useEffect(() => {
    const sync = () => {
      const s = slugFromHash();
      if (s && pages.some((p) => p.slug === s) && document.activeElement !== document.body) opener.current = document.activeElement as HTMLElement;
      setSlug(s);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pages]);

  useEffect(() => {
    const d = dialog.current;
    if (page && d && !d.open) {
      d.showModal();
      shown.current = true;
      body.current?.focus(); // j/k scroll right away
    } else if (!page && shown.current) {
      // Closed by q/Escape/backdrop or by the Back button: focus goes back to the opener (D35).
      shown.current = false;
      (opener.current ?? document.querySelector<HTMLElement>("#projects h2"))?.focus();
      opener.current = null;
    }
  }, [page]);

  const close = () => {
    dialog.current?.close();
    history.replaceState(null, "", location.pathname + location.search);
    setSlug(null);
  };

  // j/k like `less`; arrows and space already scroll the focused body natively.
  const onKey = (e: KeyboardEvent) => {
    const moves: Record<string, number> = { j: STEP, k: -STEP };
    if (e.key === "q") close();
    else if (e.key in moves) body.current?.scrollBy({ top: moves[e.key] });
    else return;
    e.preventDefault();
  };

  if (!page) return null;
  const upper = `${page.slug.toUpperCase()}(1)`;
  return (
    <dialog
      ref={dialog}
      aria-labelledby="man-name"
      onKeyDown={onKey}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => e.target === dialog.current && close()}
      className="m-auto w-full max-w-dialog bg-transparent p-4 backdrop:bg-scrim"
    >
      <Window
        title={`man ${page.slug}`}
        actions={
          <button type="button" onClick={close} className="min-h-touch rounded-tile border border-term-redact px-3 text-term-text">
            q · close
          </button>
        }
        className="flex max-h-dialog-max flex-col shadow-dialog"
      >
        <div
          ref={body}
          tabIndex={-1}
          className="min-h-0 flex-1 overflow-y-auto px-7 pt-6 pb-2 font-mono text-sm leading-term outline-none"
        >
          <div className="mb-5 flex flex-wrap justify-between gap-x-4 text-xs text-term-muted">
            <span>{upper}</span>
            <span>{page.meta}</span>
            <span>{upper}</span>
          </div>
          <h2 className={H}>NAME</h2>
          <p id="man-name" className="mb-5 ml-7">
            {page.title}
          </p>
          <h3 className={H}>SYNOPSIS</h3>
          <dl className="mb-5 ml-7 flex flex-wrap gap-3">
            {page.tiles.map((t) => (
              <div key={t.k} className="rounded-tile border border-term-border px-4 py-3">
                <dt className="text-2xs text-term-muted">{t.k}</dt>
                <dd className="text-lg font-bold text-term-green">{t.v}</dd>
              </div>
            ))}
          </dl>
          {page.sections.map((s) => (
            <section key={s.title} className="mb-5">
              <h3 className={H}>{s.title}</h3>
              <div className="ml-7 font-sans text-md leading-body">
                {"paras" in s && s.paras.map((p) => <p key={p} className="mb-3">{p}</p>)}
                {"bullets" in s && (
                  <ul className="list-disc pl-5">
                    {s.bullets.map((b) => (
                      <li key={b} className="mb-2">{b}</li>
                    ))}
                  </ul>
                )}
                {"mono" in s && <p className="font-mono text-term-amber">{s.mono}</p>}
              </div>
            </section>
          ))}
          <h3 className={H}>SEE ALSO</h3>
          <div className="mt-2 mb-5 ml-7 flex flex-wrap gap-3">
            {page.seeAlso?.length ? page.seeAlso.map((l) => <Button key={l.label} variant="term" action={l} />) : <p className="text-term-muted">private repo · walkthrough on request</p>}
          </div>
        </div>
        <Pager slug={page.slug} body={body} />
      </Window>
    </dialog>
  );
}

// The `less`-style footer. Its own component, so scrolling re-renders only this line.
function Pager({ slug, body }: { slug: string; body: RefObject<HTMLDivElement | null> }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.round((el.scrollTop / max) * 100) : 100);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [body, slug]);
  return (
    <div className="bg-term-text px-7 py-2 font-mono text-xs text-term">
      Manual page {slug}(1) · {pct}% · j/k scroll · q quit
    </div>
  );
}
