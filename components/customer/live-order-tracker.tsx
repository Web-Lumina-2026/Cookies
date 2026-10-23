"use client"

import React, { useEffect, useState } from "react"
import { Order, OrderStatus } from "@/lib/order-store"
import { apiGetOrderById } from "@/lib/api"
import { formatINR } from "@/lib/utils"
import confetti from "canvas-confetti"
import {
  CheckCircle2,
  Clock,
  Coffee,
  Sparkles,
  MapPin,
  BellRing,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"

interface LiveOrderTrackerProps {
  order: Order
  onBackToMenu: () => void
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: "received", label: "Order Received", desc: "Paid via Paytm UPI & sent to barista" },
  { key: "brewing", label: "Brewing & Preparing", desc: "Barista is crafting your order" },
  { key: "ready", label: "Ready to Serve", desc: "Freshly prepared for Table delivery" },
  { key: "served", label: "Order Completed", desc: "Enjoy your artisanal experience!" },
]

export function LiveOrderTracker({ order: initialOrder, onBackToMenu }: LiveOrderTrackerProps) {
  const [order, setOrder] = useState<Order>(initialOrder)
  const [calledAttendant, setCalledAttendant] = useState(false)

  // Fire celebratory confetti on mount
  useEffect(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    })
  }, [])

  // Poll for status updates every 3 seconds
  useEffect(() => {
    let isMounted = true
    const interval = setInterval(async () => {
      const updated = await apiGetOrderById(order.id)
      if (updated && isMounted) {
        if (updated.status !== order.status && updated.status === "ready") {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } })
        }
        setOrder(updated)
      }
    }, 3000)

    // Listen to BroadcastChannel
    const channel = new BroadcastChannel("roast_bloom_orders")
    channel.onmessage = (e) => {
      if (e.data && e.data.orders) {
        const found = e.data.orders.find((o: Order) => o.id === order.id)
        if (found && isMounted) {
          setOrder(found)
        }
      }
    }

    return () => {
      isMounted = false
      clearInterval(interval)
      channel.close()
    }
  }, [order.id, order.status])

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status)

  const handleCallAttendant = () => {
    setCalledAttendant(true)
    setTimeout(() => setCalledAttendant(false), 5000)
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-5 animate-in fade-in duration-300">
      
      {/* Top Banner Card */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-amber-700/80 text-amber-200 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Live Order Status
            </span>
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold">
              <MapPin className="w-3 h-3 text-amber-300" />
              <span>Table {order.tableNumber}</span>
            </div>
          </div>

          <h2 className="text-2xl font-serif font-black tracking-tight mt-2">
            Order #{order.id}
          </h2>
          <p className="text-xs text-amber-200/90 mt-1">
            Payment verified • {formatINR(order.totalAmount)} ({order.paymentMethod})
          </p>
        </div>

        <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 bg-amber-600/20 rounded-full blur-2xl" />
      </div>

      {/* Progress Timeline Tracker Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-700" />
            <span>Preparation Progress</span>
          </h3>
          <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600 animate-spin" />
            Live sync active
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200 dark:before:bg-stone-800">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex
            const isCurrent = idx === currentStepIndex
            const isPending = idx > currentStepIndex

            return (
              <div key={step.key} className="relative flex items-start gap-3">
                {/* Step Circle Indicator */}
                <div
                  className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : isCurrent
                      ? "bg-amber-700 border-amber-700 text-white ring-4 ring-amber-100 dark:ring-amber-950/80 animate-pulse"
                      : "bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-400"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1">
                  <div
                    className={`text-sm font-bold leading-tight ${
                      isCurrent
                        ? "text-amber-800 dark:text-amber-400"
                        : isCompleted
                        ? "text-stone-900 dark:text-stone-100"
                        : "text-stone-400"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{step.desc}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call Attendant & Refresh Bar */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
          <button
            onClick={handleCallAttendant}
            className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              calledAttendant
                ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                : "border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
            }`}
          >
            <BellRing className={`w-3.5 h-3.5 ${calledAttendant ? "text-emerald-600" : "text-amber-700"}`} />
            <span>{calledAttendant ? "Captain Notified for Table!" : "Call Table Attendant"}</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
          >
            <span>Order More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Ordered Items Summary */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">
          Order Summary ({order.items.length} items)
        </h4>

        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {order.items.map((item) => (
            <div key={item.cartItemId} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {item.quantity}x {item.name || (item as any).menuItem?.name}
                </span>
                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                  <div className="text-[10px] text-amber-800 dark:text-amber-400">
                    {Object.values(item.selectedOptions)
                      .map((o) => o.name)
                      .join(", ")}
                  </div>
                )}
              </div>
              <span className="font-bold text-stone-900 dark:text-stone-100">
                {formatINR(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        {order.cookingNotes && (
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-stone-800/80 text-xs text-amber-900 dark:text-amber-300">
            <span className="font-bold">Barista Note:</span> {order.cookingNotes}
          </div>
        )}

        <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between font-bold text-sm text-stone-900 dark:text-stone-100">
          <span>Total Paid</span>
          <span className="text-amber-800 dark:text-amber-400">{formatINR(order.totalAmount)}</span>
        </div>
      </div>

    </div>
  )
}
