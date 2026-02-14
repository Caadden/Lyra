"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTransition } from "../components/transition";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalyzePage() {
  const [lyrics, setLyrics] = useState("");
  const [artist, setArtist] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, done, or error
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const [etaTotal, setEtaTotal] = useState(null); // 30 or 40
  const [etaLeft, setEtaLeft] = useState(null); // countdown seconds
  const [etaMode, setEtaMode] = useState("idle"); // idle, countdown, or finishing
  const etaIntervalRef = useRef(null);

  const { pageReady } = useTransition();
  const resultsRef = useRef(null);
  const abortRef = useRef(null);

  const [bgActive, setBgActive] = useState(false);
  const [typingStart, setTypingStart] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const requestIdRef = useRef(0);
  const activeRequestIdRef = useRef(0);

  useEffect(() => {
    // reset state
    setStatus("idle");
    pageReady();
    setIsMounted(true);

    return () => {
      if (etaIntervalRef.current) {
        clearInterval(etaIntervalRef.current);
        etaIntervalRef.current = null;
      }
      abortRef.current?.abort();
    };
  }, [pageReady]);

  const charCount = lyrics.length;
  const tooLong = charCount > 8000;
  const canAnalyze =
    lyrics.trim().length > 0 && !tooLong && status !== "loading";

    const onCancel = () => {
  abortRef.current?.abort();  // cancels fetch
  abortRef.current = null;

  activeRequestIdRef.current = 0;

  stopEta();
  setStatus("idle");
  setResult(null);
  setShowResults(false);
  setBgActive(false);
  setTypingStart(false);
};

  const stopEta = () => {
    if (etaIntervalRef.current) {
      clearInterval(etaIntervalRef.current);
      etaIntervalRef.current = null;
    }
    setEtaTotal(null);
    setEtaLeft(null);
    setEtaMode("idle");
  };

  const startEta = () => {
    // simple ETA
    const total = charCount < 5000 ? 30 : 40;

    setEtaTotal(total);
    setEtaLeft(total);
    setEtaMode("countdown");

    if (etaIntervalRef.current) clearInterval(etaIntervalRef.current);

    etaIntervalRef.current = setInterval(() => {
      setEtaLeft((prev) => {
        if (prev === null) return prev;
        const next = Math.max(0, prev - 1);

        // when close, switch message to:
        if (next <= 3) setEtaMode("finishing");

        return next;
      });
    }, 1000);
  };

  const progressPct = (() => {
    if (!etaTotal || etaLeft === null) return 0;

    const elapsed = etaTotal - etaLeft;
    const raw = (elapsed / etaTotal) * 100;

    // cap at 95% until response; doesn't look stuck
    return Math.min(95, Math.max(0, raw));
  })();

  const onAnalyze = async () => {
    if (!canAnalyze) return;

    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    const requestId = ++requestIdRef.current;
    activeRequestIdRef.current = requestId;

    setShowResults(true);
    setStatus("loading");
    setResult(null);
    setBgActive(false);
    setTypingStart(false);
    startEta();

    requestAnimationFrame(() => {
      const el = resultsRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const target = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
      window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics, artist }),
        signal: controller.signal,
      });

      if (activeRequestIdRef.current !== requestId) return;

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 499 || data?.code === "CANCELED") return;
        throw new Error(data?.message || "Analysis failed.");
      }

      if (activeRequestIdRef.current !== requestId) return;

      setResult(data);
      setStatus("done");
      setTypingStart(true);
    } catch (e) {
      if (e?.name === "AbortError") return;
      if (activeRequestIdRef.current !== requestId) return;

      setResult({
        error: e?.message || "Something went wrong.",
        core_insight: { thesis: "", one_line_summary: "", central_conflict: "" },
        mood_arc: { primary_mood: "", emotional_quality: "", shape: "static", stages: [] },
        key_motifs: [],
        lyrical_highlights: [],
        takeaway: { interpretation: "", universal_hook: "" },
        ui_optimized: { tone_tags: [], theme_tags: [], complexity_score: 1, color_palette: "neutral" },
      });
      setStatus("error");
    } finally {
      if (activeRequestIdRef.current === requestId) stopEta();
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  return (
  <div
    className="min-h-screen"
    style={{
      background: showResults
        ? "#0b0c10"
        : "linear-gradient(to bottom, #18181b 0%, #18181b 80%, var(--color-lyra-gray) 100%)",
    }}
  >
    <a href="/" className="fixed left-6 top-6 z-50 transition hover:opacity-80">
      <img src="/lyra-apple-touch-icon.png" alt="Lyra" className="h-6 w-6 rounded-xl" />
    </a>

    {isMounted && createPortal(
      <ScrollIndicator enabled={showResults && status === "done"} />,
      document.body
    )}
    {/* INPUT */}
    <main
      className={cx(
        "mx-auto w-full max-w-3xl px-5 pt-14 pb-20 transition-all duration-700",
        showResults && status === "loading"
          ? "opacity-20 pointer-events-none blur-[0.6px]"
          : "opacity-100"
      )}
    >
      <section className="min-h-[82vh]">
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Analyze
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-400">
          Paste lyrics below. We won’t store anything, promise.
          <span className="text-neutral-500">
            {" "}
          </span>
        </p>

        <label className="mt-7 block text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
        Lyrics
        </label>

        <div className="relative mt-2">
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Paste lyrics here…"
            rows={9}
            className={cx(
              "w-full resize-y rounded-3xl",
              "border border-white/10 bg-white/6 text-white",
              "px-5 py-4 text-sm leading-6",
              "placeholder:text-white/35",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_rgba(0,0,0,0.55)]",
              "backdrop-blur-xl",
              "outline-none transition",
              "focus:border-white/20 focus:bg-white/8",
              "focus:ring-2 focus:ring-[rgba(184,87,246,0.22)]",
              "scrollbar-hide"
            )}
          />
          {lyrics && (
            <button
            onClick={() => setLyrics("")}
            className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white/90"
            title="Clear lyrics"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          )}
        </div>

        <div className="mt-2 flex items-center gap-3">
          <span
            className={cx(
              "text-xs",
              tooLong ? "text-red-600" : "text-neutral-500"
            )}
          >
            {charCount.toLocaleString()}/8,000{tooLong ? " — too long" : ""}
          </span>
        </div>

        <label className="mt-7 block text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
          Artist{" "}
          <span className="-ml-0.5 text-[0.6rem] font-normal tracking-normal lowercase text-neutral-100">(recommended)</span>

        </label>
        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist name"
          className={cx(
            "mt-2 w-full rounded-2xl",
            "border border-white/10 bg-white/6 text-white",
            "px-5 py-3 text-sm",
            "placeholder:text-white/35",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.45)]",
            "backdrop-blur-xl",
            "outline-none transition",
            "focus:border-white/20 focus:bg-white/8",
            "focus:ring-2 focus:ring-[rgba(247,130,208,0.18)]"
          )}
        />

        <button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={[
            "mt-6 inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold",
            canAnalyze
              ? "border-transparent bg-linear-to-tr from-lyra-purple to-lyra-pink text-white hover:opacity-90 active:scale-[0.99]"
              : "cursor-not-allowed border-neutral-700 bg-neutral-800 text-neutral-500",
          ].join(" ")}
        >
          {status === "loading" ? "Analyzing…" : "Analyze"}
        </button>
      </section>
    </main>

    {/* RESULTS */}
    {showResults && (
      <section
        ref={resultsRef}
        className={cx(
          "relative min-h-screen w-full overflow-hidden transition-[filter] duration-700",
          bgActive ? "saturate-125" : "saturate-100"
        )}
      >
        {/* base darkness so it never flashes white */}
        <div className="absolute inset-0 bg-[#0b0c10]" />
        <AnimatedBackground active={bgActive} />
        <AnimatePresence>
          {bgActive && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.18, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{
                background:
                  "radial-gradient(circle at 50% 25%, rgba(184,87,246,0.18), transparent 55%)",
              }}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-20 pb-24">
          {/* LOADING */}
          {status === "loading" && (
            <div className="flex min-h-[80vh] items-center justify-center">
              <div className="w-full max-w-xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                  LYRA
                </p>

                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white">
                  Interpreting…
                </h2>

                <p className="mt-4 text-sm text-white/60">
                  {etaMode === "finishing" ? (
                    "Finishing up…"
                  ) : (
                    <>
                      Estimated time:{" "}
                      <span className="tabular-nums font-semibold text-white/80">
                        {etaLeft}s
                      </span>
                    </>
                  )}
                </p>

                <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-lyra-purple via-lyra-pink to-lyra-cyan shadow-[0_0_18px_rgba(184,87,246,0.5)] transition-[width] duration-500 ease-out"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <button
                  onClick={onCancel}
                  className="mt-10 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-2 text-xs font-semibold text-white/70 backdrop-blur-md hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex min-h-[80vh] items-center justify-center">
              <div className="w-full max-w-xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                  LYRA
                </p>

                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white">
                  Something went wrong
                </h2>

                <p className="mt-4 text-sm text-white/60">
                  {result?.error || "Unknown error."}
                </p>

                <div className="mt-10 flex justify-center gap-3">
                  <button
                    onClick={onAnalyze}
                    className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-2 text-xs font-semibold text-white/80 hover:bg-white/15"
                  >
                    Retry
                  </button>
                  <button
                    onClick={onCancel}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DONE */}
          {result && status === "done" && (
            <>
              {/* core insight typed */}
              <div className="min-h-[78vh] pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                  Core Insight
                </p>

                <TypewriterText
                  text={
                    result?.core_insight?.thesis ||
                    result?.core_insight?.one_line_summary ||
                    ""
                  }
                  start={typingStart}
                  speed={12}
                  onDone={() => { 
                    setBgActive(true);
                    window.navigator?.vibrate?.(10);
                  }}
                  className="mt-7 max-w-4xl text-3xl font-light leading-[1.18] tracking-[-0.02em] text-white/90 sm:text-4xl md:text-5xl"
                />

                <AnimatePresence>
                  {bgActive && result?.core_insight?.central_conflict ? (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="mt-10 max-w-3xl text-sm text-white/55"
                    >
                      <span className="font-semibold text-white/70">
                        Central conflict:
                      </span>{" "}
                      {result.core_insight.central_conflict}
                    </motion.p>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {bgActive ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="mt-14 flex items-center gap-4 border-t border-white/10 pt-6"
                    >
                      <p className="text-sm text-white/45">
                        Scroll to learn.
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* spotlight sections */}
              <div className="mt-10">
                <SpotlightSection
                  eyebrow="Emotional trajectory"
                  delay={0.05}
                >
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <p className="text-sm text-white/75">
                      <span className="font-semibold text-white/85">
                        {result?.mood_arc?.primary_mood || "—"}
                      </span>
                      {result?.mood_arc?.emotional_quality
                        ? ` — ${result.mood_arc.emotional_quality}`
                        : ""}
                    </p>

                    {(result?.mood_arc?.stages || []).length > 0 ? (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {result.mood_arc.stages.map((s, idx) => (
                          <span
                            key={idx}
                            className="group relative rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/65 transition"
                          >
                            {s.stage}
                            <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-[0_0_24px_rgba(184,87,246,0.25)] transition group-hover:opacity-100" />
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-white/50">
                        Shape: {result?.mood_arc?.shape || "static"}
                      </p>
                    )}
                  </div>

                  {(result?.mood_arc?.stages || []).length > 0 ? (
                    <ol className="mt-5 space-y-4">
                      {result.mood_arc.stages.map((s, idx) => (
                        <li
                          key={idx}
                          className="text-sm leading-6 text-white/70"
                        >
                          <span className="font-semibold text-white/80">
                            {s.stage}:
                          </span>{" "}
                          {s.description}
                          {s.evidence_fragment ? (
                            <span className="text-white/45">
                              {" "}
                              — “{s.evidence_fragment}”
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </SpotlightSection>

                <SpotlightSection
                  eyebrow="Recurring images"
                  delay={0.05}
                >
                  <div className="flex flex-wrap gap-2">
                    {(result?.key_motifs || []).map((m, idx) => (
                      <span
                        key={idx}
                        className="group relative rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:bg-white/10"
                        title={m.role}
                      >
                        {m.motif}
                        <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-[0_0_24px_rgba(184,87,246,0.25)] transition group-hover:opacity-100" />
                      </span>
                    ))}
                  </div>

                  {(result?.key_motifs || []).length > 0 ? (
                    <div className="mt-6 space-y-4">
                      {result.key_motifs.map((m, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4"
                        >
                          <p className="text-sm font-semibold text-white/80">
                            {m.motif}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/65">
                            {m.role}
                          </p>
                          {m.evidence_fragment ? (
                            <p className="mt-2 text-xs text-white/45">
                              “{m.evidence_fragment}”
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </SpotlightSection>

                <SpotlightSection
                  eyebrow="Lines worth rereading"
                  delay={0.05}
                >
                  <div className="space-y-6">
                    {(result?.lyrical_highlights || []).map((h, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/10 bg-black/20 px-6 py-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                            {h.device}
                          </span>
                          {h.fragment ? (
                            <span className="text-xs text-white/45">
                              “{h.fragment}”
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/75">
                          {h.insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </SpotlightSection>

                <SpotlightSection
                  eyebrow="What it all means"
                  delay={0.05}
                >
                  <div className="rounded-[24px] border border-white/10 bg-white/3 px-6 py-6">
                    {result?.takeaway?.interpretation ? (
                      <p className="text-sm leading-6 text-white/75">
                        {result.takeaway.interpretation}
                      </p>
                    ) : null}
                    {result?.takeaway?.universal_hook ? (
                      <p className="mt-4 text-sm leading-6 text-white/60">
                        {result.takeaway.universal_hook}
                      </p>
                    ) : null}
                  </div>
                </SpotlightSection>

                <SpotlightSection eyebrow="Tags" delay={0.05}>
                  <div className="flex flex-wrap gap-2">
                    {(result?.ui_optimized?.tone_tags || []).map((t) => (
                      <span
                        key={`tone-${t}`}
                        className="group relative rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65 transition hover:bg-white/10"
                      >
                        {t}
                        <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-[0_0_24px_rgba(184,87,246,0.25)] transition group-hover:opacity-100" />
                      </span>
                    ))}
                    {(result?.ui_optimized?.theme_tags || []).map((t) => (
                      <span
                        key={`theme-${t}`}
                        className="group relative rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65 transition hover:bg-white/10"
                      >
                        {t}
                        <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-[0_0_24px_rgba(184,87,246,0.25)] transition group-hover:opacity-100" />
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-xs text-white/40">
                    Complexity: {result?.ui_optimized?.complexity_score ?? "—"} ·
                    Palette: {result?.ui_optimized?.color_palette ?? "—"}
                  </p>
                </SpotlightSection>
              </div>
            </>
          )}
        </div>
      </section>
    )}
  </div>
);
}

// helper functions
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ScrollIndicator({ enabled }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max <= 0 ? 0 : scrollTop / max;
      setPct(p);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed right-6 top-1/3 h-1/3 z-40 flex items-center justify-center">
      {/* centered vertical line - stays fixed on screen */}
      <div className="absolute inset-y-0 w-0.5 bg-white/15" />

      {/* bubble that moves up/down within the fixed line based on scroll */}
      <div
        className="absolute h-3 w-3 rounded-full bg-linear-to-tr from-lyra-purple to-lyra-pink shadow-[0_0_12px_rgba(184,87,246,0.4)]"
        style={{ top: `${pct * 100}%`, left: "50%", transform: "translateX(-50%)" }}
      />
    </div>
  );
}

/* subtle gradient field to make everything pop */
function AnimatedBackground({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    let raf = null;
    let mx = 0, my = 0;
    let x = 0, y = 0;

    const onMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx = (e.clientX / w - 0.5) * 55;
      my = (e.clientY / h - 0.5) * 45;
    };

    const tick = () => {
      x += (mx - x) * 0.08;
      y += (my - y) * 0.08;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_35%,rgba(0,0,0,0.72)_100%)]" />

      {/* rotating wash */}
      <div
        className={cx(
          "absolute -inset-40 opacity-0 transition-opacity duration-700",
          active && "opacity-100"
        )}
      >
        <div className="absolute inset-0 animate-[lyraSpin_40s_linear_infinite] blur-2xl"
          style={{
            background:
              "conic-gradient(from 180deg, rgba(184,87,246,0.10), rgba(247,130,208,0.08), rgba(141,165,243,0.08), rgba(184,87,246,0.10))",
          }}
        />
      </div>

      {/* blobs + parallax */}
      <div
        ref={ref}
        className={cx(
          "absolute -inset-24 opacity-0 transition-opacity duration-700",
          active && "opacity-100"
        )}
        style={{
          transform: active
            ? "translate3d(var(--mx, 0px), var(--my, 0px), 0)"
            : "translate3d(0,0,0)",
        }}
      >
        <div className="absolute left-[10%] top-[14%] h-140 w-140 rounded-full bg-[radial-gradient(circle_at_center,rgba(184,87,246,0.24)_0%,rgba(184,87,246,0)_65%)] blur-3xl animate-[lyraFloatA_18s_ease-in-out_infinite]" />
        <div className="absolute right-[8%] top-[30%] h-135 w-135 rounded-full bg-[radial-gradient(circle_at_center,rgba(247,130,208,0.20)_0%,rgba(247,130,208,0)_65%)] blur-3xl animate-[lyraFloatB_22s_ease-in-out_infinite]" />
        <div className="absolute left-[32%] bottom-[8%] h-160 w-160 rounded-full bg-[radial-gradient(circle_at_center,rgba(141,165,243,0.16)_0%,rgba(141,165,243,0)_70%)] blur-3xl animate-[lyraFloatC_26s_ease-in-out_infinite]" />

        {/* grain */}
        {active && (
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 0)",
              backgroundSize: "3px 3px",
              animation: "lyraGrain 6s steps(10) infinite",
            }}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes lyraSpin {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes lyraFloatA {
          0% { transform: translate3d(0px, 0px, 0) scale(1); }
          50% { transform: translate3d(18px, -14px, 0) scale(1.04); }
          100% { transform: translate3d(0px, 0px, 0) scale(1); }
        }
        @keyframes lyraFloatB {
          0% { transform: translate3d(0px, 0px, 0) scale(1); }
          50% { transform: translate3d(-14px, 16px, 0) scale(1.03); }
          100% { transform: translate3d(0px, 0px, 0) scale(1); }
        }
        @keyframes lyraFloatC {
          0% { transform: translate3d(0px, 0px, 0) scale(1); }
          50% { transform: translate3d(10px, 10px, 0) scale(1.05); }
          100% { transform: translate3d(0px, 0px, 0) scale(1); }
        }
        @keyframes lyraGrain {
          0% { transform: translate3d(0,0,0); }
          10% { transform: translate3d(-2%, -3%, 0); }
          20% { transform: translate3d(-4%, 2%, 0); }
          30% { transform: translate3d(3%, -4%, 0); }
          40% { transform: translate3d(2%, 3%, 0); }
          50% { transform: translate3d(-3%, 4%, 0); }
          60% { transform: translate3d(4%, -2%, 0); }
          70% { transform: translate3d(-2%, 4%, 0); }
          80% { transform: translate3d(-4%, -1%, 0); }
          90% { transform: translate3d(3%, 2%, 0); }
          100% { transform: translate3d(0,0,0); }
        }
      `}</style>
    </div>
  );
}

/** the type for big reveal */
function TypewriterText({
  text,
  start,
  speed = 16,
  onDone,
  className = "",
}) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplay("");
    setDone(false);
  }, [text]);

  useEffect(() => {
    if (!start || !text) return;

    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, start, speed]);

  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  return (
    <p className={cx("relative", className)}>
      {display}
      {/* cursor while typing */}
      {!done && start ? (
        <span className="ml-1 inline-block h-[1em] w-[0.55ch] translate-y-0.5 animate-pulse rounded-sm bg-white/70" />
      ) : null}
    </p>
  );
}

/* scroll reveal */
function SpotlightSection({ title, eyebrow, children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      className="relative py-10"
    >
      {/* spotlight aura */}
      <div className="pointer-events-none absolute left-1/2 top-8 h-65 w-195 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_68%)] blur-2xl" />

      <div className="relative mx-auto w-full max-w-3xl px-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h3 className="mt-2 text-sm font-semibold text-white/85">{title}</h3>
        ) : null}
        <div className="mt-4">{children}</div>
      </div>
    </motion.section>
  );
}