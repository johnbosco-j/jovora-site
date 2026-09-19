"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Emote, RobotHandle } from "@/lib/robot/scene";
import { gyroNeedsPermission, requestGyro, startTilt, tiltX, tiltY } from "@/lib/tilt";

const CLICK_EMOTES: Emote[] = ["Wave", "ThumbsUp", "Yes", "Jump", "Dance"];

/**
 * Interactive mascot for the About section.
 *  - Laptop: head and body follow the cursor anywhere on the page; moving fast
 *    surprises it; leaving the window makes it sad; hovering a "why" point or clicking
 *    it triggers a gesture.
 *  - Phone: follows device tilt (or your touch); gestures fire as each point scrolls
 *    into the centre and when you tap it.
 *  - Reduced motion: a single still pose.
 */
export function RobotStage({ hint, touchHint }: { hint: string; touchHint: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const robot = useRef<RobotHandle | null>(null);
  const clickIndex = useRef(0);
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [touch, setTouch] = useState(false);

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
          const handle = await createRobot(el, { still: !!reduce });
          if (cancelled) return handle.dispose();
          robot.current = handle;
          setStatus("ready");
          handle.setActive(true);
          handle.emote("Wave");
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

  // Pause rendering while off-screen or in a hidden tab.
  useEffect(() => {
    const el = stage.current;
    if (!el || status !== "ready") return;
    let visible = false;
    const sync = () => robot.current?.setActive(visible && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
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

    if (fine) {
      let lastX = 0;
      let lastY = 0;
      let lastT = performance.now();
      let calm: ReturnType<typeof setTimeout> | undefined;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.3;
        robot.current?.lookAt((e.clientX - cx) / window.innerWidth, (e.clientY - cy) / window.innerHeight);
        const now = performance.now();
        const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY) / Math.max(1, now - lastT);
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = now;
        if (speed > 3.2) {
          robot.current?.mood("Surprised", 1);
          clearTimeout(calm);
          calm = setTimeout(() => robot.current?.mood("Surprised", 0), 700);
        }
      };
      const onOut = (e: MouseEvent) => {
        if (e.relatedTarget) return;
        robot.current?.mood("Sad", 0.9);
        robot.current?.lookAt(0, 0.25);
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
      const update = () => robot.current?.lookAt(tiltX.get() * 1.3, tiltY.get() * 0.9);
      cleanups.push(tiltX.on("change", update), tiltY.on("change", update));
    }

    // Gestures tied to the "why we're different" points.
    const section = el.closest("section");
    const items = Array.from(section?.querySelectorAll<HTMLElement>("[data-emote]") ?? []);
    const play = (target: EventTarget | null) => {
      const item = (target as HTMLElement | null)?.closest?.<HTMLElement>("[data-emote]");
      if (item?.dataset.emote) robot.current?.emote(item.dataset.emote as Emote);
    };
    if (fine) {
      const onHover = (e: Event) => play(e.target);
      items.forEach((i) => i.addEventListener("pointerenter", onHover));
      cleanups.push(() => items.forEach((i) => i.removeEventListener("pointerenter", onHover)));
    } else {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && play(e.target)),
        { rootMargin: "-45% 0px -45% 0px" },
      );
      items.forEach((i) => io.observe(i));
      cleanups.push(() => io.disconnect());
    }
    const onFocus = (e: FocusEvent) => play(e.target);
    section?.addEventListener("focusin", onFocus);
    cleanups.push(() => section?.removeEventListener("focusin", onFocus));

    return () => cleanups.forEach((c) => c());
  }, [status, reduce]);

  const onPress = async () => {
    if (gyroNeedsPermission()) await requestGyro();
    const name = CLICK_EMOTES[clickIndex.current++ % CLICK_EMOTES.length];
    robot.current?.emote(name);
  };

  return (
    <div ref={stage} className="relative mx-auto w-full max-w-[460px]">
      {/* halo behind the robot */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[6%] aspect-square rounded-full bg-[radial-gradient(closest-side,rgb(255_106_26/0.16),transparent)]" />
      <button
        type="button"
        onClick={onPress}
        aria-label="Jovora’s robot — press to make it wave"
        className="relative block aspect-[4/5] w-full cursor-pointer touch-manipulation rounded-panel focus-visible:outline-offset-4"
      >
        <div ref={mount} aria-hidden="true" className="absolute inset-0" />
        {status !== "ready" && (
          <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
            <div className="relative size-40">
              <span className="spin-12 absolute inset-0 rounded-full border border-orange/30 border-t-orange" />
              <span className="absolute inset-[38%] rounded-full bg-orange/15" />
            </div>
          </div>
        )}
      </button>
      {status === "ready" && !reduce && (
        <p className="mt-3 text-center font-mono text-micro uppercase text-faint">{touch ? touchHint : hint}</p>
      )}
    </div>
  );
}
