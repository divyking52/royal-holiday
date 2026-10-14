"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SESSION_KEY = "rh_loader_seen";

export function CinematicLoader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }

    if (seen || reduced) return;

    setVisible(true);
    const start = performance.now();
    const duration = 1100;
    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      window.setTimeout(() => setVisible(false), 280);
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else finish();
    };

    raf = requestAnimationFrame(tick);
    const safety = window.setTimeout(finish, 1800);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ivory"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          role="status"
          aria-label="Loading"
        >
          <p className="text-2xl font-semibold tracking-tight text-ink">
            Royal Holiday
          </p>
          <div className="mt-10 h-1 w-40 overflow-hidden rounded-full bg-sand-deep">
            <motion.div
              className="h-full origin-left rounded-full bg-ocean"
              style={{ scaleX: progress / 100 }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
