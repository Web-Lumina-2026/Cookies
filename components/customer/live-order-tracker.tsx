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
  ArrowRight,
  ShieldCheck,
} from "lucide-react"

interface LiveOrderTrackerProps {
  order: Order
  onBackToMenu: () => void
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: "received", label: "Order Received", desc: "Paid via Paytm UPI & sent to barista" },
  { key: "brewing", label: "Brewing & Preparing", desc: "Barista is pulling your fresh brew" },
  { key: "ready", label: "Ready to Serve", desc: "Freshly prepared for Table delivery" },
  { key: "served", label: "Served at Table", desc: "Enjoy your slow sip experience!" },
]

export function LiveOrderTracker({ order: initialOrder, onBackToMenu }: LiveOrderTrackerProps) {
  const [order, setOrder] = useState<Order>(initialOrder)
  const [calledAttendant, setCalledAttendant] = useState(false)

  // Celebratory confetti on mount
  useEffect(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    })
  }, [])

  // Poll for updates every 3 seconds
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
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner Card */}
      <div className="bg-[#1e110a] border border-[#f2c98a]/50 text-[#fbf3e6] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-[#8a5530] text-[#f2c98a] text-[10px] font-mono-custom font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#f2c98a]" />
              Live Order Status
            </span>
            <div className="flex items-center gap-1.5 bg-black/50 border border-[rgba(251,243,230,0.15)] px-3 py-1 rounded-full text-xs font-mono-custom font-bold text-[#f2c98a]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Table {order.tableNumber}</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display text-[#fbf3e6] tracking-tight mt-3">
            Order #{order.id}
          </h2>
          <p className="text-xs font-mono-custom text-[#f2c98a] mt-1">
            Payment verified · {formatINR(order.totalAmount)} ({order.paymentMethod})
          </p>
        </div>

        <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-[#8a5530]/30 rounded-full blur-2xl" />
      </div>

      {/* Progress Timeline Tracker Card */}
      <div className="ghoont-glass rounded-3xl p-6 sm:p-7 border border-[rgba(251,243,230,0.14)] shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-[#fbf3e6] flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#f2c98a]" />
            <span>Preparation Timeline</span>
          </h3>
          <span className="font-mono-custom text-[11px] text-[#fbf3e6]/50 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#f2c98a] animate-spin" />
            Live sync active
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[rgba(251,243,230,0.14)]">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex
            const isCurrent = idx === currentStepIndex

            return (
              <div key={step.key} className="relative flex items-start gap-3">
                {/* Step Circle Indicator */}
                <div
                  className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : isCurrent
                      ? "bg-[#f2c98a] border-[#f2c98a] text-[#1a0f08] ring-4 ring-[#f2c98a]/20 animate-pulse"
                      : "bg-[#140a05] border-[rgba(251,243,230,0.2)] text-[#fbf3e6]/40"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span className="font-mono-custom text-[10px] font-black">{idx + 1}</span>
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1">
                  <div
                    className={`text-sm font-bold leading-tight ${
                      isCurrent
                        ? "text-[#f2c98a]"
                        : isCompleted
                        ? "text-[#fbf3e6]"
                        : "text-[#fbf3e6]/40"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-xs text-[#fbf3e6]/60 mt-0.5">{step.desc}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call Attendant & Action Bar */}
        <div className="pt-3 border-t border-[rgba(251,243,230,0.1)] flex items-center justify-between gap-3">
          <button
            onClick={handleCallAttendant}
            className={`flex-1 py-3 px-4 rounded-full border font-mono-custom text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              calledAttendant
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                : "border-[rgba(251,243,230,0.2)] hover:border-[#f2c98a] bg-black/40 text-[#fbf3e6]"
            }`}
          >
            <BellRing className={`w-4 h-4 ${calledAttendant ? "text-emerald-400" : "text-[#f2c98a]"}`} />
            <span>{calledAttendant ? "Captain Notified!" : "Call Table Attendant"}</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="py-3 px-5 rounded-full bg-[#f2c98a] hover:bg-[#edd09f] text-[#1a0f08] font-mono-custom text-xs font-black flex items-center gap-1.5 shadow transition-all active:scale-95"
          >
            <span>Order More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Ordered Items Breakdown */}
      <div className="ghoont-glass rounded-3xl p-6 border border-[rgba(251,243,230,0.14)] space-y-3">
        <h4 className="font-mono-custom text-xs uppercase tracking-wider text-[#f2c98a]">
          Items in this Brew ({order.items.length})
        </h4>

        <div className="divide-y divide-[rgba(251,243,230,0.08)]">
          {order.items.map((item) => (
            <div key={item.cartItemId} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#fbf3e6]">
                  {item.quantity}x {item.name || item.menuItem?.name}
                </span>
                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                  <div className="font-mono-custom text-[11px] text-[#f2c98a] mt-0.5">
                    {Object.values(item.selectedOptions)
                      .map((o) => o.name)
                      .join(", ")}
                  </div>
                )}
              </div>
              <span className="font-mono-custom font-bold text-[#f2c98a]">
                {formatINR(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        {order.cookingNotes && (
          <div className="p-3 rounded-2xl bg-black/40 border border-[#f2c98a]/30 text-xs text-[#f2c98a]">
            <span className="font-bold">Barista Note: </span> {order.cookingNotes}
          </div>
        )}

        <div className="pt-3 border-t border-[rgba(251,243,230,0.1)] flex justify-between font-mono-custom font-bold text-sm text-[#fbf3e6]">
          <span>Total Paid (Paytm UPI)</span>
          <span className="text-[#f2c98a] text-base">{formatINR(order.totalAmount)}</span>
        </div>
      </div>

    </div>
  )
}
