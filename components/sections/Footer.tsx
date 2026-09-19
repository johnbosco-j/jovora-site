import { Monogram, Wordmark } from "@/components/brand/Wordmark";
import { site } from "@/content/site";
import { resolveHref } from "@/lib/links";

export function Footer() {
  const f = site.footer;
  return (
    <footer className="border-t border-line pb-10 pt-20">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href="#top" className="inline-flex items-center gap-3 rounded-full" aria-label="Jovora — back to top">
              <Monogram size={36} />
              <Wordmark className="text-[32px] leading-none" />
            </a>
            <p className="mt-5 max-w-[30ch] text-muted">{site.mission}</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            {f.columns.map((col) => (
              <div key={col.title}>
                <h2 className="micro">{col.title}</h2>
                <ul className="mt-4 flex flex-col gap-1">
                  {col.links.map((l) => {
                    const { href, external } = resolveHref(l.href);
                    if (!href)
                      return (
                        <li key={l.label} className="py-2 text-[15px] text-faint">
                          {l.label} <span className="text-[12px]">— soon</span>
                        </li>
                      );
                    return (
                      <li key={l.label}>
                        <a
                          href={href}
                          className="inline-flex py-2 text-[15px] text-muted transition-colors hover:text-ink"
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {l.label}
                          {external && (
                            <>
                              <span aria-hidden="true">&nbsp;↗</span>
                              <span className="sr-only"> (opens in a new tab)</span>
                            </>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-line pt-6 font-mono text-[12px] text-faint sm:flex-row">
          <p>{f.legalLeft}</p>
          <p>{f.legalRight}</p>
        </div>
      </div>
    </footer>
  );
}
