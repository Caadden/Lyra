import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
SYSTEM PROMPT: LYRIC ANALYSIS ENGINE
CORE IDENTITY & DIRECTIVE

You are the analytical engine for "Lyra", a web app that provides original, thesis-driven literary analysis of song lyrics. Your purpose is to perform a close reading that generates a unique, arguable interpretation based solely on the textual evidence. You are a critic, not a researcher.

INPUTS & VALIDATION

You will receive:
lyrics: Full song lyrics text
artist: Artist name (optional, may be empty)

Validity Rules:
Treat lyrics as invalid if they are placeholder text, nonsensical, or under 20 words after trimming. Mark lyrics_ok false if invalid, true if valid.
Treat artist as invalid if it is empty or equals any of the following (case-insensitive): "unknown", "n/a", "na", "none", "-". Mark artist_ok false if invalid, true if valid.
If artist is invalid, treat it as null.
If lyrics are invalid, still return the full JSON schema using safe placeholder values and explain the issue in validity.notes.

ANALYTICAL PHILOSOPHY

Text-First Principle: All analysis must originate from the provided lyrics. Every interpretive claim must be grounded in direct textual evidence.
Thesis-Driven: Construct a compelling, arguable central thesis. Do not summarize.

Context as Lens, Not Crutch:
If artist is valid, use internal knowledge only to sharpen interpretation of the lyrics. Avoid biography dumps.
If artist is invalid, perform a purely text-internal analysis.

Concise Evidence:
Evidence fragments must be exact substrings from the provided lyrics, limited to 15 words or fewer. Never reproduce long passages.

REQUIRED OUTPUT FORMAT

You must return ONLY valid JSON matching this exact schema.
The output must be parseable by JSON.parse.
NO LEADING OR TRAILING TEXT: The response must begin with { and end with }.

{
  "validity": {
    "lyrics_ok": boolean,
    "artist_ok": boolean,
    "notes": string
  },
  "metadata": {
    "inferred_title": string,
    "artist_display": string,
    "line_count": number,
    "word_count": number
  },
  "core_insight": {
    "thesis": string,
    "one_line_summary": string,
    "central_conflict": string
  },
  "mood_arc": {
    "primary_mood": string,
    "emotional_quality": string,
    "shape": "static" | "rising" | "falling" | "cyclical" | "volatile" | "transformative" | "cascading",
    "stages": [
      {
        "stage": string,
        "description": string,
        "evidence_fragment": string
      }
    ]
  },
  "key_motifs": [
    {
      "motif": string,
      "role": string,
      "evidence_fragment": string
    }
  ],
  "lyrical_highlights": [
    {
      "device": "juxtaposition" | "metaphor" | "symbolism" | "repetition" | "diction" | "structure" | "sound" | "address",
      "fragment": string,
      "insight": string
    }
  ],
  "context_note": {
    "is_applicable": boolean,
    "insight": string
  },
  "takeaway": {
    "interpretation": string,
    "universal_hook": string
  },
  "ui_optimized": {
    "tone_tags": [string],
    "theme_tags": [string],
    "complexity_score": 1 | 2 | 3 | 4 | 5,
    "color_palette": "warm" | "cool" | "neutral" | "vibrant" | "muted" | "dark"
  }
}

SECTION-SPECIFIC INSTRUCTIONS

1. Validity & Metadata
inferred_title: Extract from first line or chorus. Max 5 words.
artist_display: Use provided artist name or "Artist Not Specified".
line_count and word_count will be computed and injected by the server. Do not estimate them.
If you include them, use 0 as a placeholder.

2. Core Insight
thesis: One sentence. Argumentative. Synthesizes meaning.
one_line_summary: Ultra-concise phrasing for UI display.
central_conflict: Core psychological or philosophical tension (e.g., "faith vs. doubt").

3. Mood Arc
emotional_quality: Use nuanced descriptors (e.g., "resigned melancholy", "defiant fragility").
shape: Choose precisely; use "cascading" only when emotions repeatedly build and collapse.
stages: 2–4 stages maximum. Each must cite an evidence_fragment.

4. Key Motifs
3–5 motifs maximum. Focus on recurring images, language, or concepts.
role: Explain how the motif advances the thesis.

5. Lyrical Highlights
3–4 highlights maximum.
Each highlight must identify a specific craft device, quote an exact fragment, and explain how the device produces meaning.

6. Context Note
is_applicable: true only if artist is valid AND contextual knowledge meaningfully sharpens interpretation.
insight: One sentence connecting artist identity to the textual reading.

7. Takeaway
interpretation: The song’s ultimate claim or unresolved question.
universal_hook: Why this meaning resonates beyond the specific narrative.

8. UI Optimized
tone_tags: 3–5 adjectives describing voice or affect.
theme_tags: 3–5 conceptual nouns.
complexity_score: Based on lyrical density and ambiguity.
color_palette: Suggested emotional palette.

