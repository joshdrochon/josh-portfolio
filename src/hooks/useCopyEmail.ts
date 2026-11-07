"use client";
import { useEffect, useState } from "react";
import { EMAIL } from "@/data/site";
import { COPY_RESET_MS } from "@/lib/motion";

// Copies the email address; falls back to opening the mail app when the clipboard isn't available.
export function useCopyEmail() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), COPY_RESET_MS);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      window.open(`mailto:${EMAIL}`, "_self");
    }
  };

  return { copied, copy };
}
