import { MapPin, Table2 } from "lucide-react";
import type { PendingTable } from "@/data/pria";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";

export function ProvinceTable({ table }: { table: PendingTable }) {
  const headingId = `${table.id}-title`;
  return (
    <section
      id={table.id}
      aria-labelledby={headingId}
      className="card-pro scroll-mt-24 overflow-hidden rounded-2xl bg-card"
    >
      <div className="flex flex-col gap-3 border-b-2 bg-gradient-to-r from-primary-tint to-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Table2 className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h3 id={headingId} className="text-base font-bold">
              {table.title}
            </h3>
            <p className="text-sm text-muted-foreground">{table.caption}</p>
          </div>
        </div>
        {table.status !== "available" && (
          <StatusBadge status={table.status} label={table.status === "pending" ? "Data pending" : undefined} />
        )}
      </div>
      <Table>
        <TableCaption className="sr-only">{table.caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="sticky left-0 z-10 min-w-[200px] bg-[#0B5D3B]">
              {table.rowHeader}
            </TableHead>
            {table.columns.map((col) => (
              <TableHead key={col.id} scope="col" className="min-w-[140px] whitespace-nowrap">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.rows.map((row) => (
            <TableRow key={row.region}>
              <th
                scope="row"
                className="sticky left-0 z-10 border-l-4 border-l-transparent bg-card px-4 py-3 text-left font-semibold transition-colors group-hover:border-l-primary group-hover:bg-primary-tint"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-primary dark:text-accent-foreground" aria-hidden />
                  {row.region}
                </span>
              </th>
              {table.columns.map((col) => {
                const value = row.cells[col.id];
                return (
                  <TableCell key={col.id} className="tabular-nums text-foreground/85">
                    {value ?? (
                      <>
                        <span aria-hidden="true" className="text-muted-foreground">—</span>
                        <span className="sr-only">Data pending</span>
                      </>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
