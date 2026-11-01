========================================

**Lyra** - [View How it Works!](https://trylyra.vercel.app/how-it-works)

A thesis-driven lyric analysis engine.

========================================

**Overview**

I noticed throughout my experiences viewing most lyric analysis online is that they're either surface level, super academic-based, or entirely opinionated.

I made Lyra for people who want brief summaries while still understanding motifs and lyrical complexity.

========================================

**How It Works**

I made Lyra work by taking in an input of lyrics, getting rid of any placeholder words or things that aren't lyrical, and then it outputs a structured response using DeepSeek's AI API that looks somewhat like the following:

<pre>Returns:

{

  "core_insight": {},
  
  "mood_arc": {},
  
  "key_motifs": [],
  
  "lyrical_highlights": [],
  
  "takeaway": {},
  
  "ui_optimized": {}
  
}</pre>

========================================

**Tech Stack**

Frontend
Next.js (App Router)
React
TailwindCSS
Framer Motion
Backend
Next.js API Routes
DeepSeek API (LLM inference)
Architecture Principles
Stateless processing (no lyric storage)
Abortable requests
Structured AI output
Prompt-injection mitigation
UI-driven emotional pacing


========================================

**Privacy & Storage**

Lyra doesn't store anything anywhere, and also doesn't use any server/database. However, everything is processed through DeepSeek's API, and I make that explicit in our How it Works section.

========================================

**Complexity Scoring**

Lyra assigns a complexity score based on a variety of factors that go into lyricism.
I just want to state that this score is purely for fun and in no way realistically interprets musical depth.
Some main things it looks for is layering of lyrics, density of metaphors, ambiguity, emotional feeling, and motifs.

========================================

**Future Directions**

I would love to eventually have artist theme profiles, shareable links for memorable analyses, interpretation modes that influence the output if you have knowledge of an artist/song, among others.

========================================

**Why Lyra Exists**

Lyra started as a passion project exploring how AI can enhance literary interpretation. I know that music has an unmistakable amount of layering, and I wanted to make it more visible for people who cared.
