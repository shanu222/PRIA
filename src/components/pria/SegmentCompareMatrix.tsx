import Link from "next/link";
import { categoryStatus, infraCategories, type Segment } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { segmentStyle } from "./SegmentCard";
import { StatusBadge } from "./StatusBadge";

export function SegmentCompareMatrix({ segments }: { segments: Segment[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 bg-card shadow-soft transition-shadow hover:shadow-lift">
      <Table>
        <TableCaption className="sr-only">
          Status of recommendations for each regional segment and infrastructure category
        </TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead scope="col" className="sticky left-0 z-10 min-w-[200px] bg-[#0B5D3B]">
              Segment
            </TableHead>
            {infraCategories.map((c) => (
              <TableHead key={c.id} scope="col" className="min-w-[150px]">
                <span className="flex items-center gap-1.5">
                  <Icon name={c.icon} className="h-3.5 w-3.5" />
                  {c.shortTitle}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {segments.map((s) => (
            <TableRow key={s.id} style={segmentStyle(s)}>
              <th scope="row" className="sticky left-0 z-10 bg-card px-4 py-3 text-left transition-colors group-hover:bg-primary-tint">
                <Link
                  href={`/segments/${s.slug}`}
                  className="flex items-center gap-2.5 rounded font-semibold hover:underline"
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-md text-white"
                    style={{ background: s.colorStrong }}
                  >
                    <Icon name={s.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider seg-text">
                      Segment {s.number}
                    </span>
                    {s.shortTitle}
                  </span>
                </Link>
              </th>
              {s.categories.map((c) => {
                const status = categoryStatus(c);
                return (
                  <TableCell key={c.id}>
                    <Link
                      href={`/segments/${s.slug}/${c.id}`}
                      className="inline-flex rounded-full"
                      aria-label={`${s.shortTitle}: ${c.title} (${status === "pending" ? "pending" : "published"})`}
                    >
                      <StatusBadge status={status} label={status === "pending" ? "Pending" : "Published"} />
                    </Link>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
