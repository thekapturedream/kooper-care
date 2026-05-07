/**
 * Resident (Phase C proof) — `/app/resident`.
 *
 * Mirrors /Kaptire Website Templates/kooper-resident.html. Mobile-first,
 * pictogram-led. The resident is the user — large tap targets, warm
 * palette, gentle copy.
 *
 * In production:
 *   · The resident signs in once and lands here.
 *   · Mood + Help taps stream into the team via the alert engine.
 *   · About Me edits write back to the holistic profile with field-
 *     level RBAC ensuring family/staff see only what's permitted.
 */
import { MoodSelector } from "@/components/resident/MoodSelector";
import { HelpTileGrid } from "@/components/resident/HelpTileGrid";
import { BottomTabBar } from "@/components/resident/BottomTabBar";

const TODAY = [
  { emoji: "☕", title: "Tea round",          when: "10:00 in the lounge",   chip: "Soon" },
  { emoji: "🎵", title: "Sing-along with Mary", when: "14:30 · room garden",   chip: "Going" },
  { emoji: "📞", title: "Sarah is calling",    when: "17:00 · video call",    chip: "Remind me" },
];

export default function ResidentPage() {
  return (
    <main className="bg-gradient-to-b from-[#FFF8E1] to-[#F5F5F5] min-h-screen pb-24">
      <header className="max-w-[480px] mx-auto px-4 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-full bg-[#FFD400] text-black font-display font-bold flex items-center justify-center text-xl border-[3px] border-white shadow-md">EB</div>
          <div>
            <div className="text-sm text-[#6B7280]">Good morning,</div>
            <h1 className="font-display font-semibold text-3xl">Edward</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F5F5] border border-[#D4D4D4] px-2.5 py-0.5 text-[0.6875rem]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Sister Anne is here today
          </span>
        </div>
      </header>

      <section className="max-w-[480px] mx-auto px-4 mb-5">
        <MoodSelector />
      </section>

      <section className="max-w-[480px] mx-auto px-4 mb-5">
        <HelpTileGrid />
      </section>

      <section className="max-w-[480px] mx-auto px-4 mb-5">
        <h2 className="font-display font-semibold text-base mb-3">Today</h2>
        <div className="space-y-2.5">
          {TODAY.map((t) => (
            <div key={t.title} className="rounded-[18px] border border-[#ECEAE3] bg-white p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD400] flex items-center justify-center text-xl shrink-0">{t.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{t.title}</div>
                <div className="text-xs text-[#6B7280]">{t.when}</div>
              </div>
              <span className="rounded-full bg-[#F5F5F5] border border-[#D4D4D4] px-2.5 py-0.5 text-[0.625rem]">{t.chip}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[480px] mx-auto px-4 mb-5">
        <div className="rounded-[18px] bg-black text-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-base">About me</h2>
            <span className="text-[0.625rem] font-semibold rounded-full bg-[#FFD400] text-black px-2 py-0.5">Edit</span>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-[#FFD400] mb-1">Call me</div>
              <div>Eddie · he/him</div>
            </div>
            <div>
              <div className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-[#FFD400] mb-1">What cheers me up</div>
              <div>Sinatra. A cup of strong tea. Hearing about the grandkids.</div>
            </div>
            <div>
              <div className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-[#FFD400] mb-1">What I need from the team</div>
              <div>One instruction at a time. Plenty of light. Don&apos;t hurry me at the basin.</div>
            </div>
          </div>
        </div>
      </section>

      <BottomTabBar
        tabs={[
          { href: "/app/resident",        label: "Home",     icon: <span aria-hidden>🏠</span> },
          { href: "/app/resident/family", label: "Family",   icon: <span aria-hidden>👪</span> },
          { href: "/app/resident/today",  label: "What's on", icon: <span aria-hidden>📅</span> },
          { href: "/app/resident/help",   label: "Help me",  icon: <span aria-hidden>📞</span> },
        ]}
      />
    </main>
  );
}
