import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
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
        title="Tuned for the way your service actually runs."
        lede="A care home's day isn't a domiciliary visit's day. A supported-living tenancy isn't a complex-needs ward. kooper · care tunes the operating layer to the shape of your service."
      />
      <SolutionsGrid />
      <CTA />
    </>
  );
}
