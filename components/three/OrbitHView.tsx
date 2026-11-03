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
    // Only desktop >= 1024px, no reduced-motion, and WebGL support
    const isDesktop = window.innerWidth >= 1024;
    const noReducedMotion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    let hasWebGL = false;
    try {
      const c = document.createElement("canvas");
      hasWebGL = !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch {
      hasWebGL = false;
    }

    if (isDesktop && noReducedMotion && hasWebGL) {
      setCanRender3D(true);
      // Give a tiny frame for canvas to crossfade cleanly
      const t = setTimeout(() => setCanvasReady(true), 350);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div className={`relative h-full w-full select-none ${className || ""}`} aria-hidden="true">
      {/* Fallback / poster render */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          canvasReady ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src="/images/hero/hero-orbit-desktop.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
        />
      </div>

      {/* 3D Canvas */}
      {canRender3D && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            canvasReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <OrbitHCanvas targetRotation={targetRotation} />
        </div>
      )}
    </div>
  );
}
