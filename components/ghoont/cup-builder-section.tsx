"use client"

import React, { useState } from "react"
import { BUILDER_OPTS } from "@/lib/cafe-data"
import { formatINR } from "@/lib/utils"
import { CartItem } from "@/lib/order-store"

interface CupBuilderSectionProps {
  onAddCustomBrew: (cartItem: CartItem) => void
}

const SWEETNESS_LABELS = ["No sugar", "Light (50%)", "Regular Sweet", "Gud (Organic Jaggery)"]

export function CupBuilderSection({ onAddCustomBrew }: CupBuilderSectionProps) {
  const [baseIdx, setBaseIdx] = useState(0)
  const [milkIdx, setMilkIdx] = useState(0)
  const [sweetIdx, setSweetIdx] = useState(2) // Regular default
  const [vesselIdx, setVesselIdx] = useState(0)
  const [justAdded, setJustAdded] = useState(false)

  const base = BUILDER_OPTS.base[baseIdx]
  const milk = BUILDER_OPTS.milk[milkIdx]
  const vessel = BUILDER_OPTS.vessel[vesselIdx]
  const gudExtra = sweetIdx === 3 ? 10 : 0
  const grandTotal = base.p + milk.p + vessel.p + gudExtra

  // Liquid color calculation
  const liquidColor = milk.v === "No milk" ? base.l : base.l
  const foamColor = milk.v === "No milk" ? "transparent" : base.f

  const handleAdd = () => {
    const brewName = `${base.v} (Custom)`
    const selectedOptions: any = {
      base: { id: base.id, name: base.v, price: base.p },
      milk: { id: milk.id, name: milk.v, price: milk.p },
      sweetness: { id: `sweet-${sweetIdx}`, name: SWEETNESS_LABELS[sweetIdx], price: gudExtra },
      vessel: { id: vessel.id, name: vessel.v, price: vessel.p },
    }

    const customCartItem: CartItem = {
      cartItemId: `custom_${base.id}_${milk.id}_${sweetIdx}_${vessel.id}`,
      name: `${base.v} · ${milk.v}, ${SWEETNESS_LABELS[sweetIdx]}, ${vessel.v}`,
      quantity: 1,
      selectedOptions,
      unitPrice: grandTotal,
      totalPrice: grandTotal,
      menuItem: {
        id: `custom_${base.id}`,
        name: brewName,
        category: "Coffee",
        price: grandTotal,
        description: `Handcrafted ${base.v} with ${milk.v}, ${SWEETNESS_LABELS[sweetIdx]} in ${vessel.v}`,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
        isVeg: true,
      },
    }

    onAddCustomBrew(customCartItem)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <section id="build" className="py-20 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-3 mb-10">
        <span className="font-mono-custom text-xs uppercase tracking-widest text-[var(--accent)]">
          Build a cup
        </span>
        <h2 className="font-display text-5xl sm:text-6xl text-[var(--ink)] leading-[0.9]">
          Your brew,<br />
          your rules.
        </h2>
        <p className="text-xs sm:text-sm text-[var(--muted)] max-w-md">
          Pick a base, your choice of milk, sweetness level and the vessel you sip from.
          The price updates live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Builder Controls */}
        <div className="lg:col-span-7 ghoont-glass rounded-3xl p-6 sm:p-8 space-y-6">
          
          {/* Step 1: Base */}
          <div className="space-y-2.5 pb-6 border-b border-dashed border-[var(--line)]">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[var(--ink)]">Base Brew</span>
              <span className="font-mono-custom text-[var(--faint)]">step 1</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {BUILDER_OPTS.base.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => setBaseIdx(i)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                    baseIdx === i
                      ? "bg-[var(--ink)] text-[var(--on-accent)] border-[var(--ink)] shadow"
                      : "border-[var(--line)] text-[var(--muted)] hover:border-white/40"
                  }`}
                >
                  <span>{b.v}</span>
                  <span className="font-mono-custom ml-1.5 opacity-80">{formatINR(b.p)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Milk */}
          <div className="space-y-2.5 pb-6 border-b border-dashed border-[var(--line)]">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[var(--ink)]">Milk Preference</span>
              <span className="font-mono-custom text-[var(--faint)]">step 2</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {BUILDER_OPTS.milk.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setMilkIdx(i)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                    milkIdx === i
                      ? "bg-[var(--ink)] text-[var(--on-accent)] border-[var(--ink)] shadow"
                      : "border-[var(--line)] text-[var(--muted)] hover:border-white/40"
                  }`}
                >
                  <span>{m.v}</span>
                  {m.p > 0 && (
                    <span className="font-mono-custom ml-1.5 opacity-80">+{formatINR(m.p)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Sweetness Range Slider */}
          <div className="space-y-3 pb-6 border-b border-dashed border-[var(--line)]">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[var(--ink)]">Sweetness Level</span>
              <span className="font-mono-custom text-[var(--accent)]">
                {SWEETNESS_LABELS[sweetIdx]}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={sweetIdx}
              onChange={(e) => setSweetIdx(Number(e.target.value))}
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono-custom text-[var(--faint)]">
              <span>None</span>
              <span>Light</span>
              <span>Regular</span>
              <span>Gud (+₹10)</span>
            </div>
          </div>

          {/* Step 4: Served In / Vessel */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[var(--ink)]">Served in</span>
              <span className="font-mono-custom text-[var(--faint)]">step 4</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {BUILDER_OPTS.vessel.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setVesselIdx(i)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                    vesselIdx === i
                      ? "bg-[var(--ink)] text-[var(--on-accent)] border-[var(--ink)] shadow"
                      : "border-[var(--line)] text-[var(--muted)] hover:border-white/40"
                  }`}
                >
                  <span>{v.v}</span>
                  {v.p > 0 && (
                    <span className="font-mono-custom ml-1.5 opacity-80">+{formatINR(v.p)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Preview & Receipt Card */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between gap-6 text-center border border-[var(--line)] bg-[radial-gradient(circle_at_50%_35%,var(--bg-inner),var(--bg-mid)_70%)]">
          <span className="font-mono-custom text-xs uppercase tracking-widest text-[var(--accent)]">
            Live Cup Preview
          </span>

          {/* Dynamic Cup SVG */}
          <svg className="w-32 h-44 drop-shadow-xl" viewBox="0 0 120 160">
            <path
              d="M14 10h92l-10 140a8 8 0 0 1-8 7H32a8 8 0 0 1-8-7Z"
              fill="rgba(255,255,255,.12)"
              stroke="rgba(255,255,255,.55)"
              strokeWidth="2.5"
            />
            <path
              d="M19 42h82l-8 108a8 8 0 0 1-8 7H35a8 8 0 0 1-8-7Z"
              fill={liquidColor}
              className="transition-colors duration-300"
            />
            {foamColor !== "transparent" && (
              <path
                d="M18 38h84v10H18z"
                fill={foamColor}
                className="transition-colors duration-300"
              />
            )}
          </svg>

          {/* Receipt Breakdown */}
          <div className="w-full font-mono-custom text-xs space-y-2 p-4 rounded-xl bg-black/40 border border-white/10 text-left">
            <div className="flex justify-between text-[var(--muted)]">
              <span>{base.v}</span>
              <span>{formatINR(base.p)}</span>
            </div>
            <div className="flex justify-between text-[var(--muted)]">
              <span>{milk.v}</span>
              <span>{milk.p ? `+${formatINR(milk.p)}` : "—"}</span>
            </div>
            <div className="flex justify-between text-[var(--muted)]">
              <span>{SWEETNESS_LABELS[sweetIdx]}</span>
              <span>{gudExtra ? `+${formatINR(gudExtra)}` : "—"}</span>
            </div>
            <div className="flex justify-between text-[var(--muted)]">
              <span>{vessel.v}</span>
              <span>{vessel.p ? `+${formatINR(vessel.p)}` : "—"}</span>
            </div>

            <div className="pt-2 border-t border-dashed border-[var(--line)] flex justify-between font-bold text-sm text-[var(--ink)]">
              <span>Total</span>
              <span className="text-[var(--accent)]">{formatINR(grandTotal)}</span>
            </div>
          </div>

          {/* Add to Order CTA */}
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-between bg-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.85)] border border-[var(--line)] text-[var(--ink)] pl-6 pr-2 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 group shadow-lg"
          >
            <span>{justAdded ? "Added to Cup!" : "Add to Order"}</span>
            <span className="w-9 h-9 rounded-full bg-[var(--accent)] text-[var(--on-accent)] flex items-center justify-center font-bold text-lg group-hover:rotate-45 transition-transform">
              +
            </span>
          </button>
        </div>

      </div>
    </section>
  )
}
