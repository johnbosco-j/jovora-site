"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

type State = { status: "idle" | "sending" | "sent" | "error"; message?: string };

const field =
  "h-12 w-full rounded-input border border-line bg-surface-2 px-4 text-[16px] text-ink placeholder:text-faint transition-colors duration-1 hover:border-line-strong focus:border-orange focus:outline-none focus-visible:shadow-[0_0_0_4px_rgb(255_106_26/0.18)]";

export function ContactForm({ topics, success }: { topics: readonly string[]; success: string }) {
  const [state, setState] = useState<State>({ status: "idle" });

  // Result of a no-JS submission (the API redirects back with ?sent=1 or ?error=1).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("sent") && !params.has("error")) return;
    const id = requestAnimationFrame(() => {
      setState(params.has("sent") ? { status: "sent" } : { status: "error", message: "Please check every field and try again." });
      window.history.replaceState(null, "", "/#contact");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Something went wrong. Please try again.");
      form.reset();
      setState({ status: "sent" });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  if (state.status === "sent") {
    return (
      <div role="status" className="card flex min-h-[420px] flex-col items-start justify-center gap-4 p-8 md:p-10">
        <span className="grid size-11 place-items-center rounded-full bg-success/10 text-success">
          <Check size={20} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="text-[24px] font-semibold tracking-[-0.02em]">{success}</p>
        <button type="button" className="text-[15px] text-muted underline-offset-4 hover:text-ink hover:underline" onClick={() => setState({ status: "idle" })}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form method="post" action="/api/contact" onSubmit={onSubmit} className="card flex flex-col gap-5 p-6 md:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] text-muted">Name</span>
          <input name="name" required maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] text-muted">Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-[14px] text-muted">What it’s about</span>
        <select name="topic" required defaultValue="" className={`${field} appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%23A3A1A0%22%20stroke-width=%222%22%3E%3Cpath%20d=%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[position:right_16px_center] bg-no-repeat pr-10`}>
          <option value="" disabled>
            Choose one
          </option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[14px] text-muted">Message</span>
        <textarea name="message" required minLength={10} maxLength={4000} rows={5} className={`${field} h-auto resize-y py-3`} />
      </label>

      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto size-px overflow-hidden">
        <label>
          Company website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state.status === "sending"}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-orange px-6 text-[15px] font-medium text-black transition-colors duration-1 hover:bg-orange-hot active:bg-orange-deep disabled:opacity-70"
        >
          {state.status === "sending" && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
          {state.status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p role="alert" className="text-[14px] text-danger">
          {state.status === "error" ? state.message : ""}
        </p>
      </div>
    </form>
  );
}
