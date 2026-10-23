"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { Order, OrderStatus } from "@/lib/order-store"
import { apiGetOrders, apiUpdateOrderStatus, apiGetStats, VendorStats } from "@/lib/api"
import { formatINR } from "@/lib/utils"
import {
  ChefHat,
  Coffee,
  CheckCircle2,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  ShoppingBag,
  ArrowLeft,
  QrCode,
} from "lucide-react"

export default function KitchenKDSPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<VendorStats | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("active")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const previousOrderCountRef = useRef<number>(0)

  // Web Audio chime for new incoming orders
  const playChime = useCallback(() => {
    if (!soundEnabled) return
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime) // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15) // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6)

      osc.connect(gain)
      gain.connect(audioCtx.destination)

      osc.start()
      osc.stop(audioCtx.currentTime + 0.6)
    } catch {}
  }, [soundEnabled])

  // Load orders
  const loadData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const fetchedOrders = await apiGetOrders()
      const fetchedStats = await apiGetStats()

      if (
        previousOrderCountRef.current > 0 &&
        fetchedOrders.length > previousOrderCountRef.current
      ) {
        playChime()
      }
      previousOrderCountRef.current = fetchedOrders.length

      setOrders(fetchedOrders)
      setStats(fetchedStats)
    } catch (e) {
      console.error("Failed to load KDS orders", e)
    } finally {
      setIsRefreshing(false)
    }
  }, [playChime])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 3000)
    const channel = new BroadcastChannel("roast_bloom_orders")
    channel.onmessage = () => loadData()

    return () => {
      clearInterval(interval)
      channel.close()
    }
  }, [loadData])

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
    await apiUpdateOrderStatus(orderId, newStatus)
    loadData()
  }

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "active") return o.status === "received" || o.status === "brewing"
    if (statusFilter === "ready") return o.status === "ready"
    if (statusFilter === "served") return o.status === "served"
    return true
  })

  return (
    <div className="min-h-screen bg-[#140a05] text-[#fbf3e6] flex flex-col font-sans selection:bg-[#f2c98a] selection:text-[#1a0f08]">
      
      {/* Top KDS Header */}
      <header className="bg-[#1e110a] border-b border-[rgba(251,243,230,0.14)] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-[rgba(251,243,230,0.06)] border border-[rgba(251,243,230,0.14)] flex items-center justify-center hover:bg-[rgba(251,243,230,0.15)] text-[#fbf3e6] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl text-[#f2c98a] leading-none">
                  Ghoont KDS
                </h1>
                <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-mono-custom font-bold px-2 py-0.5 rounded-full border border-emerald-700/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="font-mono-custom text-[11px] text-[#fbf3e6]/60">
                Barista & Kitchen Display · Table Orders Sync in Real Time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled)
                if (!soundEnabled) playChime()
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono-custom font-semibold border flex items-center gap-1.5 transition-colors ${
                soundEnabled
                  ? "bg-[rgba(251,243,230,0.08)] border-[rgba(251,243,230,0.2)] text-[#f2c98a]"
                  : "bg-red-950/40 border-red-800 text-red-400"
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Chime ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Chime OFF</span>
                </>
              )}
            </button>

            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="p-2 rounded-full bg-[rgba(251,243,230,0.08)] hover:bg-[rgba(251,243,230,0.15)] border border-[rgba(251,243,230,0.18)] text-[#fbf3e6] transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#f2c98a]" : ""}`} />
            </button>

            <Link
              href="/admin/qr"
              className="px-3 py-1.5 rounded-full bg-[rgba(251,243,230,0.08)] border border-[rgba(251,243,230,0.18)] hover:border-[#f2c98a] text-xs font-mono-custom font-bold text-[#fbf3e6] flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-[#f2c98a]" />
              <span>Table QRs</span>
            </Link>

            <Link
              href="/?table=04"
              target="_blank"
              className="bg-[#f2c98a] hover:bg-[#edd09f] text-[#1a0f08] px-3.5 py-1.5 rounded-full text-xs font-mono-custom font-extrabold flex items-center gap-1.5 shadow transition-all"
            >
              <span>Test Customer View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Vendor KPI bar */}
        {stats && (
          <div className="border-t border-[rgba(251,243,230,0.1)] bg-[#140a05]/80 px-4 py-2">
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-custom">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[#fbf3e6]/60">Today's Revenue: </span>
                  <span className="font-extrabold text-[#f2c98a]">
                    {formatINR(stats.totalRevenue)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#f2c98a] shrink-0" />
                <div>
                  <span className="text-[#fbf3e6]/60">Brewing / In Prep: </span>
                  <span className="font-extrabold text-[#f2c98a]">
                    {stats.activeOrders}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="text-[#fbf3e6]/60">Ready for Pickup: </span>
                  <span className="font-extrabold text-blue-300">
                    {stats.readyOrders}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="text-[#fbf3e6]/60">Total Orders: </span>
                  <span className="font-extrabold text-[#fbf3e6]">
                    {stats.totalOrders}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main KDS Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#1e110a] border border-[rgba(251,243,230,0.14)]">
            {[
              { id: "active", label: "Active Brewing", count: orders.filter((o) => o.status === "received" || o.status === "brewing").length },
              { id: "ready", label: "Ready to Serve", count: orders.filter((o) => o.status === "ready").length },
              { id: "served", label: "Completed", count: orders.filter((o) => o.status === "served").length },
              { id: "all", label: "All Orders", count: orders.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono-custom font-bold transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? "bg-[#f2c98a] text-[#1a0f08] shadow"
                    : "text-[#fbf3e6]/60 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span className="bg-black/40 px-1.5 py-0.2 rounded-full text-[10px]">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="text-xs font-mono-custom text-[#fbf3e6]/40 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#f2c98a]" />
            <span>Auto-sync every 3s</span>
          </div>
        </div>

        {/* Orders Card Grid */}
        {filteredOrders.length === 0 ? (
          <div className="py-24 text-center text-[#fbf3e6]/50 space-y-2">
            <ChefHat className="w-12 h-12 mx-auto text-[#f2c98a]/40" />
            <p className="font-display text-2xl text-[#fbf3e6]">No orders in this station</p>
            <p className="font-mono-custom text-xs">
              Customer orders from table scans will appear here live with an audio chime!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const isReceived = order.status === "received"
              const isBrewing = order.status === "brewing"
              const isReady = order.status === "ready"
              const isServed = order.status === "served"

              const elapsedMinutes = Math.floor(
                (Date.now() - new Date(order.createdAt).getTime()) / (60 * 1000)
              )

              return (
                <div
                  key={order.id}
                  className={`rounded-3xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all ${
                    isReceived
                      ? "bg-[#1e110a] border-[#f2c98a] ring-1 ring-[#f2c98a]/40"
                      : isBrewing
                      ? "bg-[#1e110a] border-blue-500/70"
                      : isReady
                      ? "bg-[#1e110a] border-emerald-500/70"
                      : "bg-[#1e110a]/60 border-[rgba(251,243,230,0.1)] opacity-60"
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-[rgba(251,243,230,0.1)] bg-black/30 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-3xl text-[#f2c98a] leading-none">
                          TABLE {order.tableNumber}
                        </span>
                        <span className="text-xs text-[#fbf3e6]/60 font-mono-custom">
                          #{order.id}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono-custom text-[#fbf3e6]/60 mt-1">
                        {order.customerName ? `${order.customerName} · ` : ""}
                        {order.paymentMethod} ({order.paymentStatus})
                      </div>
                    </div>

                    <div className="text-right font-mono-custom">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          isReceived
                            ? "bg-amber-950 text-[#f2c98a] border border-amber-700"
                            : isBrewing
                            ? "bg-blue-950 text-blue-300 border border-blue-800 animate-pulse"
                            : isReady
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        {order.status}
                      </span>
                      <div className="text-[10px] text-[#fbf3e6]/40 mt-1 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{elapsedMinutes}m ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-4 space-y-2.5 flex-1">
                    {order.items.map((item) => {
                      const optionsList = item.selectedOptions
                        ? Object.values(item.selectedOptions)
                        : []

                      return (
                        <div
                          key={item.cartItemId}
                          className="p-3 rounded-2xl bg-black/40 border border-[rgba(251,243,230,0.08)] flex items-start justify-between gap-2"
                        >
                          <div>
                            <div className="text-sm font-bold text-[#fbf3e6] flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#f2c98a] text-[#1a0f08] font-mono-custom text-xs flex items-center justify-center font-black shrink-0">
                                {item.quantity}
                              </span>
                              <span>{item.name || item.menuItem?.name}</span>
                            </div>

                            {optionsList.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5 ml-7">
                                {optionsList.map((opt) => (
                                  <span
                                    key={opt.id}
                                    className="font-mono-custom text-[10px] bg-[rgba(251,243,230,0.08)] text-[#f2c98a] px-1.5 py-0.2 rounded"
                                  >
                                    {opt.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="font-mono-custom text-xs font-bold text-[#f2c98a] shrink-0">
                            {formatINR(item.totalPrice)}
                          </div>
                        </div>
                      )
                    })}

                    {order.cookingNotes && (
                      <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-700/60 text-xs text-[#f2c98a]">
                        <span className="font-bold">Barista Note: </span>
                        {order.cookingNotes}
                      </div>
                    )}
                  </div>

                  {/* Card Action CTA */}
                  <div className="p-3 bg-black/50 border-t border-[rgba(251,243,230,0.1)] flex items-center gap-2">
                    {isReceived && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "brewing")}
                        className="flex-1 bg-[#8a5530] hover:bg-[#6b3d1f] text-[#fbf3e6] py-2.5 px-3 rounded-2xl text-xs font-mono-custom font-bold flex items-center justify-center gap-1.5 shadow transition-all active:scale-98"
                      >
                        <Coffee className="w-4 h-4 text-[#f2c98a]" />
                        <span>Start Brewing</span>
                      </button>
                    )}

                    {isBrewing && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "ready")}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-3 rounded-2xl text-xs font-mono-custom font-bold flex items-center justify-center gap-1.5 shadow transition-all active:scale-98"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Ready for Table</span>
                      </button>
                    )}

                    {isReady && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "served")}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-2xl text-xs font-mono-custom font-bold flex items-center justify-center gap-1.5 shadow transition-all active:scale-98"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Served to Table</span>
                      </button>
                    )}

                    {isServed && (
                      <div className="flex-1 text-center text-xs font-mono-custom font-semibold text-emerald-400 py-1 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Delivered to Table {order.tableNumber}</span>
                      </div>
                    )}
                  </div>

                </div>
              )
            })}
          </div>
        )}

      </main>

    </div>
  )
}
