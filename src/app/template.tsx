import { PageTransition } from "@/components/pria/Motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
