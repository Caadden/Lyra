"use client";

import { useEffect, useRef } from "react";
import { clsx as cx } from "clsx";

export default function AnimatedBackground({ active }) {
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