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
  Bell,
  ArrowRight,
  Filter,
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
    } catch {
      // AudioContext not allowed before user gesture
    }
  }, [soundEnabled])

  // Load orders from API
  const loadData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const fetchedOrders = await apiGetOrders()
      const fetchedStats = await apiGetStats()

      // If new orders arrived, trigger chime!
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

  // Initial load and polling every 3 seconds
  useEffect(() => {
    loadData()

    const interval = setInterval(() => {
      loadData()
    }, 3000)

    // Listen to tab broadcast channel for instant updates
    const channel = new BroadcastChannel("roast_bloom_orders")
    channel.onmessage = () => {
      loadData()
    }

    return () => {
      clearInterval(interval)
      channel.close()
    }
  }, [loadData])

  // Handle status update
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
    await apiUpdateOrderStatus(orderId, newStatus)
    loadData()
  }

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "active") return o.status === "received" || o.status === "brewing"
    if (statusFilter === "ready") return o.status === "ready"
    if (statusFilter === "served") return o.status === "served"
    return true // "all"
  })

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      
      {/* Top KDS Bar */}
      <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-white">
                  Barista Station & Kitchen Display (KDS)
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Roast & Bloom Artisanal Roastery • Orders sync in real time
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled)
                if (!soundEnabled) playChime()
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                soundEnabled
                  ? "bg-stone-800 border-stone-700 text-stone-200"
                  : "bg-red-950/40 border-red-800 text-red-400"
              }`}
              title="Toggle audio notification chime on new orders"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chime ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Chime OFF</span>
                </>
              )}
            </button>

            {/* Refresh */}
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 transition-colors"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-amber-400" : ""}`} />
            </button>

            {/* Open Customer Screen in new window to demo */}
            <Link
              href="/?table=03"
              target="_blank"
              className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all"
            >
              <span>Test Customer View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Real-time Vendor KPI Metrics Bar */}
        {stats && (
          <div className="border-t border-stone-800/80 bg-stone-900/60 px-4 py-2">
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-stone-400">Today's Revenue: </span>
                  <span className="font-extrabold text-white text-sm">
                    {formatINR(stats.totalRevenue)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-stone-400">In Prep / Brewing: </span>
                  <span className="font-extrabold text-amber-400 text-sm">
                    {stats.activeOrders}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="text-stone-400">Ready at Counter: </span>
                  <span className="font-extrabold text-blue-400 text-sm">
                    {stats.readyOrders}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="text-stone-400">Total Orders: </span>
                  <span className="font-extrabold text-white text-sm">
                    {stats.totalOrders}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main KDS Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800">
            {[
              { id: "active", label: "Active Brewing", count: orders.filter((o) => o.status === "received" || o.status === "brewing").length },
              { id: "ready", label: "Ready to Serve", count: orders.filter((o) => o.status === "ready").length },
              { id: "served", label: "Completed", count: orders.filter((o) => o.status === "served").length },
              { id: "all", label: "All Orders", count: orders.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? "bg-amber-700 text-white shadow"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <span>{tab.label}</span>
                <span className="bg-black/30 px-1.5 py-0.2 rounded-full text-[10px]">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="text-xs text-stone-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Auto-refreshing every 3s</span>
          </div>
        </div>

        {/* Orders Card Grid */}
        {filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-stone-500 space-y-2">
            <ChefHat className="w-12 h-12 mx-auto text-stone-700" />
            <p className="text-sm font-semibold">No orders in this state</p>
            <p className="text-xs text-stone-600">
              New customer orders from table QR scans will automatically appear here with a chime!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const isReceived = order.status === "received"
              const isBrewing = order.status === "brewing"
              const isReady = order.status === "ready"
              const isServed = order.status === "served"

              // Calculate time elapsed
              const elapsedMinutes = Math.floor(
                (Date.now() - new Date(order.createdAt).getTime()) / (60 * 1000)
              )

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg transition-all ${
                    isReceived
                      ? "bg-stone-900 border-amber-600/80 ring-1 ring-amber-600/50"
                      : isBrewing
                      ? "bg-stone-900 border-blue-500/70"
                      : isReady
                      ? "bg-stone-900 border-emerald-500/70"
                      : "bg-stone-900/50 border-stone-800 opacity-60"
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-stone-800 bg-stone-950/40 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-amber-400 tracking-tight">
                          TABLE {order.tableNumber}
                        </span>
                        <span className="text-xs text-stone-400 font-mono">
                          #{order.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {order.customerName ? `${order.customerName} • ` : ""}
                        {order.paymentMethod} ({order.paymentStatus})
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isReceived
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : isBrewing
                            ? "bg-blue-950 text-blue-300 border border-blue-800 animate-pulse"
                            : isReady
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        {order.status}
                      </span>
                      <div className="text-[10px] text-stone-400 mt-1 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3 text-stone-500" />
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
                          className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-start justify-between gap-2"
                        >
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded bg-amber-800 text-amber-100 text-xs flex items-center justify-center font-black shrink-0">
                                {item.quantity}
                              </span>
                              <span>{item.name || (item as any).menuItem?.name}</span>
                            </div>

                            {/* Customization Badges */}
                            {optionsList.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1 ml-6">
                                {optionsList.map((opt) => (
                                  <span
                                    key={opt.id}
                                    className="text-[10px] bg-amber-900/60 text-amber-300 border border-amber-800/50 px-1.5 py-0.2 rounded font-medium"
                                  >
                                    {opt.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="text-xs font-bold text-stone-300 shrink-0">
                            {formatINR(item.totalPrice)}
                          </div>
                        </div>
                      )
                    })}

                    {/* Barista / Kitchen Cooking Notes */}
                    {order.cookingNotes && (
                      <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-700/60 text-xs text-amber-200">
                        <span className="font-bold text-amber-400">Special Note: </span>
                        {order.cookingNotes}
                      </div>
                    )}
                  </div>

                  {/* Card Action CTA */}
                  <div className="p-3 bg-stone-950/80 border-t border-stone-800 flex items-center gap-2">
                    {isReceived && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "brewing")}
                        className="flex-1 bg-amber-700 hover:bg-amber-600 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all active:scale-98"
                      >
                        <Coffee className="w-4 h-4" />
                        <span>Start Brewing / Cooking</span>
                      </button>
                    )}

                    {isBrewing && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "ready")}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all active:scale-98"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Ready for Table</span>
                      </button>
                    )}

                    {isReady && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "served")}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all active:scale-98"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Mark Delivered to Table</span>
                      </button>
                    )}

                    {isServed && (
                      <div className="flex-1 text-center text-xs font-semibold text-emerald-400 py-1 flex items-center justify-center gap-1">
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