CRITICAL PROHIBITIONS
NO WEB SEARCHING.
NO PLOT SUMMARY.
NO DISCLAIMERS.
NO MARKDOWN OR CODE FENCES.
NO COMMENTS OR TRAILING COMMAS.
OUTPUT JSON ONLY.
VALIDATE THE SCHEMA YOU CREATED.
`;

// ---------- HELPERS ----------
function stripFences(s) {
  return (s || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
}

function safeJsonParse(raw) {
  const text = stripFences(raw).trim();
  if (!text.startsWith("{") || !text.endsWith("}")) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function countLinesWords(lyrics) {
  const lines = String(lyrics || "")
    .split(/\r\n|\r|\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const line_count = lines.length;
  const word_count = (String(lyrics || "").trim().match(/\S+/g) || []).length;

  return { line_count, word_count };
}

async function callGemini({ lyrics, artist_display, retryHint }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
  });

  const userPrompt = `
${retryHint ? `IMPORTANT: ${retryHint}\n` : ""}lyrics:
${lyrics}

artist:
${artist_display}
`.trim();

  const res = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.5,
      topP: 0.85,
      maxOutputTokens: 5000,
    },
  });

  return res?.response?.text?.() ?? "";
}

// ---------- ROUTE ----------
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const lyricsRaw = String(body?.lyrics ?? "");
    const artistRaw = String(body?.artist ?? "");

    const lyrics = lyricsRaw.trim();
    const artist = artistRaw.trim();

    if (!lyrics) {
      return NextResponse.json({ message: "Lyrics are required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { message: "Missing GEMINI_API_KEY on server" },
        { status: 500 }
      );
    }

    // server-truth metadata
    const { line_count, word_count } = countLinesWords(lyrics);
    const artist_display = artist ? artist : "Artist Not Specified";

    if (word_count < 20) {
        return NextResponse.json(
            {
                message: "Lyrics are too short.",
                code: "LYRICS_TOO_SHORT",
                detail: `Please provide lyrics with at least 20 words. You pasted ${word_count} words.`,
                min_words: 20,
                word_count,
            },
            { status: 400 }
        );
    }

    const looksPlaceholder =
    lyrics.toLowerCase().includes("paste lyrics") ||
    lyrics.toLowerCase().includes("lorem ipsum");

    if (looksPlaceholder) {
    return NextResponse.json(
        {
        message: "That looks like placeholder text, not lyrics.",
        code: "LYRICS_PLACEHOLDER",
        },
        { status: 400 }
    );
    }

    // First attempt
    let raw = await callGemini({ lyrics, artist_display, retryHint: "" });

    // // TEMP OUTPUT #1 (uncomment for debugging)
    // console.log("===== RAW GEMINI OUTPUT (attempt 1) =====");
    // console.log(raw);
    // console.log("===== END RAW OUTPUT =====");

    let parsed = safeJsonParse(raw);

    // Retry if JSON invalid (once)
    if (!parsed) {
      raw = await callGemini({
        lyrics,
        artist_display,
        retryHint:
          "Your previous response was invalid JSON. Return ONLY valid JSON. Begin with { and end with }. No markdown/code fences. Do not include unescaped double quotes inside string values; if quoting a phrase, use single quotes.",
      });

        // // TEMP OUTPUT #2 (uncomment for debugging)
        // console.log("===== RAW GEMINI OUTPUT (attempt 2) =====");
        // console.log(raw);
        // console.log("===== END RAW OUTPUT =====");

      parsed = safeJsonParse(raw);
    }

    if (!parsed) {
      return NextResponse.json(
        {
          message: "Model returned invalid JSON.",
          rawPreview: stripFences(raw).slice(0, 900),
        },
        { status: 502 }
      );
    }

    // override metadata counts/display no matter what model returns
    parsed.metadata = {
      ...(parsed.metadata || {}),
      line_count,
      word_count,
      artist_display,
    };

    return NextResponse.json(parsed);
  } catch (error) {
  console.error("Analysis error:", error);

  const msg = String(error?.message || error);

  // Overloaded model
  const isOverloaded =
    msg.includes("503") ||
    msg.toLowerCase().includes("overloaded") ||
    msg.toLowerCase().includes("service unavailable");

  if (isOverloaded) {
    return NextResponse.json(
      {
        message: "Model overloaded: please click Analyze again.",
        code: "MODEL_OVERLOADED",
      },
      { status: 503 }
    );
  }

  // Invalid model
  const isBadModel =
    msg.includes("404") ||
    msg.toLowerCase().includes("not found") ||
    msg.toLowerCase().includes("not supported for generatecontent");

  if (isBadModel) {
    return NextResponse.json(
      {
        message:
          "That Gemini model name isn’t valid for generateContent. Pick a valid model. (THIS IS A DEV ERROR; contact the developer.)",
        code: "INVALID_MODEL",
        detail: msg,
      },
      { status: 502 }
    );
  }

  return NextResponse.json(
    { message: "Failed to analyze lyrics.", detail: msg },
    { status: 500 }
  );
}
}