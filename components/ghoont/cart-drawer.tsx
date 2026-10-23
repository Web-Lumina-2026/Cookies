"use client"

import React, { useState } from "react"
import { CartItem } from "@/lib/order-store"
import { formatINR } from "@/lib/utils"
import { X, Trash2, ArrowRight, MessageSquareText, ShieldCheck } from "lucide-react"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  tableNumber: string
  onUpdateQuantity: (cartItemId: string, newQty: number) => void
  onClearCart: () => void
  onProceedToPay: (cookingNotes: string, customerName: string, customerPhone: string) => void
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  tableNumber,
  onUpdateQuantity,
  onClearCart,
  onProceedToPay,
}: CartDrawerProps) {
  const [cookingNotes, setCookingNotes] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  if (!isOpen) return null

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0)
  const gstAmount = Math.round(subtotal * 0.05 * 100) / 100 // 5% GST
  const grandTotal = Math.round(subtotal + gstAmount)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Scrim Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-over Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6">
        <aside className="w-screen max-w-md bg-[var(--bg-mid)] border-l border-[var(--line)] text-[var(--ink)] flex flex-col justify-between shadow-2xl p-6 overflow-hidden animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
            <div>
              <h3 className="font-display text-4xl text-[var(--ink)]">
                Your Order
              </h3>
              <p className="font-mono-custom text-xs text-[var(--accent)] mt-0.5">
                Dine-in Table #{tableNumber} · {items.length} items
              </p>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-stone-400 hover:text-red-400 p-1.5"
                  title="Clear All"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-[var(--line)] hover:border-white/50 flex items-center justify-center text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of items */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {items.length === 0 ? (
              <div className="py-20 text-center text-[var(--muted)] text-sm space-y-2">
                <p>Nothing in your cup yet.</p>
                <p className="text-xs text-[var(--faint)]">
                  Pick a brew from the menu or build your own cup!
                </p>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-2xl ghoont-glass flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="veg-badge bg-transparent shrink-0" />
                        <h4 className="font-bold text-xs sm:text-sm text-[var(--ink)] truncate">
                          {item.name || item.menuItem?.name}
                        </h4>
                      </div>

                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.values(item.selectedOptions).map((opt) => (
                            <span
                              key={opt.id}
                              className="text-[10px] font-mono-custom bg-[var(--glass-2)] text-[var(--accent)] px-1.5 py-0.2 rounded"
                            >
                              {opt.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="font-mono-custom text-xs text-[var(--muted)] mt-1">
                        {formatINR(item.unitPrice)} each
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 font-mono-custom text-xs bg-black/40 px-2.5 py-1 rounded-full border border-[var(--line)] shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-[var(--muted)] hover:text-white"
                      >
                        −
                      </button>
                      <span className="font-bold text-[var(--ink)] w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-[var(--accent)] font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="font-mono-custom font-bold text-sm text-[var(--accent)] shrink-0 w-16 text-right">
                      {formatINR(item.totalPrice)}
                    </div>
                  </div>
                ))}

                {/* Barista cooking note */}
                <div className="pt-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] mb-1">
                    <MessageSquareText className="w-3.5 h-3.5" />
                    <span>Special Instructions for Barista</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Less ice, extra hot, bring brass tumbler"
                    value={cookingNotes}
                    onChange={(e) => setCookingNotes(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/40 border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                {/* Contact fields */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Mobile no. (SMS receipt)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-[var(--line)] font-mono-custom text-xs space-y-1.5">
                  <div className="flex justify-between text-[var(--muted)]">
                    <span>Item Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--muted)]">
                    <span>GST (5% Restaurant Tax)</span>
                    <span>{formatINR(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Dine-In Table Service</span>
                    <span>FREE</span>
                  </div>
                  <div className="pt-2 border-t border-dashed border-[var(--line)] flex justify-between font-bold text-sm text-[var(--ink)]">
                    <span>Total Amount</span>
                    <span className="text-[var(--accent)] text-base">
                      {formatINR(grandTotal)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Checkout CTA */}
          {items.length > 0 && (
            <div className="pt-4 border-t border-[var(--line)] space-y-2">
              <button
                onClick={() => onProceedToPay(cookingNotes, customerName, customerPhone)}
                className="w-full bg-[var(--accent)] hover:bg-[#edd09f] text-[var(--on-accent)] py-3.5 px-5 rounded-full font-bold text-sm uppercase tracking-wider flex items-center justify-between transition-all active:scale-98 shadow-xl"
              >
                <span>Pay via Paytm / UPI</span>
                <span className="font-mono-custom font-extrabold text-base">
                  {formatINR(grandTotal)}
                </span>
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[var(--faint)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>NPCI Verified • Ready in about 4–6 minutes at Table #{tableNumber}</span>
              </div>
            </div>
          )}

        </aside>
      </div>
    </div>
  )
}
