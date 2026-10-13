"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Icon } from "@/lib/icons";
import { buildSearchIndex } from "@/lib/search";

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const groups = React.useMemo(() => buildSearchIndex(), []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search PRIA"
      description="Jump to any page, section, segment or infrastructure category"
    >
      <CommandInput placeholder="Search pages, segments, categories, sections…" />
      <CommandList>
        <CommandEmpty>No matching content in PRIA.</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group.id} heading={group.heading}>
            {group.entries.map((entry) => (
              <CommandItem
                key={entry.id}
                value={`${entry.label} ${entry.hint} ${entry.id}`}
                keywords={entry.keywords}
                onSelect={() => go(entry.href)}
                className="group"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-card text-muted-foreground"
                  style={entry.color ? { color: entry.color } : undefined}
                >
                  <Icon name={entry.icon} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{entry.label}</span>
                  <span className="truncate text-xs text-muted-foreground">{entry.hint}</span>
                </span>
                <CornerDownLeft className="ml-auto opacity-0 group-data-[selected=true]:opacity-60" aria-hidden />
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
      <div className="flex items-center justify-between border-t px-4 py-2.5 text-xs text-muted-foreground">
        <span>Search covers PRIA content only</span>
        <span className="hidden items-center gap-1 sm:flex">
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-sans">Esc</kbd> to close
        </span>
      </div>
    </CommandDialog>
  );
}
