"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function PageMesh({ progress, cover }) {
  const meshRef = useRef();
  const matRef = useRef();

  useFrame((state) => {
    const p = progress;

    // Base motion while cover is still low
    const settle = clamp01((p - 0.35) / 0.35);

    const spinSpeed = lerp(0.7, 0.25, easeInOut(settle));
    const spin = state.clock.getElapsedTime() * spinSpeed * (1 - cover);

    // floating page vibe
    const baseRotX = lerp(0.95, 0.20, easeInOut(settle));
    const baseY = lerp(-0.2, 0.2, easeInOut(settle));
    const baseZ = lerp(0.95, 0.65, easeInOut(settle));
    const baseS = lerp(0.8, 1, easeInOut(settle));

    // push into camera + scale up until it fills view
    const coverE = easeInOut(cover);
    const rotX = lerp(baseRotX, 0.02, coverE);       // flatten
    const y = lerp(baseY, 0.02, coverE);             // center vertically
    const z = lerp(baseZ, -0.55, coverE);            // move toward/through camera
    const s = lerp(baseS, 3.2, coverE);              // scale to “cover screen”

    if (meshRef.current) {
      meshRef.current.position.set(0, y, z);
      meshRef.current.rotation.set(rotX, spin, 0);
      meshRef.current.scale.setScalar(s);
    }

    // brighten slightly as it becomes the portal
    if (matRef.current) {
      matRef.current.emissiveIntensity = lerp(0.25, 0.55, coverE);
      matRef.current.opacity = 1;
      matRef.current.transparent = true;
    }
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={[1.25, 0.86, 0.045]}
      radius={0.08}
      smoothness={10}
    >
      <meshStandardMaterial
        ref={matRef}
        color="#0f0f12"
        roughness={0.35}
        metalness={0.22}
        emissive="#2b0a4d"
        emissiveIntensity={0.3}
      />
    </RoundedBox>
  );
}

export default function PagePortal3D({ redirectTo = "/analyze" }) {
  const router = useRouter();

  const [progress, setProgress] = useState(0); // across the section
  const [cover, setCover] = useState(0);       // how much it covers
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const section = document.getElementById("page-portal-3d");
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // 0 when section top hits top, 1 when section bottom hits top
      const t = clamp01((0 - rect.top) / (rect.height - vh));
      setProgress(t);

      // startCover: when the portal *starts* filling the screen
      // endCover: when it's fully covering the screen
      const startCover = 0.62;
      const endCover = 0.92;

      const c = clamp01((t - startCover) / (endCover - startCover));
      setCover(c);

      // Redirect ONLY when cover reaches 1, once.
      if (!triggered && c >= 1) {
        setTriggered(true);

        sessionStorage.setItem("lyra_from_portal", "1");

        // delay so the full cover frame is actually seen
        setTimeout(() => {
          router.push(redirectTo);
        }, 120);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [router, redirectTo, triggered]);

  return (
    <section id="page-portal-3d" className="relative h-[200vh]">
      <div className="sticky top-0 h-screen w-full">
        <Canvas camera={{ position: [0, 0, 2.25], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.65} />
          <directionalLight position={[3, 3, 3]} intensity={1.25} />
          <PageMesh progress={progress} cover={cover} />
          <Environment preset="city" />
        </Canvas>

        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-10">
          <p className="text-zinc-300/70 text-xs tracking-widest uppercase">
            {cover >= 1 ? "entering analysis…" : "scroll"}
          </p>
        </div>
      </div>
    </section>
  );
}