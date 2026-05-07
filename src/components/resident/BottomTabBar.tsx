/**
 * BottomTabBar — fixed bottom navigation for resident + family apps.
 *
 * Four tabs total. The active tab uses the yellow chip; the rest sit
 * in muted grey. Each tab takes a label, icon, and href. The container
 * blurs the page behind it so content can scroll under cleanly.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface Tab {
  href: string;
  label: string;
  icon: ReactNode;
}

interface BottomTabBarProps {
  tabs: Tab[];
}

export function BottomTabBar({ tabs }: BottomTabBarProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#D4D4D4] bg-white/95 backdrop-blur px-4 pt-2 pb-5">
      <div className="max-w-[480px] mx-auto grid grid-cols-4 gap-2">
        {tabs.map((t) => {
          const active = pathname === t.href || pathname?.startsWith(t.href + "/");
          return (
            <Link
              key={t.href}
              href={t.href}
              className={[
                "flex flex-col items-center gap-1 px-1 py-2 rounded-[12px] transition",
                active ? "bg-[#FFD400] text-black font-semibold" : "text-[#6B7280] hover:text-black",
              ].join(" ")}
            >
              {t.icon}
              <span className="text-[0.6875rem] font-semibold">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
