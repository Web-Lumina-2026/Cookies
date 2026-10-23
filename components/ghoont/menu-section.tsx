"use client"

import React, { useState } from "react"
import { MenuItem, CATEGORIES } from "@/lib/cafe-data"
import { formatINR } from "@/lib/utils"

interface MenuSectionProps {
  items: MenuItem[]
  onAddToCart: (item: MenuItem) => void
  cartQuantities: Record<string, number>
}

export function MenuSection({ items, onAddToCart, cartQuantities }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = items.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  )

  return (
    <section id="menu" className="py-20 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <span className="font-mono-custom text-xs uppercase tracking-widest text-[var(--accent)]">
            The menu
          </span>
          <h2 className="font-display text-5xl sm:text-6xl text-[var(--ink)] leading-[0.9]">
            Pour, pick,<br />
            repeat.
          </h2>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 max-w-md">
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            Everything is brewed fresh after you order. Prices include GST. Tap <strong>Add +</strong> to send directly to the Barista Station.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-full bg-[var(--glass)] border border-[var(--line)]">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-[var(--accent)] text-[var(--on-accent)] shadow"
                      : "text-[var(--muted)] hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grid of Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const qty = cartQuantities[item.id] || 0
          return (
            <article
              key={item.id}
              className="ghoont-glass-card rounded-2xl p-5 flex flex-col justify-between gap-3 transition-transform duration-300 hover:-translate-y-1 hover:border-white/30 group"
            >
              <div>
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <h3 className="font-bold text-base text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <span className="font-mono-custom text-sm font-bold text-[var(--accent)] shrink-0">
                    {formatINR(item.price)}
                  </span>
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Bottom footer: Veg indicator + tags + Add button */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--line)]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="veg-badge bg-transparent" title="100% Vegetarian" />
                  {item.tags?.map((t) => (
                    <span
                      key={t}
                      className={`font-mono-custom text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border ${
                        t === "Bestseller"
                          ? "border-[var(--accent)] text-[var(--accent)]"
                          : "border-[var(--line)] text-[var(--faint)]"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onAddToCart(item)}
                  className="flex items-center gap-1.5 bg-[rgba(0,0,0,0.5)] hover:bg-[rgba(0,0,0,0.85)] border border-[var(--line)] hover:border-[var(--accent)] rounded-full py-1 pl-3 pr-1.5 text-xs font-bold text-[var(--ink)] transition-all active:scale-95 shadow-sm"
                >
                  {qty > 0 ? (
                    <span className="text-[var(--accent)] font-mono-custom font-extrabold mr-1">
                      {qty} in cup
                    </span>
                  ) : (
                    <span>Add</span>
                  )}
                  <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-bold text-xs flex items-center justify-center">
                    +
                  </span>
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
