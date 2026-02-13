"use client";

import { Racing_Sans_One, Reddit_Sans } from "next/font/google";
import { useTransition } from "./components/transition";

const redditSans = Reddit_Sans({ weight: "400", subsets: ["latin"] });
const racingSans = Racing_Sans_One({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const { transitionTo, busy } = useTransition();

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #18181b 0%, #18181b 80%, var(--color-lyra-gray) 100%)",
      }}
    >
      <main className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <section className="min-h-screen flex flex-col justify-center items-center text-center">
          <div className="relative">
            <h1
              className={`${racingSans.className} text-[clamp(8rem,20vw,18rem)] font-black leading-none tracking-tight bg-linear-to-tr from-lyra-purple to-lyra-pink bg-clip-text text-transparent pb-4 pl-4 pt-4`}
              style={{
                textShadow: `
                  -3px -3px 0 rgba(168, 85, 247, 0.4),
                  -6px -6px 0 rgba(168, 85, 247, 0.3),
                  -9px -9px 0 rgba(168, 85, 247, 0.2),
                  -12px -12px 0 rgba(168, 85, 247, 0.1)
                `,
              }}
            >
              lyra
            </h1>
          </div>

          <div className="mt-8 max-w-2xl">
            <p className={`${redditSans.className} text-2xl leading-tight text-zinc-300 font-bold`}>
              unlock the hidden meanings behind your favorite lyrics
            </p>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <button
              disabled={busy}
              onClick={() => transitionTo("/analyze")}
              className={[
                "rounded-2xl px-6 py-3 font-semibold text-zinc-900 bg-linear-to-tr from-lyra-purple to-lyra-pink active:scale-[0.99] transition-all",
                busy ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:opacity-90 hover:shadow-lg",
              ].join(" ")}
            >
              Analyze lyrics
            </button>

            <button
              onClick={() => transitionTo("/how-it-works")}
              className="rounded-2xl px-6 py-3 font-semibold text-zinc-200 border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 cursor-pointer transition-all"
            >
              How it works
            </button>
          </div>

          <p className="mt-6 text-sm text-zinc-400">No storage. Just close reading.</p>
        </section>
      </main>
    </div>
  );
}