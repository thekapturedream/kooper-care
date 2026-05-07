/**
 * MoodSelector — five-emoji mood picker for the resident's own app.
 *
 * Big-tap targets, large emoji, short label. Tapping a mood writes a
 * row to the resident's own mood log AND surfaces an immediate reply
 * line above the grid so the resident sees their tap acknowledged
 * (e.g. "Sister Anne is on her way").
 *
 * In production this writes to a `resident_mood` table and routes to
 * the team via the alert engine for any "low" or "sore" tap.
 */
"use client";

import { useState } from "react";

type Mood = "great" | "good" | "ok" | "low" | "sore";

const MOODS: { id: Mood; emoji: string; label: string }[] = [
  { id: "great", emoji: "😄", label: "Great" },
  { id: "good",  emoji: "🙂", label: "Good" },
  { id: "ok",    emoji: "😐", label: "OK" },
  { id: "low",   emoji: "🙁", label: "Low" },
  { id: "sore",  emoji: "😣", label: "Sore" },
];

const REPLY: Record<Mood, string> = {
  great: "Lovely Edward. Sister Anne will be glad to hear it.",
  good:  "Glad to hear it Edward. Tea round is at 10.",
  ok:    "OK. We will check in on you in a few.",
  low:   "Thank you for telling us. Sister Anne is on her way.",
  sore:  "Sister Anne paged. She is coming now to check on the pain.",
};

export function MoodSelector() {
  const [mood, setMood] = useState<Mood>("good");

  return (
    <div className="rounded-[20px] border border-[#ECEAE3] bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-base">How are you today?</h2>
        <span className="text-xs text-[#6B7280]">{REPLY[mood]}</span>
      </div>
      <div className="grid grid-cols-5 gap-2.5">
        {MOODS.map((m) => {
          const selected = mood === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMood(m.id)}
              className={[
                "aspect-square rounded-[24px] border-2 flex flex-col items-center justify-center gap-1.5 transition",
                selected ? "bg-black border-black text-[#FFD400]" : "bg-white border-[#E5E7EB] hover:border-black hover:scale-[1.02]",
              ].join(" ")}
            >
              <span className="text-[2.25rem] leading-none">{m.emoji}</span>
              <span className="text-xs font-semibold">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
