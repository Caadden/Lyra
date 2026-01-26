"use client";

import { useRef, useState } from "react";

export default function AnalyzePage() {
  const [lyrics, setLyrics] = useState("");
  const [artist, setArtist] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const resultsRef = useRef(null);

  const charCount = lyrics.length;
  const tooLong = charCount > 8000;
  const canAnalyze =
    lyrics.trim().length > 0 && !tooLong && status !== "loading";

  const onAnalyze = async () => {
    if (!canAnalyze) return;

    setShowResults(true);
    setStatus("loading");
    setResult(null);

    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics, artist }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Analysis failed.");
      }

      setResult(data);
      setStatus("done");
    } catch (e) {
      setResult({
        error: e?.message || "Something went wrong.",
        core_insight: { thesis: "", one_line_summary: "", central_conflict: "" },
        mood_arc: { primary_mood: "", emotional_quality: "", shape: "static", stages: [] },
        key_motifs: [],
        lyrical_highlights: [],
        takeaway: { interpretation: "", universal_hook: "" },
        ui_optimized: { tone_tags: [], theme_tags: [], complexity_score: 1, color_palette: "neutral" },
      });
      setStatus("done");
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pt-14 pb-20">
      {/* INPUT SECTION */}
      <section className="min-h-[82vh]">
        <h1 className="text-4xl font-semibold tracking-tight">Analyze</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Paste lyrics below. We won’t store anything, promise.
        </p>

        <label className="mt-7 block text-sm font-semibold text-neutral-900">
          Lyrics
        </label>
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Paste lyrics here…"
          rows={16}
          className="mt-2 w-full resize-y rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-6 text-neutral-900 outline-none focus:border-neutral-400"
        />

        <div className="mt-2 flex items-center gap-3">
          <span className={`text-xs ${tooLong ? "text-red-600" : "text-neutral-500"}`}>
            {charCount.toLocaleString()}/8,000{tooLong ? " — too long" : ""}
          </span>
        </div>

        <label className="mt-5 block text-sm font-semibold text-neutral-900">
          Artist <span className="font-normal text-neutral-500">(optional)</span>
        </label>
        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist name"
          className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-400"
        />

        <button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={[
            "mt-6 inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold",
            canAnalyze
              ? "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 active:scale-[0.99]"
              : "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400",
          ].join(" ")}
        >
          {status === "loading" ? "Analyzing…" : "Analyze"}
        </button>
      </section>

      {/* RESULTS SECTION */}
      {showResults && (
        <section ref={resultsRef} className="pt-10">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            {status === "loading" && (
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  Analyzing…
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  Reading motifs, mood shifts, and lyrical craft.
                </p>
              </div>
            )}

            {result && status === "done" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-base font-semibold text-neutral-900">
                    Results
                  </h2>
                  {result?.error && (
                    <p className="mt-2 text-sm text-red-600">{result.error}</p>
                  )}
                </div>

                {/* Core Insight */}
                <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Core insight
                  </h3>
                  {result?.core_insight?.one_line_summary && (
                    <p className="mt-2 text-sm font-semibold text-neutral-800">
                      {result.core_insight.one_line_summary}
                    </p>
                  )}
                  {result?.core_insight?.thesis && (
                    <p className="mt-3 text-sm leading-6 text-neutral-800">
                      {result.core_insight.thesis}
                    </p>
                  )}
                  {result?.core_insight?.central_conflict && (
                    <p className="mt-3 text-xs text-neutral-600">
                      Central conflict:{" "}
                      <span className="font-semibold text-neutral-800">
                        {result.core_insight.central_conflict}
                      </span>
                    </p>
                  )}
                </section>

                {/* Mood Arc */}
                <section className="rounded-2xl border border-neutral-200 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Mood arc
                    </h3>
                    {result?.mood_arc?.shape && (
                      <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
                        {result.mood_arc.shape}
                      </span>
                    )}
                  </div>

                  {(result?.mood_arc?.primary_mood ||
                    result?.mood_arc?.emotional_quality) && (
                    <p className="mt-2 text-sm text-neutral-800">
                      <span className="font-semibold">
                        {result?.mood_arc?.primary_mood || ""}
                      </span>
                      {result?.mood_arc?.emotional_quality
                        ? ` — ${result.mood_arc.emotional_quality}`
                        : ""}
                    </p>
                  )}

                  {(result?.mood_arc?.stages || []).length > 0 && (
                    <ol className="mt-4 space-y-3">
                      {(result?.mood_arc?.stages || []).map((s, idx) => (
                        <li key={idx} className="text-sm leading-6 text-neutral-800">
                          <span className="font-semibold">{s.stage}:</span>{" "}
                          {s.description}
                          {s.evidence_fragment ? (
                            <span className="text-neutral-500">
                              {" "}
                              — “{s.evidence_fragment}”
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  )}
                </section>

                {/* Key Motifs */}
                <section>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Key motifs
                  </h3>
                  <div className="mt-3 grid gap-3">
                    {(result?.key_motifs || []).map((m, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-neutral-200 bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-neutral-900">
                            {m.motif}
                          </p>
                          {m.evidence_fragment ? (
                            <span className="shrink-0 text-xs text-neutral-500">
                              “{m.evidence_fragment}”
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-neutral-700">
                          {m.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Lyrical Highlights */}
                <section>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Lyrical highlights
                  </h3>
                  <div className="mt-3 grid gap-3">
                    {(result?.lyrical_highlights || []).map((h, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-neutral-200 bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                            {h.device}
                          </span>
                          {h.fragment ? (
                            <span className="shrink-0 text-xs text-neutral-500">
                              “{h.fragment}”
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-neutral-800">
                          {h.insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Takeaway */}
                <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Takeaway
                  </h3>
                  {result?.takeaway?.interpretation && (
                    <p className="mt-2 text-sm leading-6 text-neutral-800">
                      {result.takeaway.interpretation}
                    </p>
                  )}
                  {result?.takeaway?.universal_hook && (
                    <p className="mt-3 text-sm leading-6 text-neutral-700">
                      {result.takeaway.universal_hook}
                    </p>
                  )}
                </section>

                {/* Tags */}
                <section>
                  <h3 className="text-sm font-semibold text-neutral-900">Tags</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(result?.ui_optimized?.tone_tags || []).map((t) => (
                      <span
                        key={`tone-${t}`}
                        className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700"
                      >
                        {t}
                      </span>
                    ))}
                    {(result?.ui_optimized?.theme_tags || []).map((t) => (
                      <span
                        key={`theme-${t}`}
                        className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-xs text-neutral-500">
                    Complexity: {result?.ui_optimized?.complexity_score ?? "—"} ·
                    Palette: {result?.ui_optimized?.color_palette ?? "—"}
                  </p>
                </section>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
