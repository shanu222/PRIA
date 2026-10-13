import { Table2 } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataColumn = { id: string; label: string; numeric?: boolean };

/** Read-only table of figures with a titled header and a source line. */
export function DataTable({
  title,
  caption,
  source,
  columns,
  rows,
  highlightLast = false,
  className,
}: {
  title: string;
  caption?: string;
  source?: string;
  columns: DataColumn[];
  rows: Record<string, string>[];
  highlightLast?: boolean;
  className?: string;
}) {
  const [first, ...rest] = columns;
  return (
    <section className={cn("overflow-hidden rounded-2xl border-2 bg-card shadow-soft transition-shadow hover:shadow-lift", className)}>
      <div className="flex items-start gap-3 border-b-2 bg-gradient-to-r from-primary-tint to-card px-5 py-4">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Table2 className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <h3 className="text-base font-bold">{title}</h3>
          {caption && <p className="text-sm text-muted-foreground">{caption}</p>}
        </div>
      </div>
      <Table>
        <TableCaption className="sr-only">{caption ?? title}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="sticky left-0 z-10 bg-[#0B5D3B]">
              {first.label}
            </TableHead>
            {rest.map((c) => (
              <TableHead key={c.id} scope="col" className={cn("whitespace-nowrap", c.numeric && "text-right")}>
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => {
            const strong = highlightLast && i === rows.length - 1;
            return (
              <TableRow key={row[first.id]} className={cn(strong && "bg-primary-tint/60 font-semibold")}>
                <th
                  scope="row"
                  className={cn(
                    "sticky left-0 z-10 whitespace-nowrap border-l-4 border-l-transparent px-4 py-3 text-left font-semibold transition-colors group-hover:border-l-primary group-hover:bg-primary-tint",
                    strong ? "bg-primary-tint" : "bg-card",
                  )}
                >
                  {row[first.id]}
                </th>
                {rest.map((c) => (
                  <TableCell key={c.id} className={cn("whitespace-nowrap", c.numeric && "text-right tabular-nums")}>
                    {row[c.id] ?? "—"}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {source && <p className="border-t px-5 py-2.5 text-[11px] text-muted-foreground">Source: {source}.</p>}
    </section>
  );
}
