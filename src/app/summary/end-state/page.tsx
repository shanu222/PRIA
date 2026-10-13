import type { Metadata } from "next";
import { getPage } from "@/data/pria";
import { SummaryPage } from "@/components/pria/SummaryPage";

const page = getPage("end-state");
export const metadata: Metadata = { title: page.title, description: page.description };

export default function EndStatePage() {
  return <SummaryPage id="end-state" visionBanner />;
}
