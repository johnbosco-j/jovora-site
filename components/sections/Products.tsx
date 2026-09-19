import { SectionHeader } from "@/components/ui/AccentHeading";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/ui/ProductCard";
import { domains } from "@/content/domains";
import { products } from "@/content/products";
import { site } from "@/content/site";

export function Products() {
  const s = site.productsSection;
  const featured = products.find((p) => p.featured) ?? products[0];
  const others = products.filter((p) => p !== featured);
  // Ghost cards come from domains still in research, so the row stays honest and grows with content.
  const ghosts = domains.filter((d) => d.status === "In research");

  return (
    <section id="products" aria-labelledby="products-title" className="relative section-divider section-y">
      <div className="container-x">
        <SectionHeader id="products-title" label={s.label} heading={s.heading} intro={s.intro} />
        <div className="mt-14 md:mt-20">{featured && <ProductCard product={featured} />}</div>

        {others.length > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {others.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-6" aria-label="Upcoming">
          {ghosts.map((d, i) => (
            <li
              key={d.id}
              className="reveal flex min-h-[160px] flex-col justify-between gap-6 rounded-card border border-dashed border-line-strong/70 p-6 md:p-7"
              style={{ ["--i" as string]: i }}
            >
              <div className="flex items-center justify-between">
                <Icon name={d.icon} className="text-faint" />
                <Chip tone="neutral">{s.ghostStatus}</Chip>
              </div>
              <div>
                <p className="micro">{s.ghostLabel}</p>
                <p className="mt-2 text-[20px] font-semibold text-muted">{d.title}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
