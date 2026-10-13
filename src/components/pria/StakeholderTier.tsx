import { ChevronRight } from "lucide-react";
import type { StakeholderTierData } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "./Motion";

export function StakeholderTier({ tier, tone }: { tier: StakeholderTierData; tone: "primary" | "water" }) {
  const headingId = `tier-${tier.id}`;
  return (
    <section aria-labelledby={headingId} className="flex flex-col rounded-2xl border bg-card shadow-soft">
      <header
        className={cn(
          "flex items-center gap-3 rounded-t-2xl border-b px-6 py-5",
          tone === "primary" ? "bg-primary-tint/70" : "bg-cyan-50/70 dark:bg-cyan-500/[0.07]",
        )}
      >
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl text-white",
            tone === "primary" ? "bg-[#0B5D3B]" : "bg-[#0E7490]",
          )}
        >
          <Icon name={tier.icon} className="h-5 w-5" />
        </span>
        <div>
          <h2 id={headingId} className="text-lg font-bold">
            {tier.title}
          </h2>
          <p className="text-xs text-muted-foreground">{tier.members.length} members</p>
        </div>
      </header>
      <Stagger as="ul" className="grid gap-2.5 p-4 sm:p-5">
        {tier.members.map((m) => (
          <StaggerItem as="li" key={m.id}>
            <div
              id={m.id}
              className={cn(
                "group flex scroll-mt-24 items-center gap-3 rounded-xl border bg-background/40 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-card hover:shadow-soft",
                tone === "primary" ? "hover:border-primary/40" : "hover:border-water/40",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  tone === "primary"
                    ? "bg-primary-tint text-primary dark:text-accent-foreground"
                    : "bg-cyan-50 text-water dark:bg-cyan-500/10",
                )}
              >
                <Icon name={m.icon} className="h-[18px] w-[18px]" />
              </span>
              <span className="text-sm font-medium leading-snug">{m.title}</span>
              <ChevronRight
                className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground"
                aria-hidden
              />
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
