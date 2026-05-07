import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "Kapture Care",
  legalName: "Kapture Studio Ltd.",
  parent: "Kapture",
  parentUrl: process.env.NEXT_PUBLIC_PARENT_BRAND_URL || "https://thekapture.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://care.thekapture.com",
  email: "studio@thekapture.com",
  phone: "+44 7352 144677",
  /** Care service types Kapture Care supports. */
  serviceTypes: ["Care home", "Domiciliary", "Supported living", "Nursing home", "Forensic / MH"],
  /** UK English locale used for `<html lang>`, OG locale, hreflang, schema. */
  locale: "en-GB",
  /** Year the parent brand was founded — surfaces on Organization schema. */
  foundingYear: "2018",
  tagline: "Modular care management. HR is the spine.",
  description:
    "Kapture Care is a modular care management system built around HR. Sign in once — the platform knows your role, residents, shift, tools. Pick the modules your service actually needs. Skip the rest. Built for UK care providers, CQC-aligned, NHS DSPT certified.",
  /** Default OG image — must exist in /public. 1200×630 recommended. */
  ogImage: "/og-image.png",
  /** Social handles used for OG/Twitter card metadata. */
  social: {
    twitter: "@thekapture",
    linkedin: "https://www.linkedin.com/company/thekapture/",
    youtube: "https://www.youtube.com/@thekapture",
  },
  /** Registered office address — surfaces on LocalBusiness schema. */
  address: {
    street: "5 Merchant Square",
    locality: "London",
    region: "England",
    postalCode: "W2 1AY",
    country: "United Kingdom",
    countryCode: "GB",
  },
  /** Calendly URL for the demo-call booking step. Override per env. */
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/kapture/care-demo",
};
