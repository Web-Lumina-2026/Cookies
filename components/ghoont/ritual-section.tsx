"use client"

import React from "react"

export function RitualSection() {
  const rituals = [
    {
      when: "Daily · 7 – 10 am",
      title: "Decoction Bar",
      desc: "Watch the brass filter drip. Kaapi is poured from a height between davara and tumbler until it foams, then handed over the counter.",
    },
    {
      when: "Daily · 4 – 6 pm",
      title: "Kulhad Hour",
      desc: "Chai in clay kulhads at ₹60, with a rotating plate of bun maska and samosa. The clay adds a faint earthy note you won't get from a mug.",
    },
    {
      when: "Saturdays · 11 am",
      title: "Brew Class",
      desc: "Ninety minutes, eight seats. Learn filter kaapi, chai spice ratios and a proper matcha whisk. You leave with a 250 g bag of our blend.",
    },
  ]

  return (
    <section id="ritual" className="py-20 px-4 max-w-7xl mx-auto border-t border-[var(--line)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <span className="font-mono-custom text-xs uppercase tracking-widest text-[var(--accent)]">
            The Ghoont experience
          </span>
          <h2 className="font-display text-5xl sm:text-6xl text-[var(--ink)] leading-[0.9]">
            Three reasons<br />
            to stay longer.
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--muted)] max-w-md leading-relaxed">
          A café is the hour you spend in it. These are the rituals regulars plan their day around.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rituals.map((rit, idx) => (
          <div
            key={idx}
            className="p-8 border-t border-[var(--accent)] ghoont-glass rounded-2xl flex flex-col gap-3 group hover:border-white/50 transition-colors"
          >
            <span className="font-mono-custom text-xs tracking-wider text-[var(--accent)] uppercase">
              {rit.when}
            </span>
            <h3 className="font-display text-3xl sm:text-4xl text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-tight">
              {rit.title}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              {rit.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
