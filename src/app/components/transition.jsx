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
      setBusy((currentBusy) => {
        if (currentBusy) return currentBusy;
        return true;
    });
    await new Promise((r) => setTimeout(r, 0));
    setPhase("out");
    await new Promise((r) => setTimeout(r, outMs + holdMs));
    if (to) router.push(to);
    setPhase("loading");
    await new Promise((r) => setTimeout(r, inMs));
    setPhase("in");
  };
    const pageReady = () => {
      setTimeout(() => {
        setPhase("idle");
        setBusy(false);
      }, 100); // 100ms delay
    };
    const transitionTo = (to, opts = {}) => transition({ to, ...opts });
    return { transition, transitionTo, pageReady };
  }, [router]);

  return (
    <TransitionCtx.Provider value={{...api, busy }}>
      {/* wrap page content for blur */}
      <div
        style={{
          opacity: phase === "out" || phase === "loading" ? 0.8 : 1,
          transition:
            phase === "out"
              ? "opacity 160ms ease"
              : phase === "loading"
              ? "none"
              : "opacity 140ms ease",
          willChange: phase === "idle" ? "auto" : "opacity",
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
            "radial-gradient(80% 60% at 50% 45%, rgba(184,87,246,0.25), rgba(247,130,208,0.15), rgba(0,0,0,0.75))",
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