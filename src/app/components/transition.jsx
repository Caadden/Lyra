"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const TransitionCtx = createContext(null);

export function TransitionProvider({ children }) {
  const router = useRouter();
  const [phase, setPhase] = useState("idle");
  const [busy, setBusy] = useState(false);

  const api = useMemo(() => {
    const transition = async ({
      to,
      outMs = 160,
      holdMs = 40,
      inMs = 140,
    } = {}) => {
      if (busy) return;

      setBusy(true);
      setPhase("out");

      // blur/fade
      await new Promise((r) => setTimeout(r, outMs + holdMs));

      // navigate
      if (to) router.push(to);

      // stay blurred while loading
      setPhase("loading");

      // wait for render, then transition in
      await new Promise((r) => setTimeout(r, inMs));
      setPhase("in");
    };

    const pageReady = () => {
      setTimeout(() => {
        setPhase("idle");
        setBusy(false);
      }, 100); // 100ms delay after page is ready
    };

    const transitionTo = (to, opts = {}) => transition({ to, ...opts });

    return { transition, transitionTo, busy, pageReady };
  }, [router]);

  return (
    <TransitionCtx.Provider value={api}>
      {/* wrap page content for blur */}
      <div
        style={{
          filter:
            phase === "out" || phase === "loading" ? "blur(10px)" : "none",
          opacity: phase === "out" || phase === "loading" ? 0.82 : 1,
          transform: phase === "out" || phase === "loading" ? "scale(0.995)" : "scale(1)",
          transition:
            phase === "out"
              ? "filter 160ms ease, opacity 160ms ease, transform 160ms ease"
              : phase === "loading"
              ? "none"
              : "filter 140ms ease, opacity 140ms ease, transform 140ms ease",
          willChange: phase === "idle" ? "auto" : "filter, opacity, transform",
        }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-9999"
        style={{
          opacity: phase === "out" ? 1 : 0,
          transition: "opacity 160ms ease",
          background:
            "radial-gradient(80% 60% at 50% 45%, rgba(184,87,246,0.18), rgba(247,130,208,0.10), rgba(0,0,0,0.45))",
        }}
      />
    </TransitionCtx.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionCtx);
  if (!ctx) {
    throw new Error("useTransition must be used within <TransitionProvider />");
  }
  return ctx;
}