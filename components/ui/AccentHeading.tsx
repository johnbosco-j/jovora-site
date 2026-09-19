import type { Heading } from "@/content/site";

/** Renders a heading with exactly one Instrument Serif italic accent word. */
export function AccentText({ heading }: { heading: Heading }) {
  const after = heading.after;
  const joiner = after && !/^[.,!?]/.test(after) && !after.startsWith(" ") ? " " : "";
  return (
    <>
      {heading.before} <em className="accent">{heading.accent}</em>
      {joiner}
      {after}
    </>
  );
}

export function SectionHeader({
  label,
  heading,
  intro,
  id,
  align = "left",
}: {
  label: string;
  heading: Heading;
  intro?: string;
  id: string;
  align?: "left" | "center";
}) {
  const center = align === "center" ? "mx-auto text-center items-center" : "";
  return (
    <header className={`flex max-w-3xl flex-col gap-5 ${center}`}>
      <p className="micro reveal">{label}</p>
      <h2 id={id} className="reveal text-h2" style={{ ["--i" as string]: 1 }}>
        <AccentText heading={heading} />
      </h2>
      {intro && (
        <p className="reveal max-w-xl text-muted" style={{ ["--i" as string]: 2 }}>
          {intro}
        </p>
      )}
    </header>
  );
}
