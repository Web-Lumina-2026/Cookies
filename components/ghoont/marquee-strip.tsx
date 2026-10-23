"use client"

import React from "react"

export function MarqueeStrip() {
  const words = [
    "Filter Kaapi",
    "Masala Chai",
    "Iced Matcha",
    "Kulhad Hour",
    "Bun Maska",
    "Cold Brew",
    "Brew Class",
    "Estate Beans",
    "Slow Dripped",
  ]

  return (
    <div className="border-y border-[var(--line)] overflow-hidden py-4 bg-[var(--bg-outer)] select-none">
      <div className="marquee-track">
        {[...words, ...words].map((w, idx) => (
          <span
            key={idx}
            className="font-display text-2xl sm:text-3xl text-[var(--ink)] flex items-center gap-8 whitespace-nowrap"
          >
            <span>{w}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shrink-0 inline-block shadow-[0_0_8px_var(--accent)]" />
          </span>
        ))}
      </div>
    </div>
  )
}
