"use client"

import React, { useState, useEffect } from "react"
import { MenuItem, CustomizationOption } from "@/lib/cafe-data"
import { formatINR } from "@/lib/utils"
import { X, Check } from "lucide-react"

interface ItemModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (
    item: MenuItem,
    selectedOptions: Record<string, CustomizationOption>,
    quantity: number
  ) => void
}

export function ItemModal({ item, isOpen, onClose, onAddToCart }: ItemModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, CustomizationOption>>({})
  const [quantity, setQuantity] = useState(1)

  // Initialize defaults whenever item changes
  useEffect(() => {
    if (item && item.customizations) {
      const defaults: Record<string, CustomizationOption> = {}
      item.customizations.forEach((group) => {
        if (group.defaultOptionId) {
          const opt = group.options.find((o) => o.id === group.defaultOptionId)
          if (opt) defaults[group.id] = opt
        } else if (group.required && group.options.length > 0) {
          defaults[group.id] = group.options[0]
        }
      })
      setSelectedOptions(defaults)
      setQuantity(1)
    } else {
      setSelectedOptions({})
      setQuantity(1)
    }
  }, [item])

  if (!isOpen || !item) return null

  // Calculate current unit price
  let currentUnitPrice = item.price
  Object.values(selectedOptions).forEach((opt) => {
    currentUnitPrice += opt.price
  })
  const totalPrice = currentUnitPrice * quantity

  const handleOptionSelect = (groupId: string, option: CustomizationOption, isRequired: boolean) => {
    setSelectedOptions((prev) => {
      const next = { ...prev }
      if (!isRequired && next[groupId]?.id === option.id) {
        delete next[groupId]
      } else {
        next[groupId] = option
      }
      return next
    })
  }

  const handleAdd = () => {
    onAddToCart(item, selectedOptions, quantity)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-stone-900 w-full sm:max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Modal Header Image */}
        <div className="relative h-48 w-full bg-stone-100 shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className={item.isVeg ? "veg-badge bg-white" : "non-veg-badge bg-white"} />
              {item.bestseller && (
                <span className="bg-amber-500/90 text-amber-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Bestseller
                </span>
              )}
            </div>
            <h3 className="font-serif font-bold text-lg sm:text-xl leading-tight">
              {item.name}
            </h3>
            <p className="text-xs text-stone-200 line-clamp-1 mt-0.5">
              {item.description}
            </p>
          </div>
        </div>

        {/* Customization Options List (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {item.customizations && item.customizations.length > 0 ? (
            item.customizations.map((group) => (
              <div key={group.id} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {group.name}
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {group.required ? "Required • Pick 1" : "Optional"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.options.map((option) => {
                    const isSelected = selectedOptions[group.id]?.id === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleOptionSelect(group.id, option, group.required)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-amber-700 bg-amber-50/70 dark:bg-amber-950/40 dark:border-amber-600 ring-1 ring-amber-600"
                            : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                            {option.name}
                          </div>
                          {option.price > 0 && (
                            <div className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">
                              +{formatINR(option.price)}
                            </div>
                          )}
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-amber-700 border-amber-700 text-white"
                              : "border-stone-300 dark:border-stone-700"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-stone-500 py-4 text-center">
              No extra customizations needed for this item. Ready to brew!
            </p>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center gap-3 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-900 px-2 py-1 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 flex items-center justify-center text-stone-700 dark:text-stone-300 disabled:opacity-30 font-bold text-lg"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 flex items-center justify-center text-stone-700 dark:text-stone-300 font-bold text-lg"
            >
              +
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-between transition-colors active:scale-[0.98]"
          >
            <span>Add Item</span>
            <span>{formatINR(totalPrice)}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
