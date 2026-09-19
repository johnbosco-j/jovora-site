"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ParallaxLayer } from "@/components/parallax/ParallaxLayer";
import type { Product } from "@/content/products";
import { useMotionScale } from "@/lib/hooks";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { ClareoMock } from "./ClareoMock";
import { Stat } from "./Stat";

/** Featured product panel. Rises from the foreground layer (L3): scale 0.92 → 1. */
export function ProductCard({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const k = useMotionScale();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const scale = useTransform(scrollYProgress, [0, 1], [k ? 0.92 : 1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [120 * k, 0]);

  return (
    <motion.article
      ref={ref}
      style={{ scale, y }}
      aria-labelledby={`product-${product.slug}`}
      className="spotlight relative overflow-hidden rounded-panel border border-line bg-surface shadow-hairline"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(255_106_26/0.14),transparent)]" />
      <div className="relative grid gap-12 p-6 sm:p-10 lg:grid-cols-12 lg:gap-10 lg:p-14">
        <div className="flex flex-col lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="live">
              {product.status} · {product.platforms}
            </Chip>
            <Chip tone="neutral">{product.domainLabel}</Chip>
          </div>
          <h3 id={`product-${product.slug}`} className="mt-8 font-serif text-[56px] font-normal leading-none tracking-[-0.02em] md:text-[72px]">
            {product.name}
          </h3>
          <p className="mt-4 text-[24px] font-semibold leading-tight tracking-[-0.02em] md:text-[28px]">{product.tagline}</p>
          <p className="mt-5 max-w-[52ch] text-muted">{product.description}</p>

          <ul className="mt-8 flex flex-col gap-3">
            {product.features.map((f) => (
              <li key={f} className="flex gap-3 text-[15px] text-ink/90">
                <span aria-hidden="true" className="mt-[9px] h-px w-3 flex-none bg-orange" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href={product.href} external comingSoonLabel={`${product.cta} — site coming soon`}>
              {product.cta}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:col-span-6 lg:pt-2">
          {/* Device mock with inner parallax (max ~40px) */}
          <div className="overflow-hidden rounded-card border border-line bg-bg">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="ml-3 flex-1 truncate rounded-full bg-surface px-3 py-1 font-mono text-[11px] text-faint">
                {product.displayUrl ?? product.href?.replace(/^https?:\/\//, "") ?? product.slug}
              </span>
            </div>
            <div className="relative aspect-[16/11] overflow-hidden">
              <ParallaxLayer speed={1.2} distance={400} className="absolute inset-x-0 -inset-y-10">
                <div className="absolute inset-x-0 inset-y-10">
                  {product.screenshot ? (
                    <Image
                      src={product.screenshot.src}
                      width={product.screenshot.width}
                      height={product.screenshot.height}
                      alt={product.screenshot.alt}
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="size-full object-cover object-top"
                    />
                  ) : (
                    <>
                      <ClareoMock />
                      <span className="sr-only">Illustration of the {product.name} dashboard.</span>
                    </>
                  )}
                </div>
              </ParallaxLayer>
            </div>
          </div>

        </div>

        {(product.stats || product.disclaimer) && (
          <div className="lg:col-span-12">
            {product.stats && (
              <dl className="grid grid-cols-1 gap-8 border-t border-line pt-10 sm:grid-cols-3 sm:gap-6">
                {product.stats.map((s) => (
                  <div key={s.value}>
                    <Stat {...s} />
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-8 flex flex-col gap-1 text-[12px] text-faint sm:flex-row sm:justify-between sm:gap-6">
              {product.statsSource && <p>{product.statsSource}</p>}
              {product.disclaimer && <p className="flex-none">{product.disclaimer}</p>}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}
