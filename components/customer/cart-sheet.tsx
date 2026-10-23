"use client"

import React, { useState } from "react"
import { CartItem } from "@/lib/order-store"
import { formatINR } from "@/lib/utils"
import { X, Trash2, ShoppingBag, ArrowRight, MessageSquareText, ShieldCheck } from "lucide-react"

interface CartSheetProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  tableNumber: string
  onUpdateQuantity: (cartItemId: string, newQty: number) => void
  onClearCart: () => void
  onProceedToPay: (cookingNotes: string, customerName: string, customerPhone: string) => void
}

export function CartSheet({
  isOpen,
  onClose,
  items,
  tableNumber,
  onUpdateQuantity,
  onClearCart,
  onProceedToPay,
}: CartSheetProps) {
  const [cookingNotes, setCookingNotes] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  if (!isOpen) return null

  // Calculate bill
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0)
  const gstAmount = Math.round(subtotal * 0.05 * 100) / 100 // 5% GST
  const grandTotal = Math.round(subtotal + gstAmount)

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-stone-900 w-full sm:max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 bg-[#faf7f2] dark:bg-stone-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                Your Table Order
              </h3>
              <p className="text-xs text-stone-500">
                Table <span className="font-bold text-amber-700 dark:text-amber-400">#{tableNumber}</span> • {items.length} items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-stone-400 hover:text-red-600 text-xs flex items-center gap-1 px-2 py-1"
                title="Clear Cart"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center hover:bg-stone-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {items.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-stone-300" />
              <p className="text-sm font-medium">Your cart is empty</p>
              <p className="text-xs text-stone-400 mt-1">Browse our artisanal brews & add items!</p>
            </div>
          ) : (
            <>
              {items.map((item) => {
                const optionsList = Object.values(item.selectedOptions)
                return (
                  <div
                    key={item.cartItemId}
                    className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={item.menuItem?.isVeg ? "veg-badge bg-white" : "non-veg-badge bg-white"} />
                        <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm truncate">
                          {item.name || item.menuItem?.name}
                        </h4>
                      </div>

                      {/* Customization pills */}
                      {optionsList.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {optionsList.map((opt) => (
                            <span
                              key={opt.id}
                              className="text-[10px] bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-1.5 py-0.5 rounded"
                            >
                              {opt.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-stone-500 font-medium mt-1">
                        {formatINR(item.unitPrice)} each
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 px-2 py-0.5 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:text-red-600 font-bold"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:text-amber-700 font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Total for item */}
                    <div className="text-right font-bold text-sm text-stone-900 dark:text-stone-100 shrink-0 w-16">
                      {formatINR(item.totalPrice)}
                    </div>
                  </div>
                )
              })}

              {/* Cooking Notes Input */}
              <div className="pt-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  <MessageSquareText className="w-3.5 h-3.5 text-amber-700" />
                  <span>Notes for the Barista / Kitchen (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Less ice, extra hot, bring sugar cubes..."
                  value={cookingNotes}
                  onChange={(e) => setCookingNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>

              {/* Customer Contact for SMS / Bill info */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    Mobile No. (for bill SMS)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-800"
                  />
                </div>
              </div>

              {/* Bill Details Breakdown */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700 space-y-1.5 text-xs">
                <div className="font-bold text-stone-800 dark:text-stone-200 mb-2 flex items-center justify-between">
                  <span>Bill Breakdown</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded font-semibold">
                    Dine-in charges waived
                  </span>
                </div>

                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Item Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>GST (5% Restaurant Tax)</span>
                  <span>{formatINR(gstAmount)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>Table Service</span>
                  <span className="font-semibold">FREE</span>
                </div>

                <div className="pt-2 border-t border-amber-200 dark:border-stone-700 flex justify-between font-bold text-sm text-stone-900 dark:text-stone-100">
                  <span>Grand Total</span>
                  <span className="text-amber-800 dark:text-amber-400 text-base">
                    {formatINR(grandTotal)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant confirmation • Verified Paytm & UPI Gateway</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 shrink-0">
            <button
              onClick={() => onProceedToPay(cookingNotes, customerName, customerPhone)}
              className="w-full bg-[#002970] hover:bg-[#001f54] text-white py-3.5 px-4 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-between transition-all active:scale-[0.98]"
            >
              <div className="text-left">
                <div className="text-[10px] text-blue-200 uppercase tracking-wider">
                  Pay via Paytm / UPI
                </div>
                <div className="text-base leading-none font-extrabold">
                  {formatINR(grandTotal)}
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl">
                <span>Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
