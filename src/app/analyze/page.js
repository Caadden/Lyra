"use client";

import { useEffect, useRef, useState } from "react";

const MOCK = {
  emotions: [
    { name: "nostalgic", intensity: 0.82 },
    { name: "hopeful", intensity: 0.64 },
    { name: "longing", intensity: 0.58 },
  ],
  themes: ["growth", "distance", "time", "acceptance"],
  tone: "bittersweet and reflective",
  summary: [
    "The speaker looks back on memories with warmth and regret.",
    "There’s tension between holding on and moving forward.",
    "The lyrics frame change as painful but necessary.",
  ],
  takeaway:
    "This song captures the ache of remembering while choosing to keep going.",
};

export default function AnalyzePage() {
  const [lyrics, setLyrics] = useState("");
  const [artist, setArtist] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const resultsRef = useRef(null);

  const charCount = lyrics.length;
  const tooLong = charCount > 8000;
  const canAnalyze = lyrics.trim().length > 0 && !tooLong && status !== "loading";

  const onAnalyze = async () => {
    if (!canAnalyze) return;

    // Reveal the results section, then smoothly scroll to it.
    setShowResults(true);
    setStatus("loading");
    setResult(null);

    // Wait a tick so the results container exists in the DOM before scrolling.
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Fake latency so you can see loading state.
    await new Promise((r) => setTimeout(r, 700));

    setResult(MOCK);
    setStatus("done");
  };

  // If user edits lyrics after a completed analysis, hide the previous results.
  useEffect(() => {
    if (status === "done") return;
    // no-op
  }, [status]);

  return (
    <main
      style={{
        padding: "3.5rem 1.25rem",
        maxWidth: 860,
        margin: "0 auto",
      }}
    >
      {/* INPUT SECTION */}
      <section style={{ minHeight: "82vh" }}>
        <h1 style={{ fontSize: 44, margin: 0, letterSpacing: -0.5 }}>
          Analyze
        </h1>
        <p style={{ marginTop: 10, color: "#555", lineHeight: 1.6 }}>
          Paste lyrics below. We won’t store anything, promise.
        </p>

        <label style={{ display: "block", marginTop: 22, fontWeight: 700 }}>
          Lyrics
        </label>
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Paste lyrics here…"
          rows={16}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 14,
            borderRadius: 16,
            border: "1px solid #ddd",
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        />

        <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
          <span style={{ color: tooLong ? "#b00020" : "#666" }}>
            {charCount.toLocaleString()}/8,000{tooLong ? " — too long" : ""}
          </span>
        </div>

        <label style={{ display: "block", marginTop: 18, fontWeight: 700 }}>
        Artist (optional)
        </label>
        <input
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        placeholder="Artist name"
        style={{
            width: "100%",
            marginTop: 10,
            padding: 12,
            borderRadius: 16,
            border: "1px solid #ddd",
            outline: "none",
            fontFamily: "inherit",
            fontSize: 14,
            }}
        />

        <button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          style={{
            marginTop: 22,
            padding: "12px 18px",
            borderRadius: 999,
            border: "1px solid #ddd",
            background: !canAnalyze ? "#f5f5f5" : "white",
            cursor: !canAnalyze ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          Analyze
        </button>
        </section>

      {/* RESULTS SECTION (hidden until Analyze is pressed) */}
      {showResults && (
        <section
          ref={resultsRef}
          style={{
            paddingTop: "2.5rem",
            paddingBottom: "4rem",
          }}
        >
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: 18,
              padding: 20,
              background: "white",
            }}
          >
            {status === "loading" && (
              <div style={{ color: "#666", lineHeight: 1.6 }}>
                <h2 style={{ marginTop: 0, fontSize: 18 }}>Analyzing…</h2>
                <p style={{ marginBottom: 0 }}>
                  Reading tone, themes, and emotional signals.
                </p>
              </div>
            )}

            {result && (
              <div style={{ lineHeight: 1.65 }}>
                <h2 style={{ marginTop: 0, fontSize: 18 }}>Results</h2>

                {/* Emotions */}
                <div style={{ marginTop: 14 }}>
                  <h3 style={{ fontSize: 14, marginBottom: 8 }}>Emotions</h3>
                  <div style={{ display: "grid", gap: 10 }}>
                    {result.emotions.map((e) => {
                      const pct = Math.round(
                        Math.max(0, Math.min(1, e.intensity)) * 100
                      );
                      return (
                        <div key={e.name}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 13,
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>{e.name}</span>
                            <span style={{ color: "#666" }}>{pct}%</span>
                          </div>
                          <div
                            style={{
                              height: 8,
                              borderRadius: 999,
                              background: "#f0f0f0",
                              overflow: "hidden",
                              marginTop: 6,
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${pct}%`,
                                background: "#111",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Themes */}
                <div style={{ marginTop: 18 }}>
                  <h3 style={{ fontSize: 14, marginBottom: 8 }}>Themes</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {result.themes.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 12,
                          padding: "6px 10px",
                          border: "1px solid #e6e6e6",
                          borderRadius: 999,
                          background: "#fafafa",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tone */}
                <div style={{ marginTop: 18 }}>
                  <h3 style={{ fontSize: 14, marginBottom: 8 }}>Tone</h3>
                  <p style={{ margin: 0 }}>{result.tone}</p>
                </div>

                {/* Summary */}
                <div style={{ marginTop: 18 }}>
                  <h3 style={{ fontSize: 14, marginBottom: 8 }}>Summary</h3>
                  <ul style={{ marginTop: 0 }}>
                    {result.summary.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Takeaway */}
                <div style={{ marginTop: 18 }}>
                  <h3 style={{ fontSize: 14, marginBottom: 8 }}>
                    Listener takeaway
                  </h3>
                  <p style={{ margin: 0 }}>{result.takeaway}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}