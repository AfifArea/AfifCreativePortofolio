import type { Metadata } from "next";
import { GalleryTable } from "@/components/gallery/GalleryTable";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Every plate from Afif Maulana's portfolio, laid out on one table.",
};

export default function GalleryPage() {
  return <GalleryTable />;
}
