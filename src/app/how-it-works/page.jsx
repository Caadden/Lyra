"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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

  const sectionIds = ["overview", "pipeline", "sections", "privacy", "faq"];
  const refs = useRef({});
  const [active, setActive] = useState("overview");
  const [bgActive, setBgActive] = useState(false);

  const scrollToSection = (id) => {
    const el = refs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onScroll = () => {
      const entries = sectionIds
        .map((id) => {
          const el = refs.current[id];
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
    <div
      className="relative min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #0b0c10 0%, #0b0c10 55%, rgba(66,69,73,0.55) 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatedBackground active={bgActive} />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-16 pb-24">
        <a href="/" className="fixed left-6 top-6 z-50 transition hover:opacity-80">
          <img src="/lyra-apple-touch-icon.png" alt="Lyra" className="h-6 w-6 rounded-xl" />
        </a>
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
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
          <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70 backdrop-blur">
            <span className="leading-none">thesis-driven</span>
          </span>
          <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70 backdrop-blur">
            evidence-anchored
          </span>
          <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70 backdrop-blur">
            slow reveal
          </span>
        </div>

        <div
          className="pointer-events-none mt-8 h-24 w-full rounded-[32px] blur-2xl"
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
                  <span className="font-semibold text-white/85">UI reveals:</span>{" "}
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
                  results are a lens, not a definitive meaning.
                </p>
                <p>
                  <span className="font-semibold text-white/85">Storage:</span>{" "}
                  We don’t store lyrics or analyses. Everything is processed in-memory and discarded after.
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
                  a="It helps the engine pick an appropriate analysis and avoid generic framing when the lyric is ambiguous."
                />
                <FAQ
                  q="Why do results vary between runs?"
                  a="The model is generative. You’ll get consistent structure, but wording and emphasis can change."
                />
                <FAQ
                  q="Why did Lyra say my lyrics were invalid?"
                  a="Usually because the text was too short, placeholder-y, or included mostly non-lyric junk."
                />
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
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
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      viewport={{ once: true, margin: "-14% 0px -12% 0px" }}
      className="relative rounded-[28px] p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(184,87,246,0.22), rgba(247,130,208,0.10), rgba(141,165,243,0.08))",
      }}
    >
      <div className="rounded-[27px] border border-white/10 bg-white/4 p-6 backdrop-blur-xl">
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
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      viewport={{ once: true, margin: "-14% 0px -12% 0px" }}
      className="relative rounded-[28px] p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(184,87,246,0.22), rgba(247,130,208,0.10), rgba(141,165,243,0.08))",
      }}
    >
      <div className="rounded-[27px] border border-white/10 bg-white/4 p-6 backdrop-blur-xl">
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
      `}</style>
    </div>
  );
}