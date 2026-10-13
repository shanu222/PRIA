import { MapPin } from "lucide-react";
import type { PendingTable } from "@/data/pria";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";

export function ProvinceTable({ table }: { table: PendingTable }) {
  const headingId = `${table.id}-title`;
  return (
    <section
      id={table.id}
      aria-labelledby={headingId}
      className="scroll-mt-24 overflow-hidden rounded-xl border bg-card shadow-soft"
    >
      <div className="flex flex-col gap-3 border-b bg-muted/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 id={headingId} className="text-base font-semibold">
            {table.title}
          </h3>
          <p className="text-sm text-muted-foreground">{table.caption}</p>
        </div>
        {table.status !== "available" && (
          <StatusBadge status={table.status} label={table.status === "pending" ? "Data pending" : undefined} />
        )}
      </div>
      <Table>
        <TableCaption className="sr-only">{table.caption}</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead scope="col" className="sticky left-0 z-10 min-w-[200px] bg-card">
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
              <th scope="row" className="sticky left-0 z-10 bg-card px-4 py-3 text-left font-medium">
                <span className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-primary dark:text-accent-foreground" aria-hidden />
                  {row.region}
                </span>
              </th>
              {table.columns.map((col) => {
                const value = row.cells[col.id];
                return (
                  <TableCell key={col.id} className="text-muted-foreground">
                    {value ?? (
                      <>
                        <span aria-hidden="true">—</span>
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
