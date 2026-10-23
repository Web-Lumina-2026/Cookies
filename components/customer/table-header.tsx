"use client"

import React, { useState } from "react"
import { Coffee, MapPin, ChefHat, Sparkles, QrCode } from "lucide-react"
import { CAFE_DETAILS } from "@/lib/cafe-data"
import Link from "next/link"

interface TableHeaderProps {
  tableNumber: string
  onTableChange: (newTable: string) => void
  isVegOnly: boolean
  onToggleVegOnly: (val: boolean) => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function TableHeader({
  tableNumber,
  onTableChange,
  isVegOnly,
  onToggleVegOnly,
  searchQuery,
  onSearchChange,
}: TableHeaderProps) {
  const [showTableModal, setShowTableModal] = useState(false)
  const [tempTable, setTempTable] = useState(tableNumber)

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempTable.trim()) {
      onTableChange(tempTable.trim())
      setShowTableModal(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-amber-950 text-amber-50 shadow-md">
        {/* Top Announcement Bar */}
        <div className="bg-amber-900/90 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between border-b border-amber-800/60">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">Scan • Order • Pay via Paytm / UPI • Served to your table</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/kitchen"
              className="inline-flex items-center gap-1 bg-amber-800 hover:bg-amber-700 text-amber-100 px-2 py-0.5 rounded text-[11px] font-medium transition-colors border border-amber-700"
              title="Open Barista / Kitchen Display"
            >
              <ChefHat className="w-3 h-3 text-amber-300" />
              <span>Barista KDS</span>
            </Link>
            <Link
              href="/admin/qr"
              className="hidden sm:inline-flex items-center gap-1 bg-amber-800 hover:bg-amber-700 text-amber-100 px-2 py-0.5 rounded text-[11px] font-medium transition-colors border border-amber-700"
              title="Print Table QRs"
            >
              <QrCode className="w-3 h-3 text-amber-300" />
              <span>Table QRs</span>
            </Link>
          </div>
        </div>

        {/* Main Branding & Table selector */}
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg sm:text-xl text-amber-50 leading-tight">
                {CAFE_DETAILS.name}
              </h1>
              <p className="text-[11px] text-amber-300/80 hidden sm:block">
                {CAFE_DETAILS.tagline}
              </p>
            </div>
          </div>

          {/* Table Pill */}
          <button
            onClick={() => {
              setTempTable(tableNumber)
              setShowTableModal(true)
            }}
            className="flex items-center gap-2 bg-amber-900/80 hover:bg-amber-800/90 border border-amber-700/80 px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 group text-left"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-amber-300 tracking-wider">
                Dine-In
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1">
                <span>Table {tableNumber || "01"}</span>
                <span className="text-[10px] text-amber-400 group-hover:underline">Edit</span>
              </div>
            </div>
          </button>
        </div>

        {/* Search & Veg Filter Bar */}
        <div className="bg-amber-900/40 border-t border-amber-800/40 px-4 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search coffee, tea, croissants, bites..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-amber-950/80 border border-amber-700/60 rounded-xl px-3.5 py-2 text-sm text-amber-100 placeholder:text-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Veg Only Toggle */}
            <button
              onClick={() => onToggleVegOnly(!isVegOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors shrink-0 ${
                isVegOnly
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                  : "bg-amber-950/50 border-amber-800 text-amber-300 hover:bg-amber-900/60"
              }`}
            >
              <span className="veg-badge bg-white" />
              <span className="font-semibold">Veg Only</span>
            </button>
          </div>
        </div>
      </header>

      {/* Change Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-amber-200 dark:border-stone-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg">
                  Select Table Number
                </h3>
                <p className="text-xs text-stone-500">
                  Orders will be served directly to this table
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveTable} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Table Number
                </label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"].map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTempTable(t)}
                        className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                          tempTable === t
                            ? "bg-amber-700 text-white border-amber-800 shadow"
                            : "bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400"
                        }`}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or enter manually (e.g. Balcony-2)"
                  value={tempTable}
                  onChange={(e) => setTempTable(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-xl border-stone-300 dark:border-stone-700 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowTableModal(false)}
                  className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-amber-700 hover:bg-amber-800 text-white rounded-xl shadow"
                >
                  Confirm Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
