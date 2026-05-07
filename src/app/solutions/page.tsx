import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ImageStrip } from "@/components/ImageStrip";
import { SolutionsGrid } from "@/components/SolutionsGrid";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "Solutions — Industries we move",
  description:
    "Industry-tuned logistics: retail, manufacturing, mining, healthcare, agriculture, and tech. Lanes, capacity, and SLAs shaped to your sector.",
  alternates: { canonical: "/solutions" },

};

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Tuned for the way your industry actually moves."
        lede="Retail's peak isn't manufacturing's peak. Mining's lanes aren't pharma's lanes. Kapture Logistics tunes the operating layer to the gravity of your sector."
      />
      <ImageStrip
        src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=2000&q=80"
        alt="Bonded warehousing facility"
        eyebrow="Industries"
        caption="From retail peaks to mining corridors — every sector, one operating layer."
        height="short"
      />
      <SolutionsGrid />
      <CTA />
    </>
  );
}
