import type { Metadata } from "next";
import { SignInCard } from "./SignInCard";
import { KaptureSun } from "@/components/KaptureSun";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Kapture Care. The platform pulls your role, your residents, your shift, and your tools the moment you arrive.",
  robots: { index: false, follow: false },
};

/**
 * /sign-in
 *
 * Two-pane authentication screen. Left pane is brand-anchored marketing
 * copy explaining the HR-spine model. Right pane is the live form — magic
 * link primary, password optional.
 *
 * Once auth succeeds, the user is redirected to /app where the layout
 * resolves their full session via getCurrentSession() and routes to the
 * right post-login surface.
 */
export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-kapture-paper dark:bg-kapture-ink">
      <div className="container-kapture grid min-h-[calc(100vh-4rem)] gap-12 py-12 lg:grid-cols-2 lg:py-20">
        {/* LEFT — brand pane */}
        <div className="hidden lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3 font-display text-lg lowercase tracking-wide text-kapture-black dark:text-kapture-white">
            <KaptureSun size={32} className="text-kapture-black dark:text-kapture-white" />
            <span className="flex items-center gap-2">
              <span className="font-semibold">kapture</span>
              <span className="text-kapture-mist">·</span>
              <span className="font-medium">care</span>
            </span>
          </div>
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-kapture-black dark:text-kapture-white lg:text-5xl">
              Sign in. The system knows you.
            </h1>
            <p className="mt-4 max-w-md text-kapture-smoke dark:text-kapture-fog">
              Kapture Care pulls your role, your shift, your residents, your tools, and your access privileges
              the instant you authenticate. No setup. No menus. The platform configures itself around you in
              under 800 milliseconds.
            </p>
          </div>
          <p className="text-xs text-kapture-mist">
            CQC SAF aligned · NHS DSPT certified · UK GDPR compliant
          </p>
        </div>

        {/* RIGHT — auth pane */}
        <div className="flex items-center">
          <SignInCard />
        </div>
      </div>
    </div>
  );
}
