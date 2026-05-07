/**
 * Care Plans (Phase A proof) — `/app/care-plans`.
 *
 * Mirrors the editorial hero block from the standalone prototype at
 * /Kaptire Website Templates/kooper-care-plans.html. This page is the
 * proof point that the editorial primitives in
 * `@/components/editorial` compose into the prototype's typographic
 * rhythm one-for-one.
 *
 * What is hard-coded here:
 *   · Edward Banda (resident)
 *   · Psychological category (10 domains, 8 reviewed, 2 due)
 *   · Mental state lead domain
 *
 * What lives here in production (Phase A → B):
 *   · Server-fetched residents and care plan elements from Supabase
 *   · Per-section history and edit modals
 *   · Compile evidence pack server action
 */
import {
  Article,
  Masthead,
  Kicker,
  Heading,
  Byline,
  Prose,
  Label,
  StatPanel,
  PullQuote,
  SAFRow,
  Divider,
} from "@/components/editorial";

export default function CarePlansPage() {
  return (
    <main className="container-kapture py-8">
      <Article>
        <Masthead
          left="kooper · care plans"
          right="Vol. 4 · No. 12 · 12 Mar 2026"
        />

        <Kicker>Psychological domains</Kicker>
        <Heading
          title="Psychological"
          deck="Ten domains that hold a person’s inner life — mood, mind, story. Eight in current review. Two due before next Wednesday."
        />

        <Byline
          items={[
            { label: "Plan",         value: "v4 · current" },
            { label: "Review lead",  value: "Sister Anne" },
            { label: "Resident",     value: "Mr Edward Banda" },
            { label: "Last edit",    value: "12 Mar 2026, 14:08" },
          ]}
        />

        <section className="mt-8">
          <Kicker tone="warn">Lead domain · review due 17 May</Kicker>
          <Heading
            level={2}
            title="Mental state"
            deck="A stable mental state with calm afternoons, supported through familiar music and family connection."
          />

          <Prose>
            <p className="no-indent">
              Eddie is generally calm and oriented. There is occasional
              confusion in the late afternoon — what families call sundowning
              — but he responds well to familiar music and family photos. His
              mood is bright on most days. Brief low moments arrive around
              the anniversary of Margaret&apos;s death; the team is briefed in
              the week before.
            </p>
          </Prose>

          <Label>Desired outcome</Label>
          <Prose>
            <p className="no-indent">
              A stable mental state, calm afternoons, no escalation requiring
              PRN medication. Maintained over a rolling 90-day window.
            </p>
          </Prose>

          <PullQuote
            cite="— Eddie · captured 12 Mar by Sister Anne, Eddie present"
          >
            “I want my music when I&apos;m sad. And to talk to my Sarah.”
          </PullQuote>

          <StatPanel
            stats={[
              { label: "Frequency",         value: "Daily",          foot: "observation, weekly summary" },
              { label: "Self-sufficiency",  value: "68 / 100",       foot: "↑ four points vs prior cycle" },
              { label: "Responsible",       value: "Nurse on shift", foot: "weekly review by Clinical Lead" },
              { label: "Linked apps",       value: "risk · safety",  foot: "3 active risks · safety plan current" },
            ]}
          />

          <SAFRow />
        </section>

        <Divider />

        <section>
          <Kicker tone="ok">Up to date · 82 / 100</Kicker>
          <Heading
            level={2}
            title="Emotional"
            deck="Settled and content. Engages warmly with the carers he knows."
          />
          <Prose>
            <p className="no-indent">
              No signs of low mood outside the Margaret anniversary on 14
              September — extra emotional support is planned for that week
              each year.
            </p>
          </Prose>
        </section>
      </Article>
    </main>
  );
}
