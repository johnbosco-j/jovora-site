"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Emote, RobotHandle, RobotState } from "@/lib/robot/scene";
import { gyroNeedsPermission, requestGyro, shakeEnergy, startTilt, tiltX, tiltY } from "@/lib/tilt";

type Mascot = {
  name: string;
  role: string;
  greeting: string;
  touchGreeting: string;
  clicks: { emote: Emote; says: string }[];
  states: Record<string, string>;
};

/**
 * Riv — the interactive mascot, presented as a small "companion console":
 * HUD frame, live status, and a speech bubble that explains whichever point is active.
 *
 *  - Laptop: gaze follows the cursor anywhere; a quick flick surprises it; leaving the
 *    window makes it sad; clicking cycles gestures.
 *  - Phone: gaze follows tilt (or touch); the parent drives `active` as points scroll by.
 *  - Nobody interacting: it glances around and nods occasionally.
 *  - Reduced motion: one still pose, bubble text still updates.
 */
export function RobotStage({
  mascot,
  active,
}: {
  mascot: Mascot;
  /** The point currently being discussed (emote + line), or null. */
  active: { emote: Emote; says: string } | null;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const robot = useRef<RobotHandle | null>(null);
  const clickIndex = useRef(0);
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [touch, setTouch] = useState(false);
  const [state, setState] = useState<RobotState>("idle");
  const [watching, setWatching] = useState(false);
  const [line, setLine] = useState<string | null>(null);

  // Lazy-load three.js + the model only when the section approaches.
  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    let cancelled = false;
    const near = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        setStatus("loading");
        try {
          const { createRobot } = await import("@/lib/robot/scene");
          const handle = await createRobot(el, { still: !!reduce, onState: (s) => setState(s) });
          if (cancelled) return handle.dispose();
          robot.current = handle;
          setStatus("ready");
        } catch {
          if (!cancelled) setStatus("error");
        }
      },
      { rootMargin: "800px 0px" },
    );
    near.observe(el);
    return () => {
      cancelled = true;
      near.disconnect();
      robot.current?.dispose();
      robot.current = null;
    };
  }, [reduce]);

  // Render only while visible; wave hello the first time it's seen.
  useEffect(() => {
    const el = stage.current;
    if (!el || status !== "ready") return;
    let visible = false;
    let greeted = false;
    const sync = () => robot.current?.setActive(visible && !document.hidden);
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        sync();
        if (visible && !greeted) {
          greeted = true;
          // Say hello — unless a point is already being discussed.
          setTimeout(() => !activeRef.current && robot.current?.emote("Wave"), 250);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [status]);

  // Pointer / tilt → gaze and moods.
  useEffect(() => {
    if (status !== "ready" || reduce) return;
    const el = stage.current!;
    const fine = window.matchMedia("(pointer: fine)").matches;
    requestAnimationFrame(() => setTouch(!fine));
    const cleanups: (() => void)[] = [];
    let quiet: ReturnType<typeof setTimeout> | undefined;
    const noteActivity = () => {
      setWatching(true);
      clearTimeout(quiet);
      quiet = setTimeout(() => setWatching(false), 2500);
    };
    cleanups.push(() => clearTimeout(quiet));

    if (fine) {
      let lastX = 0;
      let lastY = 0;
      let lastT = performance.now();
      let calm: ReturnType<typeof setTimeout> | undefined;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.35;
        robot.current?.lookAt((e.clientX - cx) / (window.innerWidth * 0.8), (e.clientY - cy) / window.innerHeight);
        noteActivity();
        const now = performance.now();
        const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY) / Math.max(1, now - lastT);
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = now;
        if (speed > 4) {
          robot.current?.mood("Surprised", 1);
          clearTimeout(calm);
          calm = setTimeout(() => robot.current?.mood("Surprised", 0), 650);
        }
      };
      const onOut = (e: MouseEvent) => {
        if (e.relatedTarget) return;
        robot.current?.mood("Sad", 0.8);
      };
      const onOver = (e: MouseEvent) => {
        if (e.relatedTarget) return;
        robot.current?.mood("Sad", 0);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("mouseout", onOut);
      document.addEventListener("mouseover", onOver);
      cleanups.push(() => {
        clearTimeout(calm);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("mouseout", onOut);
        document.removeEventListener("mouseover", onOver);
      });
    } else {
      startTilt();
      const update = () => {
        robot.current?.lookAt(tiltX.get() * 1.2, tiltY.get() * 0.8);
        noteActivity();
      };
      cleanups.push(tiltX.on("change", update), tiltY.on("change", update));
      // Shake the phone → Riv is startled and hops.
      let lastShake = 0;
      cleanups.push(
        shakeEnergy.on("change", (v) => {
          const now = performance.now();
          if (v < 0.45 || now - lastShake < 1500) return;
          lastShake = now;
          robot.current?.mood("Surprised", 1);
          robot.current?.emote("Jump");
          setTimeout(() => robot.current?.mood("Surprised", 0), 900);
        }),
      );
    }
    return () => cleanups.forEach((c) => c());
  }, [status, reduce]);

  // The parent's active point → gesture + speech.
  useEffect(() => {
    if (!active) return;
    robot.current?.emote(active.emote);
    const id = requestAnimationFrame(() => setLine(active.says));
    return () => cancelAnimationFrame(id);
  }, [active, status]);

  const onPress = async () => {
    if (gyroNeedsPermission()) await requestGyro();
    const next = mascot.clicks[clickIndex.current++ % mascot.clicks.length];
    robot.current?.emote(next.emote);
    setLine(next.says);
  };

  const bubble = line ?? (touch ? mascot.touchGreeting : mascot.greeting);
  const label =
    state !== "idle" ? mascot.states[state] ?? mascot.states.idle : watching ? mascot.states.looking : mascot.states.idle;
  const live = status === "ready";

  return (
    <div
      ref={stage}
      className="spotlight relative overflow-hidden rounded-panel border border-line bg-bg/80 shadow-hairline backdrop-blur-xl md:bg-surface/40"
    >
      {/* Backdrop: dot grid + warm floor glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(244_242_238/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_50%_60%,black_20%,transparent_75%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_50%_100%,rgb(255_106_26/0.18),transparent_65%)]" />

      {/* HUD corners */}
      {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "left-3 bottom-3 border-b border-l", "right-3 bottom-3 border-b border-r"].map((c) => (
        <span key={c} aria-hidden="true" className={`pointer-events-none absolute z-10 size-4 border-orange/60 ${c}`} />
      ))}

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-5 pt-4 font-mono text-micro uppercase md:px-6 md:pt-5">
        <span className="whitespace-nowrap text-ink">
          {mascot.name} <span className="hidden text-faint lg:inline">· {mascot.role}</span>
        </span>
        <span className="flex items-center gap-2 whitespace-nowrap text-faint" aria-live="polite">
          <span className={`size-1.5 rounded-full ${live ? "bg-success" : "bg-faint"} ${live && !reduce ? "animate-pulse" : ""}`} />
          {live ? label : status === "error" ? "Offline" : "Waking up"}
        </span>
      </div>

      {/* Phones: Riv left, bubble right. Tablet/desktop: bubble above Riv. */}
      <div className="grid grid-cols-[46%_1fr] items-center md:block">
        {/* Speech bubble */}
        <div className="relative z-10 order-2 flex pr-4 md:min-h-[84px] md:justify-center md:px-5 md:pt-4 lg:min-h-[76px]">
          <p
            key={bubble}
            role="status"
            className="bubble-in relative max-w-[30ch] rounded-2xl border border-line bg-surface-2/90 px-3.5 py-2.5 text-[13px] leading-snug text-ink shadow-hairline md:px-4 md:text-center md:text-[14px] lg:text-[15px]"
          >
            {bubble}
            {/* tail: points left at Riv on phones, down on larger screens */}
            <span aria-hidden="true" className="absolute -left-[6px] top-1/2 size-3 -translate-y-1/2 rotate-45 border-b border-l border-line bg-surface-2 md:hidden" />
            <span aria-hidden="true" className="absolute -bottom-[6px] left-1/2 hidden size-3 -translate-x-1/2 rotate-45 border-b border-r border-line bg-surface-2 md:block" />
          </p>
        </div>

        {/* The robot */}
        <button
          type="button"
          onClick={onPress}
          aria-label={`${mascot.name}, Riven’s robot — press to make it react`}
          className="relative z-0 order-1 block h-[200px] w-full cursor-pointer touch-manipulation focus-visible:outline-offset-[-6px] md:-mt-2 md:mb-4 md:h-[min(50vh,480px)] lg:h-[min(58vh,560px)]"
        >
          <div ref={mount} aria-hidden="true" className="absolute inset-0" />
          {!live && (
            <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
              <div className="relative size-24 md:size-28">
                <span className="spin-12 absolute inset-0 rounded-full border border-orange/30 border-t-orange" />
                <span className="absolute inset-[38%] rounded-full bg-orange/15" />
              </div>
            </div>
          )}
        </button>
      </div>

    </div>
  );
}
