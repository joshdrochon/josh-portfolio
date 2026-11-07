"use client";
import { useSyncExternalStore } from "react";
import { mediaQuery } from "@/lib/media";

const reduce = mediaQuery("(prefers-reduced-motion: reduce)");

export const useReducedMotion = () => useSyncExternalStore(reduce.subscribe, reduce.matches, () => false);
