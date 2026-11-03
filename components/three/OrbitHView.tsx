"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const OrbitHCanvas = dynamic(() => import("./OrbitHCanvas"), {
  ssr: false,
});

export function OrbitHView({
  className,
  targetRotation = 0,
}: {
  className?: string;
  targetRotation?: number;
}) {
  const [canRender3D, setCanRender3D] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    const noReducedMotion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    let hasWebGL = false;
    try {
      const c = document.createElement("canvas");
      hasWebGL = !!(
        window.WebGLRenderingContext &&
        (c.getContext("webgl") || c.getContext("experimental-webgl"))
      );
    } catch {
      hasWebGL = false;
    }

    if (isDesktop && noReducedMotion && hasWebGL) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanRender3D(true);
      const t = setTimeout(() => setCanvasReady(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  // Convert radians to subtle degrees so the studio glass backdrop tracks the 3D rotation
  const deg = Math.round(((targetRotation * 180) / Math.PI) * 0.18);

  return (
    <div
      className={`relative h-full w-full select-none ${className || ""}`}
      aria-hidden="true"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient studio radial light pool */}
      <div
        className="pointer-events-none absolute inset-6 rounded-full opacity-80 blur-3xl transition-transform duration-700"
        style={{
          background:
            "radial-gradient(circle at 52% 48%, rgba(255, 90, 31, 0.34), rgba(255, 138, 92, 0.12) 45%, transparent 72%)",
          transform: `rotate(${deg}deg)`,
        }}
      />

      {/* Studio Raytraced Object Layer (always provides rich optical caustics) */}
      <div
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          canvasReady ? " scale-[0.96] opacity-85" : "scale-100 opacity-100"
        }`}
        style={{
          transform: `rotateY(${deg}deg) rotateZ(${deg * 0.25}deg)`,
        }}
      >
        <Image
          src="/images/hero/hero-orbit-object.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.75)]"
        />
      </div>

      {/* Real-time Interactive 3D WebGL Layer */}
      {canRender3D && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            canvasReady ? "opacity-55 mix-blend-screen" : "opacity-0"
          }`}
        >
          <OrbitHCanvas targetRotation={targetRotation} />
        </div>
      )}
    </div>
  );
}
