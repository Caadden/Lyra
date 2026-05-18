"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";

const SECTION_IDS = ["overview", "pipeline", "sections", "privacy", "why_choose_lyra", "faq"];

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Input + validation",
      desc: "We check for real lyrical content, trim junk, and reject placeholders.",
    },
    {
      title: "Structure cleanup",
      desc: "Section headers like [Chorus] are ignored so the reading stays about the text.",
    },
    {
      title: "Close reading",
      desc: "Lyra generates a thesis-driven interpretation grounded in evidence fragments.",
    },
    {
      title: "Structured output",
      desc: "The response is returned in a consistent schema (thesis, motifs, arc, highlights).",
    },
    {
      title: "UI reveal",
      desc: "The page types the core insight, then progressively reveals the rest.",
    },
  ];

  const refs = useRef({});
  const [active, setActive] = useState("overview");
  const [bgActive, setBgActive] = useState(false);
  const [flashDeepSeek, setFlashDeepSeek] = useState(false);

  const scrollToSection = (id) => {
    const el = refs.current[id] || document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
  // only flash when coming from the asterisk
  const params = new URLSearchParams(window.location.search);
  const fromAsterisk = params.get("from") === "privacyAsterisk";
  const hashId = window.location.hash?.slice(1);

  if (!fromAsterisk || hashId !== "privacy") return;

  // wait a tick so layout settles, then flash
  const t1 = setTimeout(() => {
    setFlashDeepSeek(true);

    // update URL to remove query and asterisk while keeping the hash
    window.history.replaceState({}, "", "/how-it-works#privacy");

    const t2 = setTimeout(() => setFlashDeepSeek(false), 2000);
    return () => clearTimeout(t2);
  }, 450);

  return () => clearTimeout(t1);
}, []);

  useEffect(() => {
    const onScroll = () => {
      const entries = SECTION_IDS
        .map((id) => {
          const el = refs.current[id] || document.getElementById(id);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const score = Math.abs(r.top - window.innerHeight * 0.22);
          return { id, score };
        })
        .filter(Boolean);

      entries.sort((a, b) => a.score - b.score);
      if (entries[0]?.id) setActive(entries[0].id);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <div
      className="relative min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #0b0c10 0%, #0b0c10 55%, rgba(66,69,73,0.55) 100%)",
      }}
    >
      <AnimatedBackground active={bgActive} />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-16 pb-24">
        <a href="/" className="fixed left-6 top-6 z-50 transition hover:opacity-80">
          <img src="/lyra-apple-touch-icon.png" alt="Lyra" className="h-6 w-6 rounded-xl" />
        </a>
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
            Lyra
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            How it works
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
            Lyra is a close-reading engine: it generates a thesis-driven interpretation
            of lyrics using the text you provide.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70"
          >
            <span className="leading-none">emotional quality</span>
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70"
          >
            evidence-anchored
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70"
          >
            expressive reveal
          </motion.span>
        </div>

        <div
          className="pointer-events-none mt-15 h-24 w-full rounded-[32px] blur-2xl"
          style={{
            background:
              "radial-gradient(circle at 20% 40%, rgba(184,87,246,0.22), transparent 55%), radial-gradient(circle at 55% 20%, rgba(247,130,208,0.18), transparent 55%), radial-gradient(circle at 85% 60%, rgba(141,165,243,0.16), transparent 55%)",
          }}
        />
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          <div className="sticky top-24 hidden h-fit lg:block">
            <div className="rounded-3xl border border-white/10 bg-white/4 p-4 backdrop-blur-xl">
              <NavLink
                label="Overview"
                id="overview"
                active={active}
                onClick={() => scrollToSection("overview")}
              />
              <NavLink
                label="Pipeline"
                id="pipeline"
                active={active}
                onClick={() => scrollToSection("pipeline")}
              />
              <NavLink
                label="Result sections"
                id="sections"
                active={active}
                onClick={() => scrollToSection("sections")}
              />
              <NavLink
                label="Privacy & limits"
                id="privacy"
                active={active}
                onClick={() => scrollToSection("privacy")}
              />
              <NavLink
                label="Why Lyra?"
                id="why_choose_lyra"
                active={active}
                onClick={() => scrollToSection("why_choose_lyra")}
              />
              <NavLink
                label="FAQ"
                id="faq"
                active={active}
                onClick={() => scrollToSection("faq")}
              />
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
            {[
              ["Overview", "overview"],
              ["Pipeline", "pipeline"],
              ["Sections", "sections"],
              ["Privacy", "privacy"],
              ["Why Lyra?", "why_choose_lyra"],
              ["FAQ", "faq"],
            ].map(([label, id]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={cx(
                  "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur",
                  active === id && "bg-white/10 text-white"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* content */}
          <div className="space-y-10">
            <Section
              setRef={(el) => (refs.current.overview = el)}
              title="Overview"
              id="overview"
              eyebrow="What you’re getting"
            >
              <ul className="space-y-3 text-sm leading-6 text-white/70">
                <li>
                  <span className="font-semibold text-white/85">Thesis-first:</span>{" "}
                  a central claim about what the song is doing.
                </li>
                <li>
                  <span className="font-semibold text-white/85">Evidence-linked:</span>{" "}
                  motifs and highlights quote fragments as anchors.
                </li>
                <li>
                  <span className="font-semibold text-white/85">UI reveal:</span>{" "}
                  the “core insight” lands first, then the reading unfolds.
                </li>
              </ul>
            </Section>

            <Section
            setRef={(el) => (refs.current.pipeline = el)}
            title="Pipeline"
            id="pipeline"
            eyebrow="From paste → interpretation"
          >
            <PipelineRail steps={steps} />
          </Section>

            <Section
              setRef={(el) => (refs.current.sections = el)}
              title="Result sections"
              id="sections"
              eyebrow="What each part means"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoCard
                  title="Core Insight"
                  desc="The thesis (the arguable claim) + optional central conflict."
                />
                <InfoCard
                  title="Emotional Trajectory"
                  desc="The mood arc: how feeling evolves across the lyric’s movement."
                />
                <InfoCard
                  title="Recurring Images"
                  desc="Motifs + what they represent, with evidence fragments when possible."
                />
                <InfoCard
                  title="Lines worth rereading"
                  desc="Highlight lines + the rhetorical device + why it matters."
                />
                <InfoCard
                  title="What it all means"
                  desc="Interpretation + universal hook (why it resonates beyond the song)."
                />
                <InfoCard
                  title="Tags"
                  desc="UI tags used for tone/theme labeling and future discovery features."
                />
              </div>
            </Section>

            <MiniDemo onDone={() => setBgActive(true)} />

            <Section
              setRef={(el) => (refs.current.privacy = el)}
              title="Privacy & limits"
              id="privacy"
              eyebrow="Trust"
            >
              <div className="space-y-4 text-sm leading-6 text-white/70">
                <p>
                  <span className="font-semibold text-white/85">Research:</span>{" "}
                  Lyra pulls basic information about the artist to curate tone and provide a more accurate analysis.
                </p>
                <p>
                  <span className="font-semibold text-white/85">Interpretation:</span>{" "}
                  Results are a lens, not a definitive meaning.
                </p>
                <p>
                  <span className="font-semibold text-white/85">Privacy:</span>{" "}
                  <span
                    className={[
                      "rounded-md px-1 transition",
                      flashDeepSeek
                        ? "bg-yellow-400/20 ring-1 ring-yellow-300/40"
                        : ""
                    ].join(" ")}
                  >
                    We use DeepSeek's API to analyze, so be cautious putting in sensitive information to Lyra.
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-white/85">Storage:</span>{" "}
                  We don’t store lyrics or analyses. Everything is processed in-memory and discarded after.
                </p>
              </div>
            </Section>

            <Section
              setRef={(el) => (refs.current.why_choose_lyra = el)}
              title="Why Lyra?"
              id="why_choose_lyra"
              eyebrow="The vision"
            >
              <div className="mt-6 space-y-4">
                <p className="text-sm leading-6 text-white/75">
                  Most lyric analysis online is either surface-level or buried in confusing language. Lyra was made to provide insightful and emotional analyses of songs in a way that’s accessible to anyone who loves music.
                </p>
                <p className="text-sm leading-6 text-white/75">
                  <span className="font-semibold text-white/85">Inspiration:</span> I've always been infatuated with the undertones of academic and prose writing, and I think music has the same idea a lot of the time. I made Lyra to help myself and others find those undertones more easily.
                </p>
                <p className="text-sm leading-6 text-white/75">
                  <span className="font-semibold text-white/85">My Passion:</span> Lyra was largely a passion project that became something I was really proud of. Part of the reason that music is so special is because of the different meanings you can always find and resonate with, and I hope Lyra helps others find those like it helps me.
                </p>
              </div>
            </Section>

            <Section
              setRef={(el) => (refs.current.faq = el)}
              title="FAQ"
              id="faq"
              eyebrow="Quick answers"
            >
              <div className="mt-6 space-y-4">
                <FAQ
                  q="Why is artist recommended?"
                  a="It helps the engine pick an appropriate analysis and avoid generic framing when the lyric is ambiguous. We also found in our testing that it heavily improves analysis."
                />
                <FAQ
                  q="Why do results vary between runs?"
                  a="The model is generative. You’ll get consistent structure, but wording and emphasis can change."
                />
                <FAQ
                  q="Why did Lyra say my lyrics were invalid?"
                  a="We try to prevent the analysis of inputs that aren’t really lyrics, since the engine is designed for lyrical content and can produce weird results when given something else."
                />
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>

    <SuggestionBubble />
  </>
  );
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function MiniDemo({ onDone }) {
  const sample =
    "The speaker turns longing into architecture—building a version of love that can survive what keeps collapsing.";

  const [text, setText] = useState("");
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const run = () => {
    if (running) return;

    // reset
    setText("");
    setRunning(true);

    let i = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      i += 1;
      setText(sample.slice(0, i));

      if (i >= sample.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setRunning(false);
        onDone?.();
      }
    }, 14);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      viewport={{ once: true, margin: "-14% 0px -12% 0px" }}
      className="relative rounded-[28px] p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(184,87,246,0.22), rgba(247,130,208,0.10), rgba(141,165,243,0.08))",
      }}
    >
      <div className="rounded-[27px] border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            Demo
          </p>
        <h3 className="mt-2 text-xl font-semibold text-white/90">
          The “core insight” moment
        </h3>

        <div className="mt-5 rounded-3xl bg-black/25 px-5 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
          <p className="text-sm leading-6 text-white/80">
            {text || (
              <span className="text-white/35">Click run to see the type.</span>
            )}
            {running ? (
              <span className="ml-1 inline-block h-[1em] w-[0.55ch] translate-y-0.5 animate-pulse rounded-sm bg-white/70" />
            ) : null}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={run}
            disabled={running}
            className={[
              "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur transition",
              "border-white/10 bg-white/6 text-white/80 hover:bg-white/10 hover:text-white",
              running && "opacity-60",
            ].join(" ")}
          >
            {running ? "Running…" : "Run demo"}
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function PipelineRail({ steps }) {
  return (
    <div className="relative pl-10">
      {/* rail */}
      <div className="pointer-events-none absolute left-4 top-2 bottom-2 w-px bg-white/10" />

      <div className="space-y-4">
        {steps.map((s, i) => (
          <div key={i} className="relative">

            <div className="rounded-3xl border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-sm font-semibold text-white/85">
                <span className="mr-2 text-white/45 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/65">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NavLink({ label, id, active, onClick }) {
  const isActive = active === id;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "true" : "false"}
      className={cx(
        "group relative block w-full rounded-2xl px-3 py-2 text-left text-sm transition",
        isActive
          ? "bg-white/10 text-white"
          : "text-white/55 hover:bg-white/5 hover:text-white/80"
      )}
    >
      {/* left accent */}
      <span
        className={cx(
          "absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-full opacity-0 transition",
          isActive && "opacity-100"
        )}
        style={{
          background:
            "linear-gradient(to bottom, rgba(184,87,246,1), rgba(247,130,208,1))",
          boxShadow: "0 0 16px rgba(184,87,246,0.35)",
        }}
      />
      <span className="pl-2">{label}</span>
    </button>
  );
}

function Section({ title, eyebrow, children, id, setRef }) {
  return (
    <motion.section
      id={id}
      ref={setRef}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      viewport={{ once: true, margin: "-14% 0px -12% 0px" }}
      className="relative rounded-[28px] p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(184,87,246,0.20), rgba(247,130,208,0.10), rgba(141,165,243,0.08))",
      }}
    >
      <div className="rounded-[27px] border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white/90">{title}</h2>
        <div className="mt-5">{children}</div>
      </div>
    </motion.section>
  );
}

function InfoCard({ title, desc }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 px-5 py-4">
      <p className="text-sm font-semibold text-white/85">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{desc}</p>
    </div>
  );
}

function FAQ({ q, a }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 px-5 py-4">
      <p className="text-sm font-semibold text-white/85">{q}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{a}</p>
    </div>
  );
}

function SuggestionBubble() {
  const [open, setOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestion }),
      });

      if (response.ok) {
        setSuggestion("");
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const content = (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-xl border-white/20 bg-linear-to-br from-lyra-purple/30 to-lyra-pink/20 shadow-lg transition hover:border-white/40 hover:from-lyra-purple/40 hover:to-lyra-pink/30"
          aria-label="Open suggestion form"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-white/80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </button>
      ) : (
        <div className="w-80 rounded-4xl border border-white/10 bg-white/6 p-4 shadow-lg backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Send a suggestion</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-white/50 transition hover:text-white/80"
              aria-label="Close suggestion form"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="text-3xl">✨</div>
              <p className="text-center text-sm text-white/80">Thanks for the feedback!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="What could Lyra do better?"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 placeholder-white/30 transition focus:border-white/20 focus:bg-black/40 focus:outline-none focus:ring-0"
                rows={3}
              />
              <button
                type="submit"
                disabled={isLoading || !suggestion.trim()}
                className="w-full rounded-lg bg-linear-to-r from-lyra-purple/80 to-lyra-pink/80 px-3 py-2 text-xs font-semibold text-white transition hover:from-lyra-purple hover:to-lyra-pink disabled:opacity-50"
              >
                {isLoading ? "Sending…" : "Send"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );

  return createPortal(content, document.body);
}