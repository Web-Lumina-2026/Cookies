"use client"

import React, { useState } from "react"
import { MenuItem, CATEGORIES } from "@/lib/cafe-data"
import { formatINR } from "@/lib/utils"
import { Clock, Plus, Flame, Sparkles } from "lucide-react"

interface MenuGridProps {
  items: MenuItem[]
  category: string
  onCategoryChange: (catId: string) => void
  onItemSelect: (item: MenuItem) => void
  cartQuantities: Record<string, number>
}

export function MenuGrid({
  items,
  category,
  onCategoryChange,
  onItemSelect,
  cartQuantities,
}: MenuGridProps) {
  const [activeCategory, setActiveCategory] = useState(category)

  const handleSelectCategory = (id: string) => {
    setActiveCategory(id)
    onCategoryChange(id)
  }

  return (
    <div className="space-y-4">
      {/* Category Pills Navigation */}
      <div className="sticky top-[108px] z-20 bg-[#faf7f2]/95 dark:bg-stone-900/95 backdrop-blur-md py-2.5 px-4 -mx-4 border-b border-stone-200/60 dark:border-stone-800">
        <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-2xs ${
                  isSelected
                    ? "bg-amber-800 text-white shadow-sm ring-2 ring-amber-800/30 scale-102"
                    : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400"
                }`}
              >
                {cat.id === "hot-coffee" && <Flame className="w-3.5 h-3.5 text-amber-500" />}
                {cat.id === "tea-chai" && <Sparkles className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Menu Item Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-stone-500">
            <p className="text-sm">No items found matching your filter.</p>
          </div>
        ) : (
          items.map((item) => {
            const itemCount = cartQuantities[item.id] || 0
            const hasCustomizations = item.customizations && item.customizations.length > 0

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-3.5 flex gap-3 shadow-2xs hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                {/* Left Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className={item.isVeg ? "veg-badge bg-white shrink-0" : "non-veg-badge bg-white shrink-0"} />
                      {item.bestseller && (
                        <span className="text-[10px] font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          Bestseller
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>

                    {/* Price */}
                    <div className="text-stone-900 dark:text-stone-100 font-bold text-sm mt-1">
                      {formatINR(item.price)}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Metadata: prep time, calories */}
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-400">
                    {item.prepTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {item.prepTime}
                      </span>
                    )}
                    {item.calories && <span>{item.calories}</span>}
                  </div>
                </div>

                {/* Right Image & Add Button */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex flex-col items-center">
                  <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Add Button positioned over bottom of image */}
                  <div className="absolute -bottom-1">
                    <button
                      onClick={() => onItemSelect(item)}
                      className="bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-700/30 px-4 py-1.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1 active:scale-95"
                    >
                      {itemCount > 0 ? (
                        <>
                          <span className="text-amber-900 dark:text-amber-200">({itemCount})</span>
                          <span>ADD +</span>
                        </>
                      ) : (
                        <>
                          <span>ADD</span>
                          <Plus className="w-3 h-3 stroke-[3]" />
                        </>
                      )}
                    </button>
                    {hasCustomizations && (
                      <div className="text-[9px] text-center text-stone-500 mt-0.5 font-medium">
                        Customizable
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
