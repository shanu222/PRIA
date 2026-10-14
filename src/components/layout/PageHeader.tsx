import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { TopoPattern } from "@/components/pria/TopoPattern";

const BANNER_BY_TITLE: Record<string, string> = {
  "Growth Outlook 2047": "/banners/outlook.jpg",
  "Infrastructural Landscape": "/glance/landscape.jpg",
  "Situation Analysis": "/glance/situation.jpg",
  Needs: "/glance/needs.jpg",
  "PRIA Scope": "/glance/scope.jpg",
  "Key Stakeholders & Users": "/glance/stakeholders.jpg",
  "Regional Segments": "/segments/mountain.jpg",
  "Infra Research Bank": "/glance/situation.jpg",
};

const BANNER_FADE = "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 28%, #000 58%)";

function BannerTitle({ title }: { title: string }) {
  const match = title.match(/^(.*?)(\b20\d{2}\b)(.*)$/);
  if (!match) return <>{title}</>;
  return (
    <>
      {match[1]}
      <span className="text-[#6ee7b7]" style={{ textShadow: "0 0 22px rgba(52,211,153,0.55)" }}>
        {match[2]}
      </span>
      {match[3]}
    </>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  children,
  aside,
  image,
  className,
  demo,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  image?: string;
  className?: string;
  demo?: string;
}) {
  const photo = image ?? BANNER_BY_TITLE[title] ?? "/banners/outlook.jpg";
  return (
    <header
      data-demo={demo}
      className={cn(
        "group relative isolate min-h-[13.5rem] overflow-hidden rounded-2xl border border-emerald-400/45 px-6 py-8 text-white sm:px-10 sm:py-10",
        "bg-[linear-gradient(120deg,#04231d_0%,#071417_55%)]",
        "shadow-[0_0_0_1px_rgba(52,211,153,0.18),0_0_36px_-12px_#34d399,inset_0_1px_0_rgba(255,255,255,0.12)]",
        className,
      )}
    >
      <img
        src={photo}
        alt=""
        className="absolute inset-y-0 right-0 -z-10 h-full w-full object-cover opacity-90 transition-transform duration-[1.6s] ease-out group-hover:scale-[1.03] sm:w-[72%]"
        style={{ maskImage: BANNER_FADE, WebkitMaskImage: BANNER_FADE }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,24,20,0.92)_0%,rgba(4,24,20,0.55)_42%,rgba(4,14,18,0.35)_100%)]"
      />
      <TopoPattern className="-z-10 text-white opacity-[0.1]" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent"
      />
      <div className="relative flex h-full min-h-[inherit] flex-col justify-center gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-200 shadow-[0_0_16px_-6px_#34d399]">
            {icon && <Icon name={icon} className="h-3.5 w-3.5" />}
            {eyebrow}
          </p>
          <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight drop-shadow sm:text-4xl lg:text-[2.75rem]">
            <BannerTitle title={title} />
          </h1>
          {description && <p className="mt-3 max-w-2xl text-base text-white/75 sm:text-lg">{description}</p>}
          {children}
        </div>
        {aside && <div className="relative shrink-0">{aside}</div>}
      </div>
    </header>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  id,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-accent-foreground">
          {eyebrow}
        </p>
        <h2 id={id} className="mt-1.5 scroll-mt-24 text-2xl font-bold sm:text-[1.65rem]">
          {title}
        </h2>
        {description && <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}
