import type { Metadata } from "next";
import { WorkIndex } from "@/components/work/WorkIndex";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected graphic design, social media, branding and UI work by Afif Maulana.",
};

export default function WorkPage() {
  return <WorkIndex />;
}
