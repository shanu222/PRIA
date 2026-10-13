import type { Metadata } from "next";
import { getPage } from "@/data/pria";
import { SummaryPage } from "@/components/pria/SummaryPage";

const page = getPage("responsibilities");
export const metadata: Metadata = { title: page.navLabel, description: page.description };

export default function ResponsibilitiesPage() {
  return <SummaryPage id="responsibilities" />;
}
