import type { Metadata } from "next";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Fragment } from "react";
import { getPage, stakeholders } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/pria/Motion";
import { StakeholderTier } from "@/components/pria/StakeholderTier";

const page = getPage("stakeholders");
export const metadata: Metadata = { title: page.title, description: page.description };

const flowStyles = [
  "bg-gradient-to-br from-[#063521] to-[#0B5D3B] text-white border-transparent",
  "bg-primary-tint border-primary/25 text-primary dark:text-accent-foreground",
  "bg-cyan-50 border-water/25 text-water dark:bg-cyan-500/10",
];

export default function StakeholdersPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10">
      <PageHeader demo="intro" eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />

      <Reveal>
        <section
          data-demo="flow"
          id="flow"
          aria-label="Stakeholder flow"
          className="card-pro scroll-mt-24 rounded-2xl bg-card p-6 sm:p-8"
        >
          <ol className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            {stakeholders.flow.map((step, i) => (
              <Fragment key={step.id}>
                <li
                  className={cn(
                    "flex flex-1 items-center gap-3 rounded-xl border px-5 py-4 font-heading font-bold shadow-soft",
                    flowStyles[i],
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      i === 0 ? "bg-white/15 ring-1 ring-white/25" : "bg-card",
                    )}
                  >
                    <Icon name={step.icon} className="h-5 w-5" />
                  </span>
                  {step.label}
                </li>
                {i < stakeholders.flow.length - 1 && (
                  <li aria-hidden="true" className="flex justify-center text-muted-foreground">
                    <ArrowRight className="hidden h-5 w-5 md:block" />
                    <ArrowDown className="h-5 w-5 md:hidden" />
                  </li>
                )}
              </Fragment>
            ))}
          </ol>
        </section>
      </Reveal>

      <div data-demo="tiers" className="grid gap-6 lg:grid-cols-2">
        {stakeholders.tiers.map((tier, i) => (
          <StakeholderTier key={tier.id} tier={tier} tone={i === 0 ? "primary" : "water"} />
        ))}
      </div>
    </div>
  );
}
