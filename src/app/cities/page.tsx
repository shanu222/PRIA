import { redirect } from "next/navigation";

export default async function CitiesRedirect({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  redirect(city ? `/research?city=${encodeURIComponent(city)}` : "/research");
}
