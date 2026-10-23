"use client"

import React, { useState, useEffect } from "react"

export function RewardsSection() {
  const [stamps, setStamps] = useState(3)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ghoont_stamps")
      if (saved !== null) {
        setStamps(Number(saved))
      }
    } catch {}
  }, [])

  const handleStampClick = (i: number) => {
    const next = stamps >= 10 ? 0 : stamps + 1
    setStamps(next)
    try {
      localStorage.setItem("ghoont_stamps", String(next))
    } catch {}
  }

  const stampMsg =
    stamps >= 10
      ? "Free cup unlocked! Show this to your table attendant or counter."
      : stamps === 9
      ? "Next cup is completely free!"
      : `${9 - stamps} more cups to your free brew.`

  return (
    <section id="rewards" className="py-20 px-4 max-w-7xl mx-auto border-t border-[var(--line)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Stamp Card Component */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md rounded-3xl p-7 bg-[var(--foam)] text-[var(--on-accent)] shadow-2xl relative -rotate-2 hover:rotate-0 transition-transform duration-300 border-2 border-dashed border-[#1a0f08]/30">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <b className="font-display text-3xl sm:text-4xl leading-tight">
                Ghoont Card
              </b>
              <span className="font-mono-custom text-[11px] font-bold tracking-widest uppercase">
                9 CUPS = 10TH FREE
              </span>
            </div>

            {/* 10 Stamp Circles */}
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => {
                const isOn = i < stamps
                const isFree = i === 9
                return (
                  <button
                    key={i}
                    onClick={() => handleStampClick(i)}
                    className={`aspect-square rounded-full border-2 border-dashed border-[#1a0f08]/40 flex items-center justify-center font-mono-custom text-xs font-bold transition-all active:scale-95 ${
                      isOn
                        ? "bg-[var(--liquid)] text-[var(--foam)] border-none -rotate-12 shadow-sm"
                        : "text-[#1a0f08]/60 hover:scale-105"
                    } ${isFree ? "border-solid font-black" : ""}`}
                    title={`Stamp ${i + 1}`}
                  >
                    {isOn ? "G" : isFree ? "FREE" : i + 1}
                  </button>
                )
              })}
            </div>

            <div className="mt-5 font-bold text-xs text-[#1a0f08]/90 min-h-[1.5em] bg-black/5 p-2.5 rounded-xl border border-black/10">
              {stampMsg}
            </div>
          </div>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
          <span className="font-mono-custom text-xs uppercase tracking-widest text-[var(--accent)]">
            Rewards
          </span>
          <h2 className="font-display text-5xl sm:text-6xl text-[var(--ink)] leading-[0.9]">
            Every ninth<br />
            sip is on us.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed max-w-md mx-auto lg:mx-0">
            One stamp per hot or cold drink, zero app downloads, no minimum bill.
            Tap the stamps above to try the interactive card. Regulars also get priority seats at our Saturday brew class.
          </p>
        </div>

      </div>
    </section>
  )
}
