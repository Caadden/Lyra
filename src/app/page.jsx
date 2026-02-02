"use client";

import { Racing_Sans_One, Reddit_Sans } from "next/font/google";
import { useEffect, useState } from "react";
import PagePortal3D from "./components/PagePortal3D";

const redditSans = Reddit_Sans({ weight: "400", subsets: ["latin"] });
const racingSans = Racing_Sans_One({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);


  /* Prevent user from getting stuck in scroll loop */
  useEffect(() => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
}, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #18181b 0%, #18181b 80%, var(--color-lyra-gray) 100%)",
      }}
    >
      {/* Scroll Progress */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
        <div className="relative w-2 h-40 bg-white/20 rounded-full">
          <div
            className="absolute w-3 h-3 rounded-full -left-0.5 transition-all duration-200 ease-out bg-gradient-to-tr from-lyra-purple to-lyra-pink shadow-lg"
            style={{
              top: `${scrollProgress}%`,
              transform: "translateY(-50%)",
              boxShadow: "0 2px 8px rgba(184, 87, 246, 0.5)",
            }}
          />
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-6 md:px-12">
        {/* HERO */}
        <section className="min-h-[90vh] flex flex-col justify-center items-center text-center">
          <div className="relative">
            <h1
              className={`${racingSans.className} text-[clamp(8rem,20vw,18rem)] font-black leading-none tracking-tight bg-gradient-to-tr from-lyra-purple to-lyra-pink bg-clip-text text-transparent pb-4 pl-4 pt-4`}
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

          <div className="mt-10 max-w-2xl">
            <p
              className={`${redditSans.className} text-2xl md:text-2xl leading-tight text-zinc-300 font-bold`}
            >
              unlock the hidden meanings behind your favorite lyrics
            </p>
          </div>
        </section>

        {/* 3D Redirect */}
        <PagePortal3D redirectTo="/analyze" />
      </main>
    </div>
  );
}